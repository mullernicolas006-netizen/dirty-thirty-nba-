import { useState, useEffect, useRef } from "react";

const API = "https://dirty-thirty-nba.onrender.com/api";
const REFRESH_INTERVAL = 30000;
const LOGO = "data:image/webp;base64,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";

const C = {
  bg: "#0a0e1a", surface: "#111827", card: "#151d2e", cardHover: "#1a2540",
  border: "#1e2d4a", accent: "#c9a84c", accentDim: "rgba(201,168,76,0.12)",
  accentGlow: "rgba(201,168,76,0.25)", gold: "#c9a84c", goldDim: "rgba(201,168,76,0.12)",
  green: "#22c55e", red: "#ef4444", orange: "#f97316",
  text: "#e8edf5", muted: "#4a6080", subtle: "#1e2d4a",
};

const API_BASE = "https://dirty-thirty-nba.onrender.com";
const SUPABASE_URL = "https://ygykuhcwpfltfgehvphg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlneWt1aGN3cGZsdGZnZWh2cGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4Nzc3OTIsImV4cCI6MjA4NzQ1Mzc5Mn0.4yMdYVvYSP6qUZmgFoaQlBzxnrT59ulKb1oJXEIFhsg";

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) { const t = await res.text(); throw new Error(t); }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const db = {
  async getUser(id) {
    try {
      const rows = await sbFetch(`users?id=eq.${encodeURIComponent(id)}&select=*`);
      return rows?.[0] || null;
    } catch { return null; }
  },
  async saveUser(user) {
    try {
      await sbFetch("users", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({ id: user.id, name: user.name, email: user.email, joined: user.joined, frat: user.frat || null }),
      });
    } catch(e) { console.error("saveUser error", e); }
  },
  async getAllUsers() {
    try {
      return await sbFetch("users?select=*&order=joined.asc") || [];
    } catch { return []; }
  },
  async savePick(pick) {
    try {
      await sbFetch("picks", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(pick),
      });
    } catch(e) { console.error("savePick error", e); }
  },
  async getPick(userId, date) {
    try {
      const rows = await sbFetch(`picks?user_id=eq.${encodeURIComponent(userId)}&date=eq.${date}&select=*`);
      return rows?.[0] || null;
    } catch { return null; }
  },
  async getFrats() {
    try { return await sbFetch("frats?select=*&order=name.asc") || []; } catch { return []; }
  },
  async getPickDates() {
    try {
      const rows = await sbFetch("picks?select=date&order=date.desc") || [];
      const unique = [...new Set(rows.map(r => r.date))];
      return unique;
    } catch { return []; }
  },
  async getAllPicksForDate(date) {
    try {
      return await sbFetch(`picks?date=eq.${date}&select=*`) || [];
    } catch { return []; }
  },
};

async function apiFetch(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

function todayStr() { const now = new Date(); return new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" })).toLocaleDateString("en-CA"); }
function scoreDelta(score) { if (score === null || score > 30) return null; return 30 - score; }
function rankEntries(entries) {
  const valid = entries.filter(e => e.total !== null && e.total <= 30);
  const busts = entries.filter(e => e.total !== null && e.total > 30);
  const pending = entries.filter(e => e.total === null);
  valid.sort((a, b) => scoreDelta(a.total) - scoreDelta(b.total));
  return [...valid, ...busts, ...pending];
}

function validateEmail(email) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(email);
}

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: ${C.bg}; color: ${C.text}; font-family: 'Inter', sans-serif; }
      input, button { font-family: inherit; } input::placeholder { color: ${C.muted}; } input:focus { outline: none; }
      @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      @keyframes spin { to { transform:rotate(360deg); } }
      @keyframes glow { 0%,100% { box-shadow:0 0 0 0 ${C.accentGlow}; } 50% { box-shadow:0 0 20px 6px ${C.accentGlow}; } }
      .fu { animation: fadeUp 0.35s ease both; }
      .blink { animation: pulse 1.2s infinite; }
      .spin { animation: spin 0.8s linear infinite; }
    `}</style>
  );
}

function Spinner({ size = 24 }) {
  return <div className="spin" style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${C.border}`, borderTopColor: C.accent }} />;
}

