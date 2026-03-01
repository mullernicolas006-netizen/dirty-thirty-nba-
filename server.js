/**
 * DIRTY THIRTY NBA - Backend Server
 */

const NBA_TEAM_IDS = {
  ATL: 1, BOS: 2, NO: 3, CHI: 4, CLE: 5, DAL: 6, DEN: 7, DET: 8,
  GS: 9, HOU: 10, IND: 11, LAC: 12, LAL: 13, MIA: 14, MIL: 15,
  MIN: 16, BKN: 17, NY: 18, ORL: 19, PHI: 20, PHX: 21, POR: 22,
  SAC: 23, SA: 24, OKC: 25, UTAH: 26, WSH: 27, WAS: 27, TOR: 28, MEM: 29, CHA: 30,
  NOP: 3, GSW: 9, SAS: 24, UTA: 26
};

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3002;
const ESPN_NBA = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba";

// Daily avg points cache
const avgCache = {};
let avgCacheDate = "";

app.use(cors());
app.use(express.json());

async function espnFetch(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
    });
    if (!res.ok) throw new Error(`ESPN ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchAvgPoints(athleteId) {
  try {
    const data = await espnFetch(`https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${athleteId}/overview`);
    const stats = data?.statistics;
    if (!stats) return null;
    const ptsIdx = stats.names?.indexOf("avgPoints") ?? -1;
    if (ptsIdx < 0) return null;
    const seasonRow = Array.isArray(stats.splits)
      ? (stats.splits.find(s => s.displayName === "Regular Season") || stats.splits[0])
      : null;
    if (!seasonRow) return null;
    const val = parseFloat(seasonRow.stats?.[ptsIdx]);
    return isNaN(val) ? null : val;
  } catch {
    return null;
  }
}

async function loadAvgCache(playerIds) {
  const today = new Date().toISOString().slice(0, 10);
  const uncached = playerIds.filter(id => !(id in avgCache));
  if (uncached.length === 0) { avgCacheDate = today; return; }
  console.log(`[AvgCache] Loading ${uncached.length} players...`);
  for (let i = 0; i < uncached.length; i += 15) {
    const batch = uncached.slice(i, i + 15);
    await Promise.allSettled(batch.map(async id => {
      avgCache[id] = await fetchAvgPoints(id);
    }));
  }
  avgCacheDate = today;
  const loaded = Object.values(avgCache).filter(v => v !== null).length;
  console.log(`[AvgCache] Done. ${loaded}/${Object.keys(avgCache).length} with avg.`);
}

app.get("/api/games", async (req, res) => {
  try {
    const now = new Date();
    const estOffset = -5 * 60;
    const estDate = new Date(now.getTime() + (estOffset + now.getTimezoneOffset()) * 60000);
    const date = req.query.date || estDate.toISOString().slice(0, 10).replace(/-/g, "");
    const url = `${ESPN_NBA}/scoreboard?dates=${date}&limit=20`;
    console.log(`[Games] Fetching: ${url}`);
    const data = await espnFetch(url);

    const events = data.events || [];
    if (events.length === 0) {
      for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const nextDate = d.toISOString().slice(0, 10).replace(/-/g, "");
        const nextData = await espnFetch(`${ESPN_NBA}/scoreboard?dates=${nextDate}&limit=20`);
        if (nextData.events?.length > 0) {
          return res.json({ success: true, games: [], players: [], nextGameDate: nextDate });
        }
      }
      return res.json({ success: true, games: [], players: [], nextGameDate: null });
    }

    const games = events.map(e => ({
      id: e.id,
      name: e.name,
      shortName: e.shortName,
      status: e.status?.type?.name,
      statusDisplay: e.status?.type?.shortDetail,
      homeTeam: e.competitions?.[0]?.competitors?.find(c => c.homeAway === "home")?.team?.abbreviation,
      awayTeam: e.competitions?.[0]?.competitors?.find(c => c.homeAway === "away")?.team?.abbreviation,
    }));

    const summaryResults = await Promise.allSettled(
      events.map(e => espnFetch(`${ESPN_NBA}/summary?event=${e.id}`))
    );

    const players = [];

    for (let i = 0; i < summaryResults.length; i++) {
      if (summaryResults[i].status !== "fulfilled") continue;
      const summary = summaryResults[i].value;
      const event = games[i];
      const status = event.status;
      const isScheduled = status === "STATUS_SCHEDULED";

      if (isScheduled) {
        for (const teamAbbr of [event.homeTeam, event.awayTeam]) {
          const teamId = NBA_TEAM_IDS[teamAbbr];
          if (!teamId) { console.warn(`No ID for: ${teamAbbr}`); continue; }
          try {
            const rosterData = await espnFetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`);
            const teamName = rosterData.team?.displayName || teamAbbr;
            const athletes = rosterData.athletes || [];
            console.log(`[Roster] ${teamAbbr} (${teamId}): ${athletes.length} players`);
            for (const a of athletes) {
              if (!a?.id) continue;
              const isOut = a.injuries?.some(inj => inj.status === "Out");
              if (isOut) continue;
              players.push({
                id: String(a.id),
                name: a.displayName || a.fullName || a.shortName,
                team: teamAbbr, teamName,
                position: a.position?.abbreviation || "",
                points: null, avgPoints: null,
                status, gameId: event.id, gameName: event.shortName, isStarter: false,
              });
            }
          } catch (e) { console.warn(`Roster failed for ${teamAbbr}:`, e.message); }
        }
        continue;
      }

      // Live/finished: box score
      for (const teamData of summary.boxscore?.players || []) {
        const teamAbbr = teamData.team?.abbreviation || "";
        const teamName = teamData.team?.displayName || "";
        const statBlock = teamData.statistics?.[0];
        if (!statBlock) continue;
        const labels = statBlock.labels || [];
        const ptsIdx = labels.indexOf("PTS");
        for (const athlete of statBlock.athletes || []) {
          const a = athlete.athlete;
          if (!a) continue;
          const pts = ptsIdx >= 0 ? parseInt(athlete.stats?.[ptsIdx]) || 0 : 0;
          players.push({
            id: String(a.id),
            name: a.displayName || a.fullName || a.shortName,
            team: teamAbbr, teamName,
            position: a.position?.abbreviation || "",
            points: pts, avgPoints: null,
            status, gameId: event.id, gameName: event.shortName,
            isStarter: athlete.starter === true,
          });
        }
      }
    }

    // Load avg points for all players
    const allIds = [...new Set(players.map(p => p.id))];
    await loadAvgCache(allIds);
    for (const p of players) {
      if (avgCache[p.id] != null) p.avgPoints = avgCache[p.id];
    }

    const finalPlayers = players;

    console.log(`[Games] ${games.length} games, ${finalPlayers.length} players`);
    res.json({ success: true, games, players: finalPlayers, nextGameDate: null });

  } catch (err) {
    console.error("[Games] Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/live-scores", async (req, res) => {
  try {
    const gameIds = (req.query.games || "").split(",").filter(Boolean);
    if (gameIds.length === 0) return res.json({ success: true, players: [] });
    const results = await Promise.allSettled(
      gameIds.map(id => espnFetch(`${ESPN_NBA}/summary?event=${id}`))
    );
    const players = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].status !== "fulfilled") continue;
      const summary = results[i].value;
      const gameId = gameIds[i];
      const status = summary.header?.competitions?.[0]?.status?.type?.name || "STATUS_SCHEDULED";
      for (const teamData of summary.boxscore?.players || []) {
        const statBlock = teamData.statistics?.[0];
        if (!statBlock) continue;
        const labels = statBlock.labels || [];
        const ptsIdx = labels.indexOf("PTS");
        for (const athlete of statBlock.athletes || []) {
          const a = athlete.athlete;
          if (!a) continue;
          const pts = ptsIdx >= 0 ? parseInt(athlete.stats?.[ptsIdx]) || 0 : 0;
          players.push({
            id: a.id,
            points: status === "STATUS_IN_PROGRESS" || status === "STATUS_FINAL" ? pts : null,
            status, gameId,
          });
        }
      }
    }
    res.json({ success: true, players });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ── SERVER-SIDE PICK UPDATER ─────────────────────────────────────
const SUPABASE_URL = "https://ygykuhcwpfltfgehvphg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlneWt1aGN3cGZsdGZnZWh2cGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4Nzc3OTIsImV4cCI6MjA4NzQ1Mzc5Mn0.4yMdYVvYSP6qUZmgFoaQlBzxnrT59ulKb1oJXEIFhsg";

async function sbFetch(path, options = {}) {
  const res = await require("node-fetch")(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=representation", ...options.headers },
  });
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function todayStr() {
  const now = new Date();
  const est = new Date(now.getTime() + (-5 * 60 + now.getTimezoneOffset()) * 60000 - 6 * 60 * 60 * 1000);
  return est.toISOString().slice(0, 10);
}

async function updateAllPicksWithLiveScores() {
  try {
    const date = todayStr();
    const picks = await sbFetch(`picks?date=eq.${date}&select=*`);
    if (!picks || picks.length === 0) return;
    const now = new Date();
    const estDate = new Date(now.getTime() + (-5 * 60 + now.getTimezoneOffset()) * 60000);
    const dateStr = estDate.toISOString().slice(0, 10).replace(/-/g, "");
    const scoreData = await espnFetch(`${ESPN_NBA}/scoreboard?dates=${dateStr}&limit=20`);
    const events = scoreData.events || [];
    const activeGames = events.filter(e => e.status?.type?.name === "STATUS_IN_PROGRESS" || e.status?.type?.name === "STATUS_FINAL");
    if (activeGames.length === 0) return;
    const playerPoints = {};
    const summaries = await Promise.allSettled(activeGames.map(e => espnFetch(`${ESPN_NBA}/summary?event=${e.id}`)));
    for (const result of summaries) {
      if (result.status !== "fulfilled") continue;
      const summary = result.value;
      for (const teamData of summary.boxscore?.players || []) {
        const statBlock = teamData.statistics?.[0];
        if (!statBlock) continue;
        const ptsIdx = (statBlock.labels || []).indexOf("PTS");
        for (const athlete of statBlock.athletes || []) {
          const a = athlete.athlete;
          if (!a) continue;
          playerPoints[String(a.id)] = ptsIdx >= 0 ? parseInt(athlete.stats?.[ptsIdx]) || 0 : 0;
        }
      }
    }
    for (const pick of picks) {
      const p1pts = pick.p1_id && playerPoints[pick.p1_id] !== undefined ? playerPoints[pick.p1_id] : pick.p1_pts;
      const p2pts = pick.p2_id && playerPoints[pick.p2_id] !== undefined ? playerPoints[pick.p2_id] : pick.p2_pts;
      if (p1pts === pick.p1_pts && p2pts === pick.p2_pts) continue;
      await sbFetch(`picks?id=eq.${encodeURIComponent(pick.id)}`, { method: "PATCH", body: JSON.stringify({ p1_pts: p1pts, p2_pts: p2pts, updated_at: Date.now() }) });
    }
    console.log(`[PickUpdater] Updated ${picks.length} picks`);
  } catch (e) { console.warn("[PickUpdater] Error:", e.message); }
}

setInterval(updateAllPicksWithLiveScores, 30000);
console.log("[PickUpdater] Started");

app.get("/health", (req, res) => res.json({ status: "ok", service: "dirty-thirty-nba" }));
app.listen(PORT, () => console.log(`Dirty Thirty NBA server running on port ${PORT}`));
