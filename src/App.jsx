import { useState, useEffect, useRef } from "react";

const ADMIN_PASSWORD = "summit2026";
const STORAGE_KEY = "ts_philosophy_entries_v2";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0a0905; --bg2:#111009; --bg3:#1a1710;
    --gold:#c9a84c; --gold-dim:#8a6f2e; --gold-bright:#e8c97a;
    --text:#e8e0cc; --text-dim:#8a8070; --text-muted:#4a4538;
    --border:#2a2518; --border-gold:#3a3020; --red:#8b3a3a; --green:#3a6b3a;
  }
  body { background:var(--bg); color:var(--text); font-family:'Crimson Pro',serif; min-height:100vh; }
  .app { min-height:100vh; display:flex; flex-direction:column; }
  .app-body { flex:1; }

  .header { border-bottom:1px solid var(--border-gold); padding:2rem 0 1.5rem; text-align:center; background:linear-gradient(180deg,#13110a 0%,transparent 100%); }
  .header-label { font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.3em; color:var(--gold-dim); text-transform:uppercase; margin-bottom:0.75rem; }
  .header-title { font-family:'Playfair Display',serif; font-size:2.4rem; font-weight:900; color:var(--gold-bright); line-height:1; }
  .header-subtitle { font-style:italic; font-size:1.1rem; color:var(--text-dim); margin-top:0.5rem; }
  .header-nav { display:flex; justify-content:center; gap:0.5rem; margin-top:1.25rem; }
  .nav-btn { font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.15em; text-transform:uppercase; padding:0.4rem 1rem; border:1px solid var(--border-gold); background:transparent; color:var(--text-dim); cursor:pointer; transition:all 0.2s; }
  .nav-btn:hover,.nav-btn.active { border-color:var(--gold-dim); color:var(--gold); background:rgba(201,168,76,0.06); }

  .progress-bar-wrap { max-width:760px; margin:1.5rem auto 0; padding:0 2rem; }
  .progress-info { display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:0.6rem; color:var(--text-muted); margin-bottom:0.4rem; }
  .progress-track { height:2px; background:var(--border); }
  .progress-fill { height:100%; background:linear-gradient(90deg,var(--gold-dim),var(--gold)); transition:width 0.6s ease; }

  .archive { max-width:920px; margin:2.5rem auto; padding:0 1.5rem; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:0.6rem; }
  .day-cell { aspect-ratio:1; border:1px solid var(--border); display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; position:relative; overflow:hidden; background:var(--bg2); }
  .day-cell.filled { border-color:var(--border-gold); }
  .day-cell.filled:hover { border-color:var(--gold-dim); background:var(--bg3); transform:translateY(-2px); box-shadow:0 6px 24px rgba(0,0,0,0.4); }
  .day-cell.empty { opacity:0.3; cursor:default; }
  .day-cell-photo { position:absolute; inset:0; background-size:cover; background-position:center top; opacity:0.18; transition:opacity 0.2s; }
  .day-cell.filled:hover .day-cell-photo { opacity:0.28; }
  .day-cell-inner { position:relative; z-index:1; text-align:center; padding:0.5rem; }
  .day-num { font-family:'Playfair Display',serif; font-size:1.7rem; font-weight:700; color:var(--gold); line-height:1; }
  .day-cell.empty .day-num { color:var(--text-muted); }
  .day-cell-label { font-family:'JetBrains Mono',monospace; font-size:0.48rem; letter-spacing:0.12em; color:var(--text-muted); text-transform:uppercase; margin-top:0.15rem; }
  .day-title-preview { font-size:0.68rem; color:var(--text-dim); margin-top:0.3rem; line-height:1.3; max-height:2.6em; overflow:hidden; }

  .detail-overlay { position:fixed; inset:0; background:rgba(5,4,2,0.93); z-index:100; display:flex; align-items:center; justify-content:center; padding:1.5rem; backdrop-filter:blur(6px); animation:fadeIn 0.2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .detail-card { background:var(--bg2); border:1px solid var(--border-gold); max-width:680px; width:100%; max-height:88vh; overflow-y:auto; position:relative; animation:slideUp 0.25s ease; }
  @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  .detail-photo-banner { width:100%; height:200px; object-fit:cover; object-position:center top; display:block; border-bottom:1px solid var(--border-gold); filter:sepia(30%) brightness(0.85); }
  .detail-body { padding:2rem 2.5rem 2.5rem; }
  .detail-philosopher-name { font-family:'JetBrains Mono',monospace; font-size:0.58rem; letter-spacing:0.2em; color:var(--gold-dim); text-transform:uppercase; margin-bottom:0.3rem; }
  .detail-day-num { font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.25em; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.75rem; }
  .detail-title { font-family:'Playfair Display',serif; font-size:2rem; font-weight:700; color:var(--gold-bright); line-height:1.2; margin-bottom:1.25rem; }
  .detail-divider { width:3rem; height:1px; background:var(--gold-dim); margin-bottom:1.5rem; }
  .detail-content { font-size:1.15rem; line-height:1.88; color:var(--text); white-space:pre-wrap; }
  .detail-close { position:absolute; top:0.85rem; right:0.85rem; background:rgba(10,9,5,0.75); border:1px solid var(--border-gold); color:var(--text-muted); cursor:pointer; font-family:'JetBrains Mono',monospace; font-size:0.6rem; letter-spacing:0.1em; padding:0.35rem 0.7rem; transition:all 0.2s; z-index:2; }
  .detail-close:hover { border-color:var(--gold-dim); color:var(--gold); }
  .detail-nav { display:flex; justify-content:space-between; margin-top:2rem; padding-top:1.25rem; border-top:1px solid var(--border); }
  .detail-nav-btn { background:transparent; border:1px solid var(--border-gold); color:var(--text-dim); font-family:'JetBrains Mono',monospace; font-size:0.6rem; padding:0.4rem 0.9rem; cursor:pointer; transition:all 0.2s; text-transform:uppercase; letter-spacing:0.1em; }
  .detail-nav-btn:hover { border-color:var(--gold-dim); color:var(--gold); }
  .detail-nav-btn:disabled { opacity:0.2; cursor:default; }

  .list-view { max-width:760px; margin:2.5rem auto; padding:0 1.5rem; }
  .list-item { display:grid; grid-template-columns:3rem 48px 1fr; gap:1rem; padding:1.25rem 0; border-bottom:1px solid var(--border); cursor:pointer; transition:all 0.15s; align-items:center; }
  .list-item:hover .list-title { color:var(--gold-bright); }
  .list-item-num { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:700; color:var(--gold-dim); text-align:right; }
  .list-philosopher-thumb { width:44px; height:44px; border-radius:50%; object-fit:cover; object-position:center top; border:1px solid var(--border-gold); filter:sepia(20%) brightness(0.9); }
  .list-philosopher-placeholder { width:44px; height:44px; border-radius:50%; border:1px solid var(--border); background:var(--bg3); display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:1.1rem; }
  .list-info { min-width:0; }
  .list-title { font-family:'Playfair Display',serif; font-size:1.1rem; color:var(--text); transition:color 0.15s; }
  .list-philosopher-label { font-family:'JetBrains Mono',monospace; font-size:0.56rem; letter-spacing:0.1em; color:var(--gold-dim); margin-top:0.1rem; text-transform:uppercase; }
  .list-preview { font-size:0.9rem; color:var(--text-dim); font-style:italic; margin-top:0.2rem; line-height:1.5; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }

  .admin-wrap { max-width:680px; margin:2.5rem auto; padding:0 1.5rem; }
  .admin-lock { text-align:center; padding:4rem 2rem; }
  .admin-lock-icon { font-size:2.5rem; margin-bottom:1rem; }
  .admin-lock h2 { font-family:'Playfair Display',serif; font-size:1.5rem; color:var(--gold); margin-bottom:0.5rem; }
  .admin-lock p { font-size:1rem; color:var(--text-dim); margin-bottom:1.5rem; font-style:italic; }
  .admin-section-title { font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.25em; color:var(--gold-dim); text-transform:uppercase; margin-bottom:1.25rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border); }
  .form-group { margin-bottom:1.1rem; }
  .form-label { display:block; font-family:'JetBrains Mono',monospace; font-size:0.58rem; letter-spacing:0.15em; color:var(--gold-dim); text-transform:uppercase; margin-bottom:0.4rem; }
  .form-input,.form-textarea,.form-select { width:100%; background:var(--bg3); border:1px solid var(--border); color:var(--text); font-family:'Crimson Pro',serif; font-size:1.05rem; padding:0.6rem 0.85rem; outline:none; transition:border-color 0.2s; resize:vertical; }
  .form-input:focus,.form-textarea:focus,.form-select:focus { border-color:var(--gold-dim); }
  .form-textarea { min-height:160px; line-height:1.7; }
  .form-select { font-family:'JetBrains Mono',monospace; font-size:0.75rem; }
  .form-select option { background:var(--bg2); }

  .photo-upload-area { border:1px dashed var(--border-gold); padding:1.1rem; display:flex; gap:1rem; align-items:center; background:var(--bg3); cursor:pointer; transition:border-color 0.2s; }
  .photo-upload-area:hover { border-color:var(--gold-dim); }
  .photo-preview { width:70px; height:70px; object-fit:cover; object-position:center top; border:1px solid var(--border-gold); filter:sepia(20%); flex-shrink:0; }
  .photo-placeholder { width:70px; height:70px; border:1px solid var(--border); background:var(--bg2); display:flex; align-items:center; justify-content:center; font-size:1.8rem; flex-shrink:0; }
  .photo-upload-text p { font-family:'JetBrains Mono',monospace; font-size:0.58rem; color:var(--text-dim); letter-spacing:0.06em; line-height:1.7; }
  .photo-upload-text span { color:var(--gold-dim); }

  .btn { font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.15em; text-transform:uppercase; padding:0.6rem 1.4rem; border:1px solid; cursor:pointer; transition:all 0.2s; }
  .btn-gold { background:var(--gold); border-color:var(--gold); color:var(--bg); }
  .btn-gold:hover { background:var(--gold-bright); border-color:var(--gold-bright); }
  .btn-outline { background:transparent; border-color:var(--border-gold); color:var(--text-dim); }
  .btn-outline:hover { border-color:var(--gold-dim); color:var(--gold); }
  .btn-sm { padding:0.3rem 0.7rem; font-size:0.55rem; }
  .btn-row { display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; }
  .success-msg { font-family:'JetBrains Mono',monospace; font-size:0.6rem; color:#7ab87a; padding:0.45rem 0.85rem; border:1px solid var(--green); background:rgba(58,107,58,0.1); }

  .existing-list { margin-top:2rem; }
  .existing-item { display:flex; align-items:center; gap:0.85rem; padding:0.75rem 0; border-bottom:1px solid var(--border); }
  .existing-item-photo { width:36px; height:36px; border-radius:50%; object-fit:cover; border:1px solid var(--border-gold); filter:sepia(20%); flex-shrink:0; }
  .existing-item-info { flex:1; min-width:0; }
  .existing-day-label { font-family:'JetBrains Mono',monospace; font-size:0.55rem; color:var(--gold-dim); letter-spacing:0.08em; }
  .existing-day-title { font-size:1rem; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .existing-actions { display:flex; gap:0.5rem; flex-shrink:0; }
  .icon-btn { background:transparent; border:1px solid var(--border); color:var(--text-muted); cursor:pointer; padding:0.28rem 0.6rem; font-family:'JetBrains Mono',monospace; font-size:0.56rem; transition:all 0.2s; }
  .icon-btn:hover { border-color:var(--gold-dim); color:var(--gold); }
  .icon-btn.del:hover { border-color:var(--red); color:#c47a7a; }

  .empty-state { text-align:center; padding:5rem 2rem; }
  .empty-state-icon { font-size:3rem; margin-bottom:1rem; opacity:0.35; }
  .empty-state h3 { font-family:'Playfair Display',serif; font-size:1.4rem; color:var(--text-dim); margin-bottom:0.5rem; }
  .empty-state p { font-size:1rem; color:var(--text-muted); font-style:italic; }

  .footer { border-top:1px solid var(--border-gold); padding:2rem 2rem 1.75rem; text-align:center; margin-top:4rem; background:linear-gradient(0deg,#0d0c07 0%,transparent 100%); }
  .footer-logo { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:700; color:var(--gold); letter-spacing:0.05em; margin-bottom:0.3rem; }
  .footer-tagline { font-family:'JetBrains Mono',monospace; font-size:0.55rem; letter-spacing:0.2em; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.9rem; }
  .footer-link { display:inline-flex; align-items:center; gap:0.4rem; font-family:'JetBrains Mono',monospace; font-size:0.6rem; letter-spacing:0.12em; color:var(--gold-dim); text-decoration:none; border:1px solid var(--border-gold); padding:0.35rem 0.9rem; transition:all 0.2s; text-transform:uppercase; }
  .footer-link:hover { border-color:var(--gold-dim); color:var(--gold); background:rgba(201,168,76,0.06); }
  .footer-copy { font-family:'JetBrains Mono',monospace; font-size:0.5rem; color:var(--text-muted); margin-top:0.9rem; letter-spacing:0.1em; }
`;

function compressImage(file, maxW = 800, q = 0.78) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxW / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        res(canvas.toDataURL("image/jpeg", q));
      };
      img.onerror = rej;
      img.src = ev.target.result;
    };
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function load() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

const TOTAL = 30;

export default function App() {
  const [entries, setEntries] = useState({});
  const [view, setView] = useState("archive");
  const [selected, setSelected] = useState(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [editDay, setEditDay] = useState(1);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPhilosopher, setEditPhilosopher] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  useEffect(() => { setEntries(load()); }, []);

  const filledDays = Object.keys(entries).map(Number).sort((a, b) => a - b);
  const filledCount = filledDays.length;

  function persist(u) { setEntries(u); save(u); }

  function handleCellClick(day) { if (entries[day]) setSelected(day); }

  function handleEdit(day) {
    const e = entries[day];
    setEditDay(day); setEditTitle(e.title || ""); setEditContent(e.content || "");
    setEditPhilosopher(e.philosopher || ""); setEditPhoto(e.photo || null);
    setEditingKey(day); setView("admin"); setAdminUnlocked(true); setSaved(false);
  }

  function handleDelete(day) { const u = { ...entries }; delete u[day]; persist(u); }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditPhoto(await compressImage(file));
  }

  function handleSave() {
    if (!editTitle.trim()) return;
    persist({ ...entries, [editDay]: { day: editDay, title: editTitle.trim(), content: editContent.trim(), philosopher: editPhilosopher.trim(), photo: editPhoto || null } });
    setSaved(true); setEditTitle(""); setEditContent(""); setEditPhilosopher(""); setEditPhoto(null); setEditingKey(null);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleSelectDay(d) {
    const n = Number(d); setEditDay(n);
    if (entries[n]) { setEditTitle(entries[n].title || ""); setEditContent(entries[n].content || ""); setEditPhilosopher(entries[n].philosopher || ""); setEditPhoto(entries[n].photo || null); setEditingKey(n); }
    else { setEditTitle(""); setEditContent(""); setEditPhilosopher(""); setEditPhoto(null); setEditingKey(null); }
  }

  function handleAdminLogin() {
    if (adminPass === ADMIN_PASSWORD) { setAdminUnlocked(true); setAdminPass(""); }
  }

  const selEntry = selected ? entries[selected] : null;
  function nextDay() { const i = filledDays.indexOf(selected); if (i < filledDays.length - 1) setSelected(filledDays[i + 1]); }
  function prevDay() { const i = filledDays.indexOf(selected); if (i > 0) setSelected(filledDays[i - 1]); }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="app-body">

          {/* HEADER */}
          <header className="header">
            <div className="header-label">Summit Labs · True Strategist</div>
            <div className="header-title">30-Day Philosophy Challenge</div>
            <div className="header-subtitle">A journey through thought, strategy & the examined life</div>
            <nav className="header-nav">
              {["archive","list","admin"].map(v => (
                <button key={v} className={`nav-btn ${view===v?"active":""}`} onClick={() => setView(v)}>
                  {v[0].toUpperCase()+v.slice(1)}
                </button>
              ))}
            </nav>
            <div className="progress-bar-wrap">
              <div className="progress-info">
                <span>{filledCount} of {TOTAL} days recorded</span>
                <span>{Math.round((filledCount/TOTAL)*100)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{width:`${(filledCount/TOTAL)*100}%`}} />
              </div>
            </div>
          </header>

          {/* ARCHIVE */}
          {view==="archive" && (
            <div className="archive">
              <div className="grid">
                {Array.from({length:TOTAL},(_,i)=>i+1).map(day => {
                  const e = entries[day];
                  return (
                    <div key={day} className={`day-cell ${e?"filled":"empty"}`} onClick={()=>handleCellClick(day)}>
                      {e?.photo && <div className="day-cell-photo" style={{backgroundImage:`url(${e.photo})`}} />}
                      <div className="day-cell-inner">
                        <div className="day-num">{day}</div>
                        <div className="day-cell-label">Day</div>
                        {e && <div className="day-title-preview">{e.title}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {filledCount===0 && (
                <div className="empty-state" style={{marginTop:"2rem"}}>
                  <div className="empty-state-icon">📜</div>
                  <h3>No entries yet</h3>
                  <p>Go to Admin to start adding your philosophy challenge days.</p>
                </div>
              )}
            </div>
          )}

          {/* LIST */}
          {view==="list" && (
            <div className="list-view">
              {filledCount===0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📜</div>
                  <h3>No entries yet</h3>
                  <p>Go to Admin to start adding your philosophy challenge days.</p>
                </div>
              ) : filledDays.map(day => {
                const e = entries[day];
                return (
                  <div key={day} className="list-item" onClick={()=>{setSelected(day);setView("archive");}}>
                    <div className="list-item-num">{day}</div>
                    {e.photo
                      ? <img src={e.photo} className="list-philosopher-thumb" alt={e.philosopher||""} />
                      : <div className="list-philosopher-placeholder">🏛</div>}
                    <div className="list-info">
                      <div className="list-title">{e.title}</div>
                      {e.philosopher && <div className="list-philosopher-label">{e.philosopher}</div>}
                      {e.content && <div className="list-preview">{e.content}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ADMIN */}
          {view==="admin" && (
            <div className="admin-wrap">
              {!adminUnlocked ? (
                <div className="admin-lock">
                  <div className="admin-lock-icon">🔐</div>
                  <h2>Admin Access</h2>
                  <p>Enter the password to manage entries.</p>
                  <div className="form-group" style={{maxWidth:300,margin:"0 auto 1rem"}}>
                    <input className="form-input" type="password" placeholder="Password" value={adminPass}
                      onChange={e=>setAdminPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdminLogin()} />
                  </div>
                  <button className="btn btn-gold" onClick={handleAdminLogin}>Enter</button>
                </div>
              ) : (
                <>
                  <div className="admin-section-title">Add / Edit Entry</div>
                  <div className="form-group">
                    <label className="form-label">Day Number</label>
                    <select className="form-select" value={editDay} onChange={e=>handleSelectDay(e.target.value)}>
                      {Array.from({length:TOTAL},(_,i)=>i+1).map(d=>(
                        <option key={d} value={d}>Day {d}{entries[d]?" ✓":""}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title / Topic</label>
                    <input className="form-input" type="text" placeholder="e.g. The Stoic and the Mirror"
                      value={editTitle} onChange={e=>setEditTitle(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Philosopher Featured</label>
                    <input className="form-input" type="text" placeholder="e.g. Marcus Aurelius, Nietzsche, Ibn Khaldun..."
                      value={editPhilosopher} onChange={e=>setEditPhilosopher(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Philosopher Photo</label>
                    <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={handlePhotoUpload} />
                    <div className="photo-upload-area" onClick={()=>fileRef.current.click()}>
                      {editPhoto
                        ? <img src={editPhoto} className="photo-preview" alt="preview" />
                        : <div className="photo-placeholder">🏛</div>}
                      <div className="photo-upload-text">
                        <p><span>Click to upload</span> a photo of the philosopher.<br />
                        JPG or PNG — compressed automatically.<br />
                        Source from Wikipedia or Google Images.</p>
                      </div>
                    </div>
                    {editPhoto && (
                      <button className="btn btn-outline btn-sm" style={{marginTop:"0.5rem"}} onClick={()=>setEditPhoto(null)}>
                        Remove photo
                      </button>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Reflection</label>
                    <textarea className="form-textarea" placeholder="Paste your reflection, the full post, or notes here..."
                      value={editContent} onChange={e=>setEditContent(e.target.value)} />
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-gold" onClick={handleSave}>{editingKey?"Update Entry":"Save Entry"}</button>
                    {saved && <span className="success-msg">✓ Saved successfully</span>}
                  </div>
                  {filledCount>0 && (
                    <div className="existing-list">
                      <div className="admin-section-title" style={{marginTop:"2rem"}}>Saved Entries ({filledCount})</div>
                      {filledDays.map(day=>(
                        <div key={day} className="existing-item">
                          {entries[day].photo && <img src={entries[day].photo} className="existing-item-photo" alt="" />}
                          <div className="existing-item-info">
                            <div className="existing-day-label">Day {day}{entries[day].philosopher?` · ${entries[day].philosopher}`:""}</div>
                            <div className="existing-day-title">{entries[day].title}</div>
                          </div>
                          <div className="existing-actions">
                            <button className="icon-btn" onClick={()=>handleEdit(day)}>Edit</button>
                            <button className="icon-btn del" onClick={()=>handleDelete(day)}>Del</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* DETAIL OVERLAY */}
        {selected && selEntry && (
          <div className="detail-overlay" onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
            <div className="detail-card">
              <button className="detail-close" onClick={()=>setSelected(null)}>✕ Close</button>
              {selEntry.photo && <img src={selEntry.photo} className="detail-photo-banner" alt={selEntry.philosopher||""} />}
              <div className="detail-body">
                {selEntry.philosopher && <div className="detail-philosopher-name">{selEntry.philosopher}</div>}
                <div className="detail-day-num">Day {selected} · 30-Day Philosophy Challenge</div>
                <div className="detail-title">{selEntry.title}</div>
                <div className="detail-divider" />
                <div className="detail-content">
                  {selEntry.content || <span style={{color:"var(--text-muted)",fontStyle:"italic"}}>No reflection added yet.</span>}
                </div>
                <div className="detail-nav">
                  <button className="detail-nav-btn" onClick={prevDay} disabled={filledDays.indexOf(selected)===0}>← Prev</button>
                  <button className="detail-nav-btn" onClick={nextDay} disabled={filledDays.indexOf(selected)===filledDays.length-1}>Next →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-logo">Summit Labs</div>
          <div className="footer-tagline">Building from Tashkent · Est. 2024</div>
          <a href="https://t.me/summit_labs" target="_blank" rel="noopener noreferrer" className="footer-link">
            ✈ &nbsp;t.me/summit_labs
          </a>
          <div className="footer-copy">© Summit Labs 2026 · A Product of Summit Labs · True Strategist</div>
        </footer>
      </div>
    </>
  );
}