function Badge({ label, color = C.muted, blink = false }) {
  return (
    <span className={blink ? "blink" : ""} style={{
      fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: 1.5, color,
      padding: "2px 7px", borderRadius: 4, border: `1px solid ${color}44`, background: `${color}0d`,
    }}>{label}</span>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [frat, setFrat] = useState("");
  const [frats, setFrats] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sbFetch("frats?select=*&order=name.asc").then(r => setFrats(r || [])).catch(() => {});
  }, []);

  async function submit() {
    if (!name.trim()) return setErr("Name is required");
    if (!email.trim()) return setErr("Email is required");
    if (!validateEmail(email.trim())) return setErr("Please enter a valid email address (e.g. name@domain.com)");
    if (!emailConfirm.trim()) return setErr("Please confirm your email address");
    if (email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase()) return setErr("Email addresses do not match");
    if (!frat) return setErr("Please select your fraternity or organization");
    
    setLoading(true);
    const emailLower = email.trim().toLowerCase();
    const id = `user_${emailLower.replace(/[^a-z0-9]/gi, "_")}`;

    // Check if email already registered by a different name
    try {
      const existing = await sbFetch(`users?id=eq.${encodeURIComponent(id)}&select=*`);
      if (existing?.[0] && existing[0].name !== name.trim()) {
        setLoading(false);
        return setErr("This email is already registered. Please use a different email.");
      }
    } catch {}

    const user = { id, name: name.trim(), email: emailLower, joined: Date.now(), frat };
    await db.saveUser(user);
    localStorage.setItem("d30_user", JSON.stringify(user));
    onLogin(user);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentGlow} 0%, transparent 65%)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
        <div className="fu" style={{ width: "100%", maxWidth: 400, position: "relative" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#033dff", display: "flex", alignItems: "center", justifyContent: "center" }}><img src={LOGO} alt="BeatM Logo" style={{ width: 38, height: 38, objectFit: "contain", filter: "brightness(0) invert(1)" }} /></div>
              <span style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 15, color: "#eef0f4", letterSpacing: 0.5 }}>by BeatM</span>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 84, lineHeight: 0.88, letterSpacing: -1 }}>
              <div style={{ color: C.text }}>DIRTY</div>
              <div style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>THIRTY</div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.muted, letterSpacing: 3, marginTop: 14 }}>NBA 2025-26 · DAILY FANTASY</div>
          </div>

          <div style={{ background: C.goldDim, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: "13px 18px", marginBottom: 20 }}>
            <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.gold, lineHeight: 1.9, letterSpacing: 0.3 }}>
              🏀 Pick 2+ NBA Players from different teams<br/>
              📊 Combined Points = your score<br/>
              🎯 Closest to 30 wins · 💥 Over 30 = Bust
            </p>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28 }}>
            {[["name", "text", "Your Name"], ["email", "email", "your@email.com"]].map(([field, type, ph]) => (
              <div key={field} style={{ marginBottom: field === "name" ? 16 : 22 }}>
                <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, letterSpacing: 2, display: "block", marginBottom: 7 }}>{field.toUpperCase()}</label>
                <input type={type} placeholder={ph}
                  value={field === "name" ? name : email}
                  onChange={e => { field === "name" ? setName(e.target.value) : setEmail(e.target.value); setErr(""); }}
                  onKeyDown={e => e.key === "Enter" && submit()}
                  style={{ width: "100%", padding: "11px 14px", background: C.surface, border: `1px solid ${err && ((field === "email" && err.toLowerCase().includes("mail")) || (field === "name" && err.toLowerCase().includes("name"))) ? C.red : C.border}`, borderRadius: 8, color: C.text, fontSize: 14 }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, letterSpacing: 2, display: "block", marginBottom: 7 }}>CONFIRM EMAIL</label>
              <input type="email" placeholder="your@email.com"
                value={emailConfirm} onChange={e => { setEmailConfirm(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
                style={{ width: "100%", padding: "11px 14px", background: C.surface, border: `1px solid ${err.includes("match") ? C.red : C.border}`, borderRadius: 8, color: C.text, fontSize: 14 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, letterSpacing: 2, display: "block", marginBottom: 7 }}>WHICH FRAT ARE YOU A PART OF?</label>
              <select value={frat} onChange={e => { setFrat(e.target.value); setErr(""); }}
                style={{ width: "100%", padding: "11px 14px", background: C.surface, border: `1px solid ${err.includes("frat") ? C.red : C.border}`, borderRadius: 8, color: frat ? C.text : C.muted, fontSize: 14, cursor: "pointer" }}>
                <option value="">Select your organization...</option>
                {frats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                <option value="independent">Independent / None</option>
              </select>
            </div>
            {err && <p style={{ color: C.red, fontFamily: "'JetBrains Mono'", fontSize: 11, marginBottom: 14, lineHeight: 1.5 }}>⚠ {err}</p>}
            <button onClick={submit} disabled={loading} style={{ width: "100%", padding: 13, background: C.accent, border: "none", borderRadius: 8, color: "#fff", fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 22, letterSpacing: 3, cursor: "pointer", animation: "glow 2s infinite" }}>
              {loading ? "..." : "LET'S PLAY"}
            </button>
            <p style={{ fontFamily: "'Inter'", fontSize: 11, color: C.muted, textAlign: "center", marginTop: 14, lineHeight: 1.7 }}>
              By signing up, you agree to join the <span style={{ color: C.text, fontWeight: 500 }}>BeatM Waitlist</span> and be among the first to access new products, exclusive drops, and early-stage updates.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${C.border}`, padding: "16px 24px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
      background: C.bg,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#033dff", display: "flex", alignItems: "center", justifyContent: "center" }}><img src={LOGO} alt="BeatM" style={{ width: 16, height: 16, objectFit: "contain", filter: "brightness(0) invert(1)" }} /></div>
        <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 600, fontSize: 10, color: "#eef0f4", letterSpacing: 1 }}>by BeatM</span>
      </div>
      <span style={{ color: C.border }}>·</span>
      <a href="https://beatm.org" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, letterSpacing: 1, textDecoration: "none", borderBottom: `1px solid ${C.muted}44` }}>
        beatm.org
      </a>
      <span style={{ color: C.border }}>·</span>
      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, letterSpacing: 1 }}>NBA 2025-26</span>
    </footer>
  );
}

// ── HEADER ────────────────────────────────────────────────────────
function Header({ tab, setTab, user, liveCount }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: `${C.bg}f2`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#033dff", display: "flex", alignItems: "center", justifyContent: "center" }}><img src={LOGO} alt="BeatM" style={{ width: 22, height: 22, objectFit: "contain", filter: "brightness(0) invert(1)" }} /></div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 22, color: C.accent }}>DIRTY</span>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 22, background: `linear-gradient(90deg,${C.gold},${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>THIRTY</span>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 16, color: C.accent, marginLeft: 6, border: `1px solid ${C.accent}`, borderRadius: 4, padding: "1px 6px" }}>NBA</span>
          </div>
          {liveCount > 0 && <span style={{ marginLeft: 4 }}><Badge label={`${liveCount} LIVE`} color={C.green} blink /></span>}
        </div>
        <nav style={{ display: "flex", gap: 2 }}>
          {[["pick","PICK"],["leaderboard","BOARD"],["results","RESULTS"],["fratvsfrat","FRAT VS FRAT"]].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: 1, background: tab===t ? `${C.accent}22` : "transparent", color: tab===t ? C.accent : C.muted, borderBottom: `2px solid ${tab===t ? C.accent : "transparent"}` }}>{l}</button>
          ))}
        </nav>
        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.muted }}>{user.name}</div>
      </div>
    </header>
  );
}

