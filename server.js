/**
 * DIRTY THIRTY NBA - Backend Server
 * Fetches live NBA player data from ESPN API
 * Deploy on Render.com
 */

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3002;

const ESPN_NBA = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba";
const ESPN_NBA_WEB = "https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba";

app.use(cors());
app.use(express.json());

async function espnFetch(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DirtyThirtyNBA/1.0)",
        "Accept": "application/json",
      },
    });
    if (!res.ok) throw new Error(`ESPN returned ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

// GET /api/games - Today's NBA games with all players
app.get("/api/games", async (req, res) => {
  try {
    const now = new Date();
    // Use EST timezone (UTC-5) to match NBA schedule
    const estOffset = -5 * 60;
    const estDate = new Date(now.getTime() + (estOffset + now.getTimezoneOffset()) * 60000);
    const date = req.query.date || estDate.toISOString().slice(0, 10).replace(/-/g, "");
    const url = `${ESPN_NBA}/scoreboard?dates=${date}&limit=20`;
    console.log(`[Games] Fetching: ${url}`);
    const data = await espnFetch(url);

    const events = data.events || [];
    if (events.length === 0) {
      // Look ahead 7 days for next games
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

    // Fetch box scores for all games in parallel
    const playerResults = await Promise.allSettled(
      events.map(e => espnFetch(`${ESPN_NBA}/summary?event=${e.id}`))
    );

    const players = [];
    for (let i = 0; i < playerResults.length; i++) {
      if (playerResults[i].status !== "fulfilled") continue;
      const summary = playerResults[i].value;
      const event = events[i];
      const status = event.status?.type?.name;

      const boxPlayers = summary.boxscore?.players || [];
      for (const teamData of boxPlayers) {
        const teamAbbr = teamData.team?.abbreviation || "";
        const teamName = teamData.team?.displayName || "";
        const statistics = teamData.statistics || [];
        const statBlock = statistics[0];
        if (!statBlock) continue;

        const labels = statBlock.labels || [];
        const ptsIdx = labels.indexOf("PTS");

        for (const athlete of statBlock.athletes || []) {
          const a = athlete.athlete;
          if (!a) continue;
          const pts = ptsIdx >= 0 ? parseInt(athlete.stats?.[ptsIdx]) || 0 : 0;
          const isStarter = athlete.starter === true;

          players.push({
            id: a.id,
            name: a.displayName || a.fullName || a.shortName,
            team: teamAbbr,
            teamName,
            points: status === "STATUS_IN_PROGRESS" || status === "STATUS_FINAL" ? pts : null,
            status,
            gameId: event.id,
            gameName: event.shortName,
            isStarter,
          });
        }
      }
    }

    // Filter to starters only, or all if no starters found
    const starters = players.filter(p => p.isStarter);
    const finalPlayers = starters.length > 0 ? starters : players;

    console.log(`[Games] Found ${games.length} games, ${finalPlayers.length} players`);
    res.json({ success: true, games, players: finalPlayers, nextGameDate: null });

  } catch (err) {
    console.error("[Games] Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/live-scores - Refresh player points
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
        const teamAbbr = teamData.team?.abbreviation || "";
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
            status,
            gameId,
          });
        }
      }
    }

    res.json({ success: true, players });
  } catch (err) {
    console.error("[Live] Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok", service: "dirty-thirty-nba" }));

app.listen(PORT, () => console.log(`Dirty Thirty NBA server running on port ${PORT}`));
