import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, Bell, Check, ChevronDown, ChevronRight, CloudRain,
  Droplets, Eye, Gauge, Leaf, MapPin, Menu, Moon, ScanLine, Search, Settings,
  ShieldCheck, Sprout, Sun, Thermometer, X, Zap, UserRound, LogOut, SlidersHorizontal,
  CircleHelp, Wifi, Camera, ArrowUpRight
} from "lucide-react";
import {
  AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import "./styles.css";

const plantPhotos = {
  hero: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1400&q=85",
  leaf: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=85",
  field: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85"
};

const zones = [
  { id: "Z01", name: "North Field", status: "healthy", score: 96, moisture: 68, temp: 27, risk: "Low", crop: "Tomato" },
  { id: "Z02", name: "East Field", status: "attention", score: 78, moisture: 41, temp: 29, risk: "Moderate", crop: "Tomato" },
  { id: "Z03", name: "South Field", status: "healthy", score: 93, moisture: 64, temp: 28, risk: "Low", crop: "Tomato" },
  { id: "Z04", name: "West Field", status: "dry", score: 71, moisture: 29, temp: 31, risk: "High", crop: "Tomato" },
  { id: "Z05", name: "Central Field", status: "risk", score: 62, moisture: 35, temp: 32, risk: "High", crop: "Tomato" },
  { id: "Z06", name: "South-East Field", status: "healthy", score: 91, moisture: 61, temp: 28, risk: "Low", crop: "Tomato" }
];

const healthData = [
  { day: "Mon", health: 88 }, { day: "Tue", health: 90 }, { day: "Wed", health: 89 },
  { day: "Thu", health: 92 }, { day: "Fri", health: 91 }, { day: "Sat", health: 94 }, { day: "Sun", health: 92 }
];

const moistureData = [
  { time: "06:00", value: 58 }, { time: "09:00", value: 55 }, { time: "12:00", value: 49 },
  { time: "15:00", value: 43 }, { time: "18:00", value: 46 }, { time: "21:00", value: 52 }
];

const navItems = [
  ["Overview", Gauge], ["Zones", MapPin], ["AI Insights", Zap],
  ["Irrigation", Droplets], ["Crop Vision", ScanLine], ["Alerts", Bell]
];

function App() {
  const [page, setPage] = useState("Overview");
  const [selectedZone, setSelectedZone] = useState(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const pageTitle = useMemo(() => ({
    Overview: ["Farm overview", "A calm view of what needs your attention."],
    Zones: ["Farm zones", "See crop health at a glance, zone by zone."],
    "AI Insights": ["AI insights", "Understand why CropNova is raising a signal."],
    Irrigation: ["Irrigation", "Moisture-aware decisions without guesswork."],
    "Crop Vision": ["Crop vision", "Recent crop scans and visual health signals."],
    Alerts: ["Alerts", "Only the issues that need your attention."]
  }[page] || ["CropNova", "Smart farming intelligence."])[0], [page]);

  const navigate = (p) => { setPage(p); setMobileNav(false); setProfileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className={mobileNav ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark"><Sprout size={19} /></div>
          <div><strong>CropNova</strong><span>FIELD INTELLIGENCE</span></div>
        </div>

        <button className="farm-switch" onClick={() => navigate("Overview")}>
          <div className="farm-avatar">RF</div>
          <div><b>Raman Farm</b><small>Tomato · 12.4 acres</small></div>
          <ChevronDown size={15} />
        </button>

        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navItems.map(([label, Icon]) => (
            <button key={label} className={page === label ? "nav-item active" : "nav-item"} onClick={() => navigate(label)}>
              <Icon size={18} /><span>{label}</span>{label === "Alerts" && <em>2</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="nav-label">PREFERENCES</div>
          <button className="nav-item" onClick={() => setDark(!dark)}><Moon size={18} /><span>{dark ? "Light appearance" : "Dark appearance"}</span></button>
          <button className="nav-item" onClick={() => setSettingsOpen(true)}><Settings size={18} /><span>Settings</span><ChevronRight size={14} className="nav-chevron" /></button>
          <div className="system"><span className="pulse"></span><div><b>System online</b><small>Last sync · 2 min ago</small></div></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Raman Farm</span><ChevronRight size={14} /><b>{pageTitle}</b></div>
          <div className="top-actions">
            <div className="sync"><span className="pulse"></span> Live data</div>
            <button className="icon-btn" onClick={() => setAlertsOpen(!alertsOpen)} aria-label="Open alerts"><Bell size={19} /><i>2</i></button>
            <button className="profile" onClick={() => setProfileOpen(!profileOpen)}>
              <div className="profile-avatar">SK</div>
              <div><b>Steve Kumar</b><small>Farm manager</small></div>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>

        {alertsOpen && <NotificationPanel close={() => setAlertsOpen(false)} select={setSelectedZone} />}
        {profileOpen && <ProfileMenu close={() => setProfileOpen(false)} openSettings={() => { setProfileOpen(false); setSettingsOpen(true); }} />}

        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">SUNDAY · 27 SEPTEMBER 2026</div>
              <h1>{page === "Overview" ? "Good morning, Steve." : pageTitle}</h1>
              <p>{page === "Overview" ? "Your farm is stable. Here’s what deserves your attention today." : ({
                Zones: "Six monitored zones across your field.",
                "AI Insights": "Signals are combined to make every recommendation explainable.",
                Irrigation: "Prioritize water where the crop needs it most.",
                "Crop Vision": "AI-assisted visual signals from the latest field scan.",
                Alerts: "Two signals are currently asking for a closer look."
              }[page])}</p>
            </div>
            <div className="heading-actions"><button className="outline-btn"><Search size={16} /> Search</button><button className="primary-btn"><Activity size={16} /> Sync now</button></div>
          </div>

          {page === "Overview" && <Overview navigate={navigate} select={setSelectedZone} />}
          {page === "Zones" && <Zones select={setSelectedZone} />}
          {page === "AI Insights" && <AIInsights select={setSelectedZone} />}
          {page === "Irrigation" && <Irrigation select={setSelectedZone} />}
          {page === "Crop Vision" && <CropVision />}
          {page === "Alerts" && <Alerts select={setSelectedZone} />}
        </div>
      </main>

      {selectedZone && <ZoneDrawer zone={selectedZone} close={() => setSelectedZone(null)} />}
      {settingsOpen && <SettingsModal dark={dark} setDark={setDark} notifications={notifications} setNotifications={setNotifications} autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh} close={() => setSettingsOpen(false)} />}
    </div>
  );
}

function NotificationPanel({ close, select }) {
  return <div className="notification-panel">
    <div className="panel-head"><div><span className="eyebrow">LIVE MONITORING</span><b>Attention needed</b></div><button onClick={close}><X size={17} /></button></div>
    <button className="mini-alert" onClick={() => { select(zones[1]); close(); }}><div className="alert-dot orange"></div><div><b>Zone 02 · Possible leaf stress</b><small>Moderate risk · 78% confidence</small></div><ChevronRight size={16} /></button>
    <button className="mini-alert" onClick={() => { select(zones[3]); close(); }}><div className="alert-dot red"></div><div><b>Zone 04 · Low soil moisture</b><small>High irrigation priority</small></div><ChevronRight size={16} /></button>
  </div>;
}

function ProfileMenu({ close, openSettings }) {
  return <div className="profile-menu">
    <div className="profile-menu-head"><div className="profile-avatar large">SK</div><div><b>Steve Kumar</b><small>Farm manager</small></div></div>
    <div className="profile-stats"><div><b>12.4</b><span>acres</span></div><div><b>6</b><span>zones</span></div><div><b>92</b><span>health</span></div></div>
    <button onClick={openSettings}><Settings size={16} /> Profile & settings</button>
    <button onClick={close}><CircleHelp size={16} /> Help center</button>
    <button className="danger-link" onClick={close}><LogOut size={16} /> Sign out</button>
  </div>;
}

function SettingsModal({ dark, setDark, notifications, setNotifications, autoRefresh, setAutoRefresh, close }) {
  return <div className="modal-backdrop" onClick={close}>
    <div className="settings-modal" onClick={e => e.stopPropagation()}>
      <div className="modal-head"><div><span className="eyebrow">CROPNOVA CONTROL</span><h2>Settings</h2><p>Personalize your dashboard without changing field data.</p></div><button className="icon-btn" onClick={close}><X size={19} /></button></div>
      <div className="settings-list">
        <SettingRow icon={Moon} title="Appearance" description="Switch between light and dark dashboard themes."><button className="segmented"><span className={!dark ? "selected" : ""} onClick={() => setDark(false)}><Sun size={14}/> Light</span><span className={dark ? "selected" : ""} onClick={() => setDark(true)}><Moon size={14}/> Dark</span></button></SettingRow>
        <SettingRow icon={Bell} title="Smart alerts" description="Show important crop and irrigation warnings."><Toggle value={notifications} onChange={setNotifications} /></SettingRow>
        <SettingRow icon={Wifi} title="Auto refresh" description="Keep sensor summaries updated automatically."><Toggle value={autoRefresh} onChange={setAutoRefresh} /></SettingRow>
        <SettingRow icon={SlidersHorizontal} title="Dashboard density" description="Keep the interface spacious and easy to scan."><span className="setting-value">Comfortable</span></SettingRow>
      </div>
      <div className="modal-footer"><span><Check size={15}/> Changes apply instantly</span><button className="primary-btn" onClick={close}>Done</button></div>
    </div>
  </div>;
}

function SettingRow({ icon: Icon, title, description, children }) {
  return <div className="setting-row"><div className="setting-icon"><Icon size={17}/></div><div className="setting-copy"><b>{title}</b><small>{description}</small></div><div className="setting-control">{children}</div></div>;
}

function Toggle({ value, onChange }) {
  return <button className={value ? "toggle on" : "toggle"} onClick={() => onChange(!value)}><span></span></button>;
}

function Metric({ icon: Icon, label, value, note }) {
  return <div className="metric"><div className="metric-icon"><Icon size={16}/></div><div><span>{label}</span><b>{value}</b><small>{note}</small></div></div>;
}

function Overview({ navigate, select }) {
  return <>
    <section className="hero-grid">
      <div className="health-card">
        <div className="card-label"><span>FIELD HEALTH</span><ShieldCheck size={18}/></div>
        <div className="health-main"><div className="score">92<span>/100</span></div><div><div className="status"><span className="status-dot"></span> Stable</div><small>+3.2% from last week</small></div></div>
        <div className="health-bar"><span style={{ width: "92%" }}></span></div>
        <div className="health-foot"><span>6 zones monitored</span><span>Last scan · 09:42 AM</span></div>
      </div>
      <div className="field-photo-card">
        <img src={plantPhotos.hero} alt="Healthy crop leaves in a field" />
        <div className="photo-shade"></div>
        <div className="photo-content"><span className="photo-tag"><Camera size={12}/> LATEST FIELD VIEW</span><b>Healthy crop canopy</b><small>Visual scan synced 4 min ago</small></div>
        <button className="photo-arrow" onClick={() => navigate("Crop Vision")}><ArrowUpRight size={17}/></button>
      </div>
    </section>

    <section className="metrics-card card">
      <div className="card-label"><span>FIELD CONDITIONS</span><span className="live-badge">● LIVE</span></div>
      <div className="metric-grid">
        <Metric icon={Droplets} label="Soil moisture" value="64%" note="Good range" />
        <Metric icon={Thermometer} label="Temperature" value="28°C" note="Normal" />
        <Metric icon={Leaf} label="Crop health" value="94%" note="Healthy" />
        <Metric icon={CloudRain} label="Humidity" value="72%" note="Moderate" />
      </div>
    </section>

    <section className="attention card">
      <div className="section-head"><div><div className="eyebrow orange-text">NEEDS ATTENTION</div><h2>2 things worth checking</h2></div><button className="text-btn" onClick={() => navigate("Alerts")}>View all <ChevronRight size={15} /></button></div>
      <div className="attention-grid">
        <button className="attention-item warning" onClick={() => select(zones[1])}><div className="attention-icon"><Eye size={19} /></div><div className="attention-copy"><span>ZONE 02 · MODERATE RISK</span><h3>Possible leaf stress</h3><p>78% confidence · soil moisture is below preferred range.</p><b>Inspect zone <ChevronRight size={14} /></b></div></button>
        <button className="attention-item danger" onClick={() => select(zones[3])}><div className="attention-icon"><Droplets size={19} /></div><div className="attention-copy"><span>ZONE 04 · HIGH PRIORITY</span><h3>Soil moisture is low</h3><p>29% moisture · irrigation should be reviewed.</p><b>Review irrigation <ChevronRight size={14} /></b></div></button>
      </div>
    </section>

    <section className="two-col">
      <div className="card chart-card"><div className="section-head"><div><div className="eyebrow">FIELD TREND</div><h2>Crop health</h2></div><span className="chart-value">92 <small>today</small></span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height={210}><AreaChart data={healthData}><defs><linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#123c78" stopOpacity=".24"/><stop offset="100%" stopColor="#123c78" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#1c315012"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#72819a" }} /><YAxis hide domain={[80, 100]} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dce4ee", boxShadow: "0 12px 30px #0d23421a" }} /><Area type="monotone" dataKey="health" stroke="#123c78" strokeWidth={3} fill="url(#healthFill)" /></AreaChart></ResponsiveContainer></div></div>
      <div className="card field-status"><div className="section-head"><div><div className="eyebrow">FIELD STATUS</div><h2>Zones at a glance</h2></div><button className="text-btn" onClick={() => navigate("Zones")}>Open map <ChevronRight size={15}/></button></div><div className="status-list">{zones.map(z => <button key={z.id} className="status-row" onClick={() => select(z)}><span className={`zone-dot ${z.status}`}></span><div><b>{z.id}</b><small>{z.name}</small></div><span className={`risk-pill ${z.status}`}>{z.status === "healthy" ? "Healthy" : z.status === "attention" ? "Attention" : z.status === "dry" ? "Irrigation" : "Risk"}</span><ChevronRight size={15}/></button>)}</div></div>
    </section>
  </>;
}

function Zones({ select }) {
  return <div className="zones-page"><div className="field-map card"><div className="section-head"><div><div className="eyebrow">MONITORED FIELD</div><h2>Zone intelligence</h2></div><span className="map-note">Tap a zone for details</span></div><div className="field-visual">{zones.map(z => <button key={z.id} className={`field-zone ${z.status}`} onClick={() => select(z)}><div><span>{z.id}</span><b>{z.score}</b></div><small>{z.name}</small><strong>{z.moisture}% moisture</strong></button>)}</div><div className="map-footer"><span><i className="legend-dot healthy"></i>Healthy</span><span><i className="legend-dot attention"></i>Attention</span><span><i className="legend-dot risk"></i>Risk</span></div></div><div className="zone-cards">{zones.map(z => <button className="zone-card card" key={z.id} onClick={() => select(z)}><div className="zone-card-head"><div><span>{z.id}</span><h3>{z.name}</h3></div><span className={`risk-pill ${z.status}`}>{z.risk}</span></div><div className="zone-photo"><img src={z.id === "Z02" || z.id === "Z05" ? plantPhotos.leaf : plantPhotos.field} alt="Crop zone"/><div><b>Health {z.score}%</b><small>{z.crop} · {z.temp}°C</small></div></div><div className="zone-mini"><span>Moisture <b>{z.moisture}%</b></span><span>Temperature <b>{z.temp}°C</b></span></div></button>)}</div></div>;
}

function AIInsights({ select }) {
  return <div className="ai-page"><div className="insight-banner"><div className="insight-icon"><Zap size={20}/></div><div><span>EXPLAINABLE AI</span><h2>CropNova found 2 signals worth checking.</h2><p>Each signal combines sensor readings and visual evidence before suggesting an action.</p></div><button className="primary-btn" onClick={() => select(zones[1])}>Inspect Zone 02 <ChevronRight size={15}/></button></div><div className="ai-grid"><div className="risk-card card"><div className="risk-head"><div className="risk-icon warning"><AlertTriangle size={17}/></div><div><span>ZONE 02 · POSSIBLE CROP STRESS</span><h2>Moderate risk</h2></div><strong>72%</strong></div><div className="risk-meter"><span style={{ width: "72%" }}></span></div><p>CropNova is not calling a disease diagnosis. It is flagging a pattern that deserves a physical inspection.</p><div className="evidence"><b>Supporting evidence</b><span><Check size={13}/> Leaf image shows possible stress pattern</span><span><Check size={13}/> Soil moisture below preferred range</span><span><Check size={13}/> Temperature elevated to 29°C</span></div><div className="recommendation"><span>RECOMMENDED NEXT STEP</span><b>Inspect plants in Zone 02 and check irrigation.</b></div><button className="outline-btn wide" onClick={() => select(zones[1])}>View zone details <ChevronRight size={15}/></button></div><div className="card signal-list"><div className="section-head"><div><div className="eyebrow">SIGNAL FEED</div><h2>What the system sees</h2></div></div><Signal icon={Leaf} title="Leaf stress pattern" meta="Zone 02 · 78% confidence" state="attention"/><Signal icon={Droplets} title="Low moisture" meta="Zone 04 · 29% detected" state="risk"/><Signal icon={Thermometer} title="Heat remains normal" meta="Field average · 28°C" state="normal"/><Signal icon={CloudRain} title="Rain expected tomorrow" meta="Irrigation may be reduced" state="normal"/></div></div></div>;
}

function Signal({ icon: Icon, title, meta, state }) { return <div className="signal"><div className="signal-icon"><Icon size={16}/></div><div><b>{title}</b><small>{meta}</small></div><span className={`signal-state ${state}`}></span></div>; }

function Irrigation({ select }) { return <div className="irrigation-page"><div className="irrigation-top card"><div><div className="eyebrow">WATER INTELLIGENCE</div><h2>Prioritize irrigation, not guesswork.</h2><p>CropNova uses current soil moisture and field conditions to surface the zones that need water first.</p></div><div className="water-score"><Droplets size={19}/><b>82%</b><span>water efficiency</span></div></div><div className="two-col"><div className="card priority-card"><div className="section-head"><div><div className="eyebrow">TODAY</div><h2>Irrigation priority</h2></div><span className="legend-note">6 zones monitored</span></div>{zones.map(z => <button className="priority" key={z.id} onClick={() => select(z)}><div className={`priority-icon ${z.status}`}><Droplets size={15}/></div><div><b>{z.id} · {z.name}</b><small>{z.moisture}% soil moisture</small></div><span>{z.moisture < 40 ? "High priority" : z.moisture < 50 ? "Review" : "Good"}</span><ChevronRight size={14}/></button>)}</div><div className="card chart-card"><div className="section-head"><div><div className="eyebrow">ZONE 04</div><h2>Moisture trend</h2></div><span className="chart-value">29% <small>now</small></span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height={250}><AreaChart data={moistureData}><defs><linearGradient id="moistureFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c96b24" stopOpacity=".24"/><stop offset="100%" stopColor="#c96b24" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#1c315012"/><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#72819a" }}/><YAxis hide domain={[20, 70]}/><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dce4ee" }}/><Area type="monotone" dataKey="value" stroke="#c96b24" strokeWidth={3} fill="url(#moistureFill)"/></AreaChart></ResponsiveContainer></div><div className="rain-note"><CloudRain size={17}/><div><b>Rain expected tomorrow</b><small>CropNova suggests reviewing Zone 03 before irrigating.</small></div></div></div></div></div>; }

function CropVision() { return <div className="vision-page"><div className="vision-hero card"><div className="scan-photo"><img src={plantPhotos.leaf} alt="Close-up of crop leaves"/><div className="scan-overlay"><ScanLine size={28}/><span>AI VISION SCAN</span><b>Possible leaf stress</b></div><div className="scan-label">ZONE 02 · 09:42 AM</div></div><div className="vision-result"><div className="eyebrow">LATEST CROP SCAN</div><h2>Possible leaf stress</h2><div className="confidence"><div><span>Confidence</span><b>78%</b></div><div className="health-bar"><span style={{ width: "78%" }}></span></div></div><p>CropNova detected a visual pattern that may indicate plant stress. The signal is combined with soil and weather readings before an alert is shown.</p><div className="detected"><span>DETECTED INDICATORS</span><div><b>Leaf discoloration</b><b>Texture anomaly</b><b>Moisture correlation</b></div></div></div></div><div className="card vision-note"><div className="note-icon"><ShieldCheck size={18}/></div><div><div className="eyebrow">DESIGNED FOR RESPONSIBLE AI</div><h2>Possible issue, not a diagnosis.</h2><p>The dashboard deliberately uses confidence, evidence and a recommended action so the farmer can verify the signal in the field.</p></div></div></div>; }

function Alerts({ select }) { return <div className="alerts-page"><div className="alert-summary card"><div><div className="eyebrow orange-text">LIVE ALERTS</div><h2>2 things need attention</h2><p>Prioritized so the important signals are easy to spot.</p></div><div className="alert-count"><b>2</b><span>open</span></div></div><div className="alert-full-list"><button className="full-alert card" onClick={() => select(zones[1])}><div className="full-alert-icon warning"><AlertTriangle size={19}/></div><div className="full-alert-body"><span>ZONE 02 · MODERATE RISK</span><h2>Possible crop stress</h2><p>78% visual confidence. Soil moisture is also below the preferred range.</p><div className="alert-tags"><b>Inspect crop</b><b>Check irrigation</b></div></div><ChevronRight size={17}/></button><button className="full-alert card" onClick={() => select(zones[3])}><div className="full-alert-icon danger"><Droplets size={19}/></div><div className="full-alert-body"><span>ZONE 04 · HIGH PRIORITY</span><h2>Low soil moisture</h2><p>29% moisture detected. Review irrigation before the next dry period.</p><div className="alert-tags"><b>High priority</b><b>29% moisture</b></div></div><ChevronRight size={17}/></button></div></div>; }

function ZoneDrawer({ zone, close }) { return <div className="drawer-backdrop" onClick={close}><aside className="zone-drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span>{zone.id} · {zone.name.toUpperCase()}</span><h2>{zone.crop} zone</h2></div><button className="icon-btn" onClick={close}><X size={18}/></button></div><div className="drawer-health"><div><span>HEALTH SCORE</span><b>{zone.score}<small>/100</small></b></div><span className={`status-badge ${zone.status === "healthy" ? "healthy" : zone.status === "risk" ? "risk" : ""}`}>{zone.status === "healthy" ? "Healthy" : zone.status === "dry" ? "Irrigation priority" : zone.status === "risk" ? "High risk" : "Needs attention"}</span></div><div className="drawer-grid"><div><Droplets size={16}/><span>Soil moisture</span><b>{zone.moisture}%</b></div><div><Thermometer size={16}/><span>Temperature</span><b>{zone.temp}°C</b></div><div><ShieldCheck size={16}/><span>Risk level</span><b>{zone.risk}</b></div><div><Leaf size={16}/><span>Crop</span><b>{zone.crop}</b></div></div><div className="drawer-section"><div className="eyebrow">CROPNOVA INSIGHT</div><h3>{zone.status === "healthy" ? "Conditions look stable." : zone.status === "dry" ? "Moisture is below the preferred range." : "A closer field inspection is recommended."}</h3><p>{zone.status === "healthy" ? "No active signal requires action right now. Continue monitoring the zone." : "CropNova combines sensor and visual signals to help you decide what to check next."}</p></div><button className="primary-btn wide" onClick={close}>Done</button></aside></div>; }

createRoot(document.getElementById("root")).render(<App />);