// ── PLAYER CARD ───────────────────────────────────────────────────
function PlayerCard({ player, selected, onToggle, disabled }) {
  const [hov, setHov] = useState(false);
  const canSelect = !player.isLocked && (!disabled || selected);
  const statusLabel = player.isOver ? "FINAL" : player.isLive ? "LIVE" : player.isLocked ? "LOCKED" : "UPCOMING";
  const statusColor = player.isOver ? C.muted : player.isLive ? C.green : player.isLocked ? C.red : C.orange;

  return (
    <div onClick={() => canSelect && onToggle(player)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: selected ? C.accentDim : hov && canSelect ? C.cardHover : C.card, border: `1px solid ${selected ? C.accent : hov && canSelect ? C.subtle : C.border}`, borderRadius: 10, padding: "11px 14px", cursor: canSelect ? "pointer" : "not-allowed", opacity: player.isLocked && !selected ? 0.45 : 1, transition: "all 0.13s", display: "flex", gap: 11, alignItems: "center", position: "relative" }}>
      {selected && <div style={{ position: "absolute", left: 0, top: "18%", bottom: "18%", width: 3, background: C.accent, borderRadius: "0 2px 2px 0" }} />}
      <div style={{ width: 42, height: 42, borderRadius: 8, flexShrink: 0, overflow: "hidden", background: C.subtle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {player.headshot ? <img src={player.headshot} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: C.muted }}>{player.position}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</div>
        <div style={{ display: "flex", gap: 5, marginTop: 3, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.accent, fontWeight: 700 }}>{player.team}</span>
          <span style={{ color: C.border }}>·</span>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted }}>{player.position || "—"}</span>
          {player.gameName && <><span style={{ color: C.border }}>·</span><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted }}>{player.gameName}</span></>}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {player.points !== null && <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 24, color: C.gold, lineHeight: 1 }}>{player.points}<span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: C.muted, fontWeight: 400 }}> pts</span></div>}
        {player.avgPoints != null && player.avgPoints > 0 && <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.accent, marginTop: 1 }}>⌀ {Number(player.avgPoints).toFixed(1)} ppg</div>}
        <div style={{ marginTop: 3 }}><Badge label={statusLabel} color={statusColor} blink={player.isLive} /></div>
      </div>
    </div>
  );
}

// ── PICK SCREEN ───────────────────────────────────────────────────
function PickScreen({ user, players, picks, setPicks, loading, error, nextGameDate, lockedIn, setLockedIn, savePicks }) {
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");

  const pick1 = picks[0], pick2 = picks[1];
  const bothPicked = picks.length >= 2 && new Set(picks.map(p => p?.team)).size >= 2;
  const total = picks.length >= 1 && picks.some(p => p?.points !== null) ? picks.reduce((sum, p) => sum + (p?.points ?? 0), 0) : null;
  const isBust = total !== null && total > 30;
  const isLive = picks.some(p => p?.isLive);
  const teams = ["ALL", ...new Set(players.map(p => p.team).filter(Boolean).sort())];
  const filtered = players.filter(p => (teamFilter === "ALL" || p.team === teamFilter) && (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase())));

  function toggle(player) {
    if (lockedIn) return;
    if (picks.some(p => p?.id === player.id)) {
      setPicks(prev => prev.filter(p => p?.id !== player.id));
      return;
    }
    setPicks(prev => [...prev, player]);
  }

  const scoreColor = total === null ? C.muted : isBust ? C.red : total === 30 ? C.gold : C.green;

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px" }}>
      <div className="fu" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 38, letterSpacing: 1 }}>TODAY'S <span style={{ color: C.accent }}>PICKS</span></h1>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 3 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
          {nextGameDate && <span style={{ color: C.orange, marginLeft: 8 }}>· NEXT GAMES: {nextGameDate}</span>}
        </p>
      </div>

      {/* Score card */}
      <div className="fu" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
          {picks.length === 0 && <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.muted }}>— No players selected</div>}
          {picks.map((pick, i) => (
            <div key={pick.id} style={{ display: "flex", alignItems: "center", gap: 8, background: C.accentDim, border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 12, color: C.text }}>{pick.name}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.accent, fontWeight: 700 }}>{pick.team}</span>
                  {pick.position && <><span style={{ color: C.border }}>·</span><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted }}>{pick.position}</span></>}
                  {pick.avgPoints != null && pick.avgPoints > 0 && <><span style={{ color: C.border }}>·</span><span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted }}>⌀ {Number(pick.avgPoints).toFixed(1)} ppg</span></>}
                </div>
              </div>
              {pick.points !== null && <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 18, color: C.gold, marginLeft: 4 }}>{pick.points}<span style={{ fontSize: 9, fontFamily: "'JetBrains Mono'", color: C.muted, fontWeight: 400 }}> pts</span></div>}
              {!lockedIn && <button onClick={() => setPicks(prev => prev.filter(p => p.id !== pick.id))} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 11, lineHeight: 1, marginLeft: 2 }}>✕</button>}
            </div>
          ))}
          {!lockedIn && picks.length >= 1 && <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, alignSelf: "center" }}>+ select more</div>}
        </div>
        <div style={{ textAlign: "center" }}>
          {isLive && <Badge label="LIVE" color={C.green} blink />}
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 60, lineHeight: 1, color: scoreColor, marginTop: 2 }}>{total !== null ? total : "—"}</div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: scoreColor, letterSpacing: 1, marginTop: 1 }}>
            {total !== null ? isBust ? "💥 BUST!" : total === 30 ? "🎯 PERFECT!" : `${30 - total} FROM 30` : "/ 30"}
          </div>
          {!lockedIn && (
            <div style={{ marginTop: 10 }}>
              <button onClick={async () => {
                if (!bothPicked) return;
                setLockedIn(true); await savePicks(true);
              }} style={{ padding: "9px 22px", background: bothPicked ? C.accent : C.muted, border: "none", borderRadius: 8, color: bothPicked ? "#fff" : C.bg, fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, letterSpacing: 2, cursor: bothPicked ? "pointer" : "default", opacity: bothPicked ? 1 : 0.5, transition: "all 0.2s" }}>
                🔒 LOCK IN
              </button>
              {!bothPicked && picks.length > 0 && (
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, marginTop: 6, letterSpacing: 0.5 }}>
                  {picks.length < 2 ? "Select at least 2 players" : "Pick players from different teams"}
                </div>
              )}
            </div>
          )}
          {lockedIn && (
            <div style={{ marginTop: 10, padding: "6px 16px", background: `${C.green}22`, border: `1px solid ${C.green}55`, borderRadius: 8, fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.green, letterSpacing: 1 }}>
              ✅ LOCKED IN
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{ background: `${C.red}11`, border: `1px solid ${C.red}44`, borderRadius: 10, padding: "11px 16px", marginBottom: 18, fontFamily: "'JetBrains Mono'", fontSize: 11, color: C.red }}>
          ⚠ Backend unavailable — please try again in a moment.
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players..." style={{ flex: 1, minWidth: 160, padding: "7px 12px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13 }} />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {teams.map(t => (
            <button key={t} onClick={() => setTeamFilter(t)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${teamFilter === t ? C.accent : C.border}`, background: teamFilter === t ? C.accentDim : "transparent", color: teamFilter === t ? C.accent : C.muted, fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: 1, cursor: "pointer" }}>{t}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={32} /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(285px, 1fr))", gap: 7 }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="fu" style={{ animationDelay: `${i * 0.018}s` }}>
              <PlayerCard player={p} selected={picks.some(pp => pp?.id === p.id)} onToggle={toggle} disabled={false} />
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: C.muted, fontFamily: "'JetBrains Mono'", fontSize: 11 }}>
              {error ? "BACKEND UNAVAILABLE" : (
                <div>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🏀</div>
                  <div style={{ color: C.muted, marginBottom: 8 }}>NO NBA GAMES TODAY</div>
                  <div style={{ color: C.subtle, fontSize: 10, marginTop: 4 }}>NBA 2025-26 STARTS IN MARCH</div>
                  <div style={{ color: C.subtle, fontSize: 10, marginTop: 4 }}>PLAYERS WILL APPEAR AUTOMATICALLY ON GAME DAYS</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── LEADERBOARD ───────────────────────────────────────────────────
function LeaderboardScreen({ entries, userId, userFrat }) {
  const [fratFilter, setFratFilter] = useState("myfrat");
  const filteredEntries = fratFilter === "myfrat" && userFrat && userFrat !== "independent"
    ? entries.filter(e => e.frat === userFrat)
    : entries;
  const valid = filteredEntries.filter(e => e.total !== null && e.total <= 30).sort((a, b) => scoreDelta(a.total) - scoreDelta(b.total));
  const noPicks = filteredEntries.filter(e => e.total === null);
  const busts = filteredEntries.filter(e => e.total !== null && e.total > 30).sort((a, b) => b.total - a.total);
  const leader = valid[0] || null;
  const medals = ["🥇","🥈","🥉"];

  function EntryRow({ entry, rank, showRank = true }) {
    const isMe = entry.userId === userId;
    const isBust = entry.total !== null && entry.total > 30;
    const isPerfect = entry.total === 30;
    const delta = scoreDelta(entry.total);
    return (
      <div style={{ background: isMe ? C.accentDim : C.card, border: `1px solid ${isMe ? C.accent : C.border}`, borderRadius: 10, padding: "13px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 34, textAlign: "center", flexShrink: 0 }}>
          {showRank && (medals[rank] && !isBust ? <span style={{ fontSize: 19 }}>{medals[rank]}</span> : <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 17, color: C.muted }}>#{rank + 1}</span>)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 14, color: isMe ? C.accent : C.text }}>
            {entry.userName}{isMe && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, marginLeft: 7 }}>(YOU)</span>}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, marginTop: 3 }}>
            {entry.allPicks && entry.allPicks.length > 0 ? entry.allPicks.map((p,i) => <span key={i} style={{marginRight:5}}>{p.name} <span style={{color:p.points!==null?C.gold:C.muted}}>({p.points??'?'})</span>{i<entry.allPicks.length-1?" +":""}</span>) : entry.p1Name ? <span>{entry.picksDisplay}</span> : <span style={{fontStyle:"italic"}}>{entry.lockedIn?"🔒 LOCKED IN":"No picks yet"}</span>}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 28, lineHeight: 1, color: isBust ? C.red : isPerfect ? C.gold : entry.total !== null ? C.green : C.muted }}>
            {entry.total ?? "—"}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, marginTop: 2, letterSpacing: 1 }}>
            {isPerfect ? <span style={{ color: C.gold }}>🎯 PERFECT</span> : delta !== null ? <span style={{ color: C.green }}>{delta} FROM 30</span> : <span style={{ color: entry.lockedIn ? C.green : C.red }}>{entry.lockedIn ? '🔒 LOCKED IN' : 'NO PICKS'}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px" }}>
      <div className="fu" style={{ marginBottom: 24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 38, letterSpacing: 1 }}>LEADER<span style={{ color: C.accent }}>BOARD</span></h1>
          <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 3 }}>{filteredEntries.length} PLAYERS</p>
        </div>
        {userFrat && userFrat !== "independent" && (
          <div style={{ display:"flex", gap:4, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:4 }}>
            {[["myfrat","MY FRAT"],["all","ALL PLAYERS"]].map(([v,l]) => (
              <button key={v} onClick={() => setFratFilter(v)} style={{ padding:"6px 14px", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"'JetBrains Mono'", fontSize:10, letterSpacing:1, background:fratFilter===v?C.accentDim:"transparent", color:fratFilter===v?C.accent:C.muted }}>
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leader highlight */}
      {leader && (
        <div className="fu" style={{ background: `linear-gradient(135deg, ${C.goldDim}, ${C.accentDim})`, border: `1px solid ${C.gold}44`, borderRadius: 14, padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 36 }}>🏆</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.gold, letterSpacing: 2, marginBottom: 4 }}>CURRENTLY LEADING</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 28, color: C.text }}>{leader.userName}</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, marginTop: 2 }}>
              {leader.allPicks && leader.allPicks.length > 0 ? leader.allPicks.map((p,i) => <span key={i} style={{marginRight:5}}>{p.name} <span style={{color:p.points!==null?C.gold:C.muted}}>({p.points??'?'})</span>{i<leader.allPicks.length-1?" +":""}</span>) : leader.p1Name ? leader.p1Name + " + " + leader.p2Name : ""}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 52, lineHeight: 1, color: C.gold }}>{leader.total}</div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.gold, letterSpacing: 1 }}>{scoreDelta(leader.total)} FROM 30</div>
          </div>
        </div>
      )}

      {/* Valid entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {valid.map((entry, i) => <EntryRow key={entry.userId} entry={entry} rank={i} />)}
        {noPicks.map((entry, i) => <EntryRow key={entry.userId} entry={entry} rank={valid.length + i} />)}
      </div>

      {/* Bust Zone */}
      {busts.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 1, background: C.red + "44" }} />
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.red, letterSpacing: 2 }}>💥 BUST ZONE</span>
            <div style={{ flex: 1, height: 1, background: C.red + "44" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {busts.map((entry, i) => (
              <div key={entry.userId} style={{ background: `${C.red}0d`, border: `1px solid ${C.red}33`, borderRadius: 10, padding: "13px 18px", display: "flex", alignItems: "center", gap: 14, opacity: 0.8 }}>
                <div style={{ width: 34, textAlign: "center" }}><span style={{ fontSize: 16 }}>💥</span></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 14, color: C.red }}>{entry.userName}{entry.userId === userId && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, marginLeft: 7 }}>(YOU)</span>}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, marginTop: 3, display:"flex", flexWrap:"wrap", gap:4 }}>{entry.allPicks && entry.allPicks.length > 0 ? entry.allPicks.map((p,i) => <span key={i}>{p.name} <span style={{color:C.red}}>({p.points??'?'})</span>{i<entry.allPicks.length-1?" +":""}</span>) : entry.p1Name ? entry.p1Name + " + " + entry.p2Name : ""}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 28, color: C.red }}>{entry.total}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.red, letterSpacing: 1 }}>+{entry.total - 30} OVER</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && <div style={{ textAlign: "center", padding: 80, color: C.muted, fontFamily: "'JetBrains Mono'", fontSize: 11 }}>NO PLAYERS YET — BE THE FIRST!</div>}
    </div>
  );
}

// ── RESULTS ───────────────────────────────────────────────────────
function ResultsScreen({ userId, userFrat }) {
  const [fratFilter, setFratFilter] = useState("myfrat");
  const [dates, setDates] = useState([]);
  const [selDate, setSelDate] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const rows = await sbFetch("picks?select=date&order=date.desc");
        const unique = [...new Set((rows||[]).map(r=>r.date))];
        setDates(unique);
        if (unique.length > 0) setSelDate(unique[0]);
        else setLoading(false);
      } catch { setLoading(false); }
    }
    init();
  }, []);

  useEffect(() => {
    if (!selDate) return;
    async function load() {
      setLoading(true);
      try {
        const picks = await sbFetch(`picks?date=eq.${selDate}&select=*`);
        const users = await sbFetch("users?select=*&order=joined.asc") || [];
        const map = {};
        for (const p of picks||[]) {
          let allPicks = [];
          if (p.picks_json) { try { allPicks = JSON.parse(p.picks_json); } catch {} }
          else if (p.p1_name) { allPicks = [{ id: p.p1_id, name: p.p1_name, points: p.p1_pts??null }, p.p2_id?{ id: p.p2_id, name: p.p2_name, points: p.p2_pts??null }:null].filter(Boolean); }
          const total = allPicks.length > 0 && allPicks.some(x=>x.points!==null) ? allPicks.reduce((s,x)=>s+(x.points??0),0) : (p.p1_pts!==null||p.p2_pts!==null)?(p.p1_pts??0)+(p.p2_pts??0):null;
          map[p.user_id] = { userId: p.user_id, userName: p.user_name, p1Name: p.p1_name, p2Name: p.p2_name, p1pts: p.p1_pts, p2pts: p.p2_pts, total, allPicks };
        }
        const result = users.map(u => ({ ...(map[u.id] || { userId: u.id, userName: u.name, p1Name: null, p2Name: null, p1pts: null, p2pts: null, total: null, allPicks: [] }), frat: u.frat || null }));
        setEntries(result);
      } catch {}
      setLoading(false);
    }
    load();
  }, [selDate]);

  const filteredForResults = fratFilter === "myfrat" && userFrat && userFrat !== "independent"
    ? entries.filter(e => e.frat === userFrat)
    : entries;
  const ranked = rankEntries(filteredForResults.filter(e=>e.total!==null));
  const noPicks = filteredForResults.filter(e=>e.total===null);
  const winner = ranked.find(e=>e.total!==null&&e.total<=30);
  const isToday = selDate === todayStr();

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px" }}>
      <div className="fu" style={{ marginBottom: 24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 38, letterSpacing: 1 }}>FINAL <span style={{ color: C.gold }}>RESULTS</span></h1>
          {userFrat && userFrat !== "independent" && (
            <div style={{ display:"flex", gap:4, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:4, marginTop:8 }}>
              {[["myfrat","MY FRAT"],["all","ALL PLAYERS"]].map(([v,l]) => (
                <button key={v} onClick={() => setFratFilter(v)} style={{ padding:"6px 14px", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"'JetBrains Mono'", fontSize:10, letterSpacing:1, background:fratFilter===v?C.accentDim:"transparent", color:fratFilter===v?C.accent:C.muted }}>{l}</button>
              ))}
            </div>
          )}
        </div>
        {dates.length > 0 && (
          <select value={selDate||""} onChange={e=>setSelDate(e.target.value)}
            style={{ padding:"7px 14px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontFamily:"'JetBrains Mono'", fontSize:11, cursor:"pointer" }}>
            {dates.map(d=><option key={d} value={d}>{d===todayStr()?'TODAY ('+d+')':d}</option>)}
          </select>
        )}
      </div>
      {loading ? <div style={{display:"flex",justifyContent:"center",padding:80}}><Spinner size={32}/></div> : (
        <>
          {winner ? (
            <div className="fu" style={{ background:C.goldDim, border:`1px solid ${C.gold}44`, borderRadius:14, padding:30, textAlign:"center", marginBottom:24 }}>
              <div style={{fontSize:52,marginBottom:6}}>🏆</div>
              <div style={{fontFamily:"'Barlow Condensed'",fontWeight:900,fontSize:48,color:C.gold,letterSpacing:3}}>{winner.userName}</div>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:11,color:C.muted,marginTop:8}}>{winner.allPicks&&winner.allPicks.length>0?winner.allPicks.map((p,i)=><span key={i}>{p.name} ({p.points??'?'}){i<winner.allPicks.length-1?" + ":""}</span>):(winner.p1Name+" + "+winner.p2Name)} = <span style={{color:C.gold}}>{winner.total} Points</span></div>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:11,color:C.gold,marginTop:5,letterSpacing:1}}>{winner.total===30?"🎯 PERFECT DIRTY THIRTY!":`JUST ${30-winner.total} POINTS FROM DIRTY THIRTY`}</div>
            </div>
          ) : (
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:40,textAlign:"center",marginBottom:24}}>
              <div style={{fontFamily:"'JetBrains Mono'",fontSize:11,color:C.muted}}>{isToday?"GAMES NOT FINISHED YET — RESULTS COMING SOON":"NO RESULTS FOR THIS DATE"}</div>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[...ranked,...noPicks].map((entry,idx)=>{
              const isBust=entry.total!==null&&entry.total>30, isPerfect=entry.total===30, isMe=entry.userId===userId;
              return (
                <div key={entry.userId} style={{background:isMe?C.accentDim:C.card,border:`1px solid ${isMe?C.accent:C.border}`,borderRadius:10,padding:"13px 18px",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:34,textAlign:"center"}}>{idx===0&&!isBust&&entry.total!==null?<span style={{fontSize:19}}>🥇</span>:<span style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:17,color:C.muted}}>#{idx+1}</span>}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Inter'",fontWeight:600,fontSize:14,color:isMe?C.accent:C.text}}>{entry.userName}{isMe&&<span style={{fontFamily:"'JetBrains Mono'",fontSize:9,color:C.muted,marginLeft:7}}>(YOU)</span>}</div>
                    <div style={{fontFamily:"'JetBrains Mono'",fontSize:9,color:C.muted,marginTop:3,display:"flex",flexWrap:"wrap",gap:4}}>{entry.allPicks&&entry.allPicks.length>0?entry.allPicks.map((p,i)=><span key={i}>{p.name} <span style={{color:p.points!==null?C.gold:C.muted}}>({p.points??'?'})</span>{i<entry.allPicks.length-1?" +":""}</span>):entry.p1Name?entry.p1Name+" + "+entry.p2Name:"No picks"}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'Barlow Condensed'",fontWeight:800,fontSize:28,color:isBust?C.red:isPerfect?C.gold:entry.total!==null?C.green:C.muted}}>{entry.total??'—'}</div>
                    <div style={{fontFamily:"'JetBrains Mono'",fontSize:9,color:isBust?C.red:C.muted}}>{isBust?"💥 BUST":isPerfect?"🎯 PERFECT":entry.total!==null?`${30-entry.total} FROM 30`:"NO PICKS"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────
function FratVsFratScreen({ entries, userFrat }) {
  const fratMap = {};
  for (const e of entries) {
    if (!e.frat || e.frat === "independent") continue;
    if (!fratMap[e.frat]) fratMap[e.frat] = { fratId: e.frat, members: [], totalScore: 0, validCount: 0 };
    fratMap[e.frat].members.push(e);
    const score = e.total !== null && e.total <= 30 ? e.total : 0;
    fratMap[e.frat].totalScore += score;
    if (e.total !== null) fratMap[e.frat].validCount++;
  }
  const frats = Object.values(fratMap).sort((a, b) => b.totalScore - a.totalScore);
  const maxScore = Math.max(...frats.map(f => f.totalScore), 1);
  if (frats.length === 0) return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px", textAlign: "center" }}>
      <div style={{ padding: 80, color: C.muted, fontFamily: "'JetBrains Mono'", fontSize: 11 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
        NO FRAT DATA YET
      </div>
    </div>
  );
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px" }}>
      <div className="fu" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 38, letterSpacing: 1 }}>FRAT <span style={{ color: C.accent }}>VS</span> FRAT</h1>
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.muted, letterSpacing: 2, marginTop: 3 }}>COMBINED DIRTY THIRTY SCORES</p>
      </div>
      {frats.length >= 2 && (
        <div className="fu" style={{ marginBottom: 28, background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>LEADING</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 32, color: C.gold }}>{frats[0].fratId.toUpperCase()}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 72, color: C.gold, lineHeight: 1 }}>{frats[0].totalScore}</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, marginTop: 4 }}>{frats[0].members.length} MEMBERS</div>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 48, color: C.border }}>VS</div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>CHASING</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 32, color: C.text }}>{frats[1].fratId.toUpperCase()}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 72, color: C.text, lineHeight: 1 }}>{frats[1].totalScore}</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, marginTop: 4 }}>{frats[1].members.length} MEMBERS</div>
            </div>
          </div>
          <div style={{ marginTop: 20, height: 6, background: C.border, borderRadius: 3, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (frats[0].totalScore / (frats[0].totalScore + frats[1].totalScore) * 100) + "%", background: "linear-gradient(90deg," + C.gold + "," + C.accent + ")", borderRadius: 3 }} />
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {frats.map((frat, idx) => {
          const isMyFrat = frat.fratId === userFrat;
          const avg = frat.validCount ? (frat.totalScore / frat.validCount).toFixed(1) : "—";
          return (
            <div key={frat.fratId} className="fu" style={{ background: isMyFrat ? C.accentDim : C.card, border: "1px solid " + (isMyFrat ? C.accent : C.border), borderRadius: 12, padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 22, color: idx === 0 ? C.gold : C.muted, width: 30 }}>#{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 28, color: isMyFrat ? C.accent : C.text }}>{frat.fratId.toUpperCase()}</span>
                    {isMyFrat && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.accent, border: "1px solid " + C.accent + "44", borderRadius: 4, padding: "2px 7px" }}>YOUR FRAT</span>}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted, marginTop: 2 }}>{frat.members.length} MEMBERS · AVG {avg} PTS</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 42, color: idx === 0 ? C.gold : C.text, lineHeight: 1 }}>{frat.totalScore}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.muted }}>TOTAL PTS</div>
                </div>
              </div>
              <div style={{ height: 4, background: C.border, borderRadius: 2, marginBottom: 12 }}>
                <div style={{ height: "100%", width: (frat.totalScore / maxScore * 100) + "%", background: idx === 0 ? "linear-gradient(90deg," + C.gold + "," + C.accent + ")" : isMyFrat ? C.accent : C.muted, borderRadius: 2 }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {frat.members.map(m => (
                  <div key={m.userId} style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: m.total !== null ? (m.total > 30 ? C.red : C.green) : C.muted, background: C.surface, border: "1px solid " + C.border, borderRadius: 6, padding: "3px 8px" }}>
                    {m.userName} {m.total !== null ? "(" + (m.total > 30 ? "💥" : "") + m.total + ")" : "(—)"}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("pick");
  const [players, setPlayers] = useState([]);
  const [picks, setPicks] = useState([]);
  const [lockedIn, setLockedIn] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [liveCount, setLiveCount] = useState(0);
  const [nextGameDate, setNextGameDate] = useState(null);
  const gameIdsRef = useRef([]);
  const playersRef = useRef([]);

  useEffect(() => {
    const saved = localStorage.getItem("d30_user");
    if (saved) { try { setUser(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    if (!user) return;
    loadTodayPlayers();
    const ivGames = setInterval(loadTodayPlayers, 5 * 60 * 1000); // check every 5 min for game state changes
    loadLeaderboard();
  }, [user]);

  // Reload leaderboard every 60s independently of game data
  useEffect(() => {
    if (!user) return;
    const iv = setInterval(loadLeaderboard, REFRESH_INTERVAL);
    return () => { clearInterval(iv); clearInterval(ivGames); };
  }, [user]);

  useEffect(() => {
    if (!user || players.length === 0) return;
    const iv = setInterval(refreshLiveScores, REFRESH_INTERVAL);
    return () => clearInterval(iv);
  }, [user, players]);

  useEffect(() => {
    if (!user) return;
    loadLeaderboard();
  }, [picks]);

  useEffect(() => {
    if (!user) return;
    if (!lockedIn) return;
  }, [lockedIn, savePicks]);

  async function loadTodayPlayers() {
    setNextGameDate(null);
    setLoadingPlayers(true); setApiError(null);
    try {
      // Try today first
      let res = await apiFetch("/games");
      
      // If no games today, try next 30 days to find upcoming March Madness games
      if (res.success && res.players.length === 0) {
        for (let i = 1; i <= 30; i++) {
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + i);
          const dateStr = nextDate.toISOString().slice(0, 10).replace(/-/g, "");
          const nextRes = await apiFetch(`/games?date=${dateStr}`);
          if (nextRes.success && nextRes.players.length > 0) {
            // Found upcoming games — show players but mark them all as not locked
            const dateLabel = nextDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
            setNextGameDate(dateLabel.toUpperCase());
            res = nextRes;
            break;
          }
        }
      }

      if (!res.success) throw new Error(res.error || "Unknown");
      gameIdsRef.current = res.games.map(g => g.id);
      setLiveCount(res.games.filter(g => g.status === "STATUS_IN_PROGRESS").length);
      setPlayers(res.players);
      playersRef.current = res.players;

      const allFinal = res.games.length > 0 && res.games.every(g => g.status === "STATUS_FINAL");
      const saved = await db.getPick(user.id, todayStr());
      if (saved && saved.picks_json && !allFinal) {
        let restoredPicks = [];
        if (saved.picks_json) {
          try {
            const parsed = JSON.parse(saved.picks_json);
            restoredPicks = parsed.map(p => { const live = res.players.find(pl => pl.id === p.id); return live ? { ...live, points: live.points ?? p.points } : { id: p.id, name: p.name, team: p.team, points: p.points ?? null, avgPoints: null, position: '', gameName: '', isLive: false, isOver: true, isLocked: true }; });
          } catch {}
        }
        if (restoredPicks.length === 0 && saved.p1_id) {
          const p1 = res.players.find(p => p.id === saved.p1_id) || { id: saved.p1_id, name: saved.p1_name, team: '', points: saved.p1_pts, avgPoints: null, position: '', gameName: '', isLive: false, isOver: false, isLocked: false };
          const p2 = saved.p2_id ? (res.players.find(p => p.id === saved.p2_id) || { id: saved.p2_id, name: saved.p2_name, team: '', points: saved.p2_pts, avgPoints: null, position: '', gameName: '', isLive: false, isOver: false, isLocked: false }) : null;
          restoredPicks = [p1, p2].filter(Boolean);
        }
        isRestoringRef.current = true;
        setPicks(restoredPicks);
        if (saved.locked_in) setLockedIn(true);
        setTimeout(() => { isRestoringRef.current = false; }, 100);
      } else if (allFinal) {
        setPicks([]);
        setLockedIn(false);
      } else {
        setPicks([]);
        setLockedIn(false);
      }
      if (res.games.some(g => g.status === "STATUS_IN_PROGRESS" || g.status === "STATUS_FINAL")) await doLiveUpdate(res.players, gameIdsRef.current);
    } catch (e) { if (!players.length) setApiError(e.message); }
    finally { setLoadingPlayers(false); }
  }

  async function refreshLiveScores() {
    if (gameIdsRef.current.length === 0) return;
    await doLiveUpdate(playersRef.current, gameIdsRef.current);
  }

  async function doLiveUpdate(currentPlayers, gameIds) {
    try {
      const res = await apiFetch(`/live-scores?games=${gameIds.filter(Boolean).join(",")}`);
      if (!res.success) return;
      // Build lookup map: playerId -> {points, status, gameId}
      const playerMap = {};
      for (const p of res.players || []) {
        playerMap[p.id] = p;
      }
      let live = 0;
      const updatedPlayers = currentPlayers.map(p => {
        const update = playerMap[p.id]; if (!update) return p;
        if (update.status === "STATUS_IN_PROGRESS") live++;
        return { ...p, isLive: update.status === "STATUS_IN_PROGRESS", isOver: update.status === "STATUS_FINAL", isLocked: update.status !== "STATUS_SCHEDULED", points: update.points !== null ? update.points : p.points };
      });
      setPlayers(updatedPlayers);
      playersRef.current = updatedPlayers;
      setLiveCount(live);
      loadLeaderboard(updatedPlayers);
      setPicks(prev => prev.map(pick => {
        if (!pick) return null;
        const update = playerMap[pick.id]; if (!update) return pick;
        return update.points !== null ? { ...pick, points: update.points } : pick;
      }));
    } catch (e) { console.warn("Live update failed:", e.message); }
  }

  async function savePicks(overrideLocked) {
    if (!user) return;
    if (picks.length === 0) return;
    const isLocked = overrideLocked !== undefined ? overrideLocked : lockedIn;
    await db.savePick({ id: `${user.id}:${todayStr()}`, user_id: user.id, user_name: user.name, date: todayStr(), p1_id: picks[0]?.id || null, p1_name: picks[0]?.name || null, p1_pts: picks[0]?.points ?? null, p2_id: picks[1]?.id || null, p2_name: picks[1]?.name || null, p2_pts: picks[1]?.points ?? null, picks_json: JSON.stringify(picks.map(p => ({ id: p.id, name: p.name, team: p.team, points: p.points ?? null }))), locked_in: isLocked, updated_at: Date.now() });
  }

  const isFetchingLeaderboard = useRef(false);
  async function loadLeaderboard(currentPlayers) {
    if (isFetchingLeaderboard.current) return;
    isFetchingLeaderboard.current = true;
    try {
    const livePlayers = currentPlayers || playersRef.current || [];
    const dateKey = todayStr();
    const entries = [];

    // Load today's picks from Supabase
    const todayPicks = await db.getAllPicksForDate(dateKey);
    const pickMap = {};
    for (const pick of todayPicks) {
      const p1 = livePlayers.find(p => p.id === pick.p1_id), p2 = livePlayers.find(p => p.id === pick.p2_id);
      let total = null;
      let picksDisplay = pick.p1_name ? `${pick.p1_name} + ${pick.p2_name || '—'}` : null;
      if (pick.picks_json) {
        try {
          const allPicks = JSON.parse(pick.picks_json);
          const pts = allPicks.map(p => {
            const live = livePlayers.find(pl => pl.id === p.id);
            return live?.points ?? p.points ?? null;
          });
          if (pts.some(p => p !== null)) total = pts.reduce((a, b) => a + (b ?? 0), 0);
          picksDisplay = allPicks.map(p => p.name).join(' + ');
        } catch {}
      } else {
        const p1 = livePlayers.find(p => p.id === pick.p1_id), p2 = livePlayers.find(p => p.id === pick.p2_id);
        const p1pts = p1?.points ?? pick.p1_pts ?? null, p2pts = p2?.points ?? pick.p2_pts ?? null;
        if (p1pts !== null && p2pts !== null) total = p1pts + p2pts;
        picksDisplay = pick.p1_name ? `${pick.p1_name} + ${pick.p2_name || '—'}` : null;
      }
      let allPicks = [];
      if (pick.picks_json) {
        try {
          const parsed = JSON.parse(pick.picks_json);
          allPicks = parsed.map(p => { const live = livePlayers.find(pl => pl.id === p.id); return { id: p.id, name: p.name, points: live?.points ?? p.points ?? null }; });
        } catch {}
      } else if (pick.p1_name) {
        allPicks = [{ id: pick.p1_id, name: pick.p1_name, points: pick.p1_pts ?? null }, pick.p2_id ? { id: pick.p2_id, name: pick.p2_name, points: pick.p2_pts ?? null } : null].filter(Boolean);
      }
      pickMap[pick.user_id] = {
        userId: pick.user_id, userName: pick.user_name, frat: null,
        p1Name: pick.p1_name, p2Name: pick.p2_name,
        picksDisplay, allPicks,
        lockedIn: pick.locked_in || false,
        total,
      };
    }

    // Always load ALL registered users — leaderboard is never empty
    const allUsers = await db.getAllUsers();
    for (const u of allUsers) {
      if (pickMap[u.id]) {
        entries.push({ ...pickMap[u.id], frat: u.frat || null });
      } else {
        entries.push({ userId: u.id, userName: u.name, frat: u.frat || null, p1Name: null, p2Name: null, p1pts: null, p2pts: null, total: null });
      }
    }

    // Add pick entries not yet in users table
    for (const entry of Object.values(pickMap)) {
      if (!entries.find(e => e.userId === entry.userId)) entries.push(entry);
    }

    setLeaderboard(entries);
    } finally { isFetchingLeaderboard.current = false; }
  }

  if (!user) return <><Styles /><LoginScreen onLogin={u => setUser(u)} /></>;

  return (
    <>
      <Styles />
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
        <Header tab={tab} setTab={setTab} user={user} liveCount={liveCount} />
        <div style={{ flex: 1 }}>
          {tab === "pick" && <PickScreen user={user} players={players} picks={picks} setPicks={setPicks} loading={loadingPlayers} error={apiError} nextGameDate={nextGameDate} lockedIn={lockedIn} setLockedIn={setLockedIn} savePicks={savePicks} />}
          {tab === "leaderboard" && <LeaderboardScreen entries={leaderboard} userId={user.id} userFrat={user.frat} />}
          {tab === "fratvsfrat" && <FratVsFratScreen entries={leaderboard} userFrat={user.frat} />}
          {tab === "results" && <ResultsScreen userId={user.id} userFrat={user.frat} />}
        </div>
        <Footer />
      </div>
    </>
  );
}
