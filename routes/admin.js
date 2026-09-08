const express = require('express');
const crypto  = require('crypto');
const { stmts } = require('../db');
const router = express.Router();

function safeCompare(a, b) {
  try { return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)); } catch { return false; }
}
function requireAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate','Basic realm="Abinaya Admin"');
    return res.status(401).send('Authentication required.');
  }
  let user, pass;
  try { [user,pass] = Buffer.from(auth.split(' ')[1],'base64').toString('utf8').split(':'); }
  catch { return res.status(401).send('Invalid credentials.'); }
  if (safeCompare(user||'', process.env.ADMIN_USERNAME||'abinaya') &&
      safeCompare(pass||'', process.env.ADMIN_PASSWORD||'admin123')) return next();
  console.warn(`[SECURITY] Failed admin login from ${req.ip}`);
  res.set('WWW-Authenticate','Basic realm="Abinaya Admin"');
  return res.status(401).send('Invalid credentials.');
}
router.use(requireAuth);

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function badge(s) {
  const c={new:'#f59e0b',read:'#60a5fa',replied:'#34d399',closed:'#94a3b8'};
  return `<span style="background:${c[s]||'#94a3b8'}22;color:${c[s]||'#94a3b8'};border:1px solid ${c[s]||'#94a3b8'}55;padding:2px 10px;border-radius:20px;font-size:.7rem;font-weight:700;text-transform:uppercase">${esc(s)}</span>`;
}
function btn(color,onclick,label) {
  return `<button onclick="${onclick}" style="background:${color}22;color:${color};border:1px solid ${color}55;padding:3px 10px;border-radius:6px;cursor:pointer;font-size:.72rem;font-weight:700;font-family:Outfit,sans-serif">${label}</button>`;
}

router.get('/', (req,res) => {
  const totalApps   = stmts.countApplications()?.count||0;
  const newApps     = stmts.countNewApplications()?.count||0;
  const newContacts = stmts.countNewContacts()?.count||0;
  const totalViews  = stmts.getTotalViews()?.count||0;
  const weekViews   = stmts.getRecentViews()?.count||0;
  const apps        = stmts.getAllApplications();
  const contacts    = stmts.getAllContacts();
  const maxAppId    = stmts.getMaxApplicationId()?.id||0;
  const maxConId    = stmts.getMaxContactId()?.id||0;

  const appRows = apps.length ? apps.map(a=>`<tr>
    <td style="color:#4e6070">#${esc(a.id)}</td>
    <td><strong>${esc(a.first_name)} ${esc(a.last_name||'')}</strong></td>
    <td><a href="mailto:${esc(a.email)}" style="color:#e8c547">${esc(a.email)}</a></td>
    <td style="color:#8fa3b1">${esc(a.phone||'—')}</td>
    <td style="color:#e8c547;font-weight:600">${esc(a.service)}</td>
    <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#8fa3b1" title="${esc(a.message||'')}">${esc(a.message||'—')}</td>
    <td>${badge(a.status)}</td>
    <td style="font-size:.75rem;color:#4e6070;white-space:nowrap">${esc(a.created_at)}</td>
    <td><div style="display:flex;gap:5px;flex-wrap:wrap">
      ${btn('#60a5fa',`upd('application',${Number(a.id)},'read')`,'Read')}
      ${btn('#34d399',`upd('application',${Number(a.id)},'replied')`,'Replied')}
      ${btn('#94a3b8',`upd('application',${Number(a.id)},'closed')`,'Close')}
      ${btn('#e8c547',`replyTo('${esc(a.email)}','${esc(a.first_name)}','${esc(a.service)}')`,'↗ Reply')}
      ${btn('#ef4444',`del('application',${Number(a.id)})`,'Delete')}
    </div></td>
  </tr>`).join('') : `<tr><td colspan="9" style="text-align:center;padding:3rem;color:#4e6070;font-style:italic">No applications yet.</td></tr>`;

  const conRows = contacts.length ? contacts.map(c=>`<tr>
    <td style="color:#4e6070">#${esc(c.id)}</td>
    <td><strong>${esc(c.name)}</strong></td>
    <td><a href="mailto:${esc(c.email)}" style="color:#e8c547">${esc(c.email)}</a></td>
    <td style="color:#8fa3b1">${esc(c.subject||'—')}</td>
    <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#8fa3b1">${esc(c.message)}</td>
    <td>${badge(c.status)}</td>
    <td style="font-size:.75rem;color:#4e6070;white-space:nowrap">${esc(c.created_at)}</td>
    <td><div style="display:flex;gap:5px">
      ${btn('#60a5fa',`upd('contact',${Number(c.id)},'read')`,'Read')}
      ${btn('#34d399',`upd('contact',${Number(c.id)},'replied')`,'Replied')}
      ${btn('#e8c547',`replyTo('${esc(c.email)}','${esc(c.name)}','Re: ${esc(c.subject||'Your message')}')`,'↗ Reply')}
      ${btn('#ef4444',`del('contact',${Number(c.id)})`,'Delete')}
    </div></td>
  </tr>`).join('') : `<tr><td colspan="8" style="text-align:center;padding:3rem;color:#4e6070;font-style:italic">No messages yet.</td></tr>`;

  res.set('X-Frame-Options','DENY');
  res.set('Cache-Control','no-store');
  res.send(`<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin — Abinaya</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#080b10;color:#eef2f6;font-family:'Outfit',sans-serif;font-size:14px;min-height:100vh;transition:background .3s}
body.flash{animation:flashbg .6s ease-in-out 3}
@keyframes flashbg{0%,100%{background:#080b10}50%{background:#2a1f08}}
a{text-decoration:none}
.topbar{background:#0e1318;border-bottom:1px solid rgba(255,255,255,.07);padding:.9rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;position:sticky;top:0;z-index:10;backdrop-filter:blur(12px)}
.tb-brand{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:900;color:#e8c547}
.tb-sub{font-size:.7rem;color:#4e6070;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-top:.1rem;display:flex;align-items:center;gap:6px}
.live-dot{width:7px;height:7px;border-radius:50%;background:#34d399;display:inline-block;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.tb-right{display:flex;align-items:center;gap:.8rem;flex-wrap:wrap}
.tb-time{font-size:.75rem;color:#4e6070}
.tb-btn{background:#141b22;border:1px solid rgba(255,255,255,.13);color:#8fa3b1;font-family:'Outfit',sans-serif;font-size:.75rem;font-weight:600;padding:.4rem .9rem;border-radius:6px;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-block}
.tb-btn:hover{background:#e8c547;color:#080b10;border-color:#e8c547}
.tb-btn.sound-on{background:#1a6b3a22;border-color:#34d399;color:#34d399}
.tb-btn.csv-btn{background:#1a3a6b22;border-color:#60a5fa;color:#60a5fa}
.tb-btn.csv-btn:hover{background:#60a5fa;color:#080b10}
.content{padding:1.8rem 2rem}
.alert-banner{display:none;background:linear-gradient(90deg,#e8c547,#f07843);color:#080b10;padding:1rem 1.4rem;border-radius:12px;margin-bottom:1.5rem;font-weight:700;align-items:center;gap:.8rem;cursor:pointer;animation:slideDown .4s ease}
@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:1rem;margin-bottom:2rem}
.sc{background:#111820;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:1.2rem 1.4rem;position:relative;overflow:hidden;transition:border-color .2s}
.sc:hover{border-color:rgba(255,255,255,.13)}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.sc.c1::before{background:#e8c547}.sc.c2::before{background:#f59e0b}
.sc.c3::before{background:#60a5fa}.sc.c4::before{background:#34d399}.sc.c5::before{background:#a78bfa}
.sc-n{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;line-height:1;margin-bottom:.3rem}
.sc.c1 .sc-n{color:#e8c547}.sc.c2 .sc-n{color:#f59e0b}.sc.c3 .sc-n{color:#60a5fa}
.sc.c4 .sc-n{color:#34d399}.sc.c5 .sc-n{color:#a78bfa}
.sc-l{font-size:.67rem;color:#4e6070;text-transform:uppercase;letter-spacing:.1em;font-weight:600}
.tabs{display:flex;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:1.5rem}
.tab{padding:.65rem 1.4rem;cursor:pointer;font-weight:600;font-size:.82rem;border:none;background:none;color:#4e6070;border-bottom:2px solid transparent;transition:all .2s;font-family:'Outfit',sans-serif}
.tab:hover{color:#8fa3b1}.tab.on{color:#e8c547;border-bottom-color:#e8c547}
.panel{display:none}.panel.on{display:block}
.tw{overflow-x:auto;border:1px solid rgba(255,255,255,.07);border-radius:12px}
table{width:100%;border-collapse:collapse;min-width:1000px}
thead tr{background:#0e1318}
th{padding:.7rem 1rem;text-align:left;font-size:.67rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#4e6070;white-space:nowrap;border-bottom:1px solid rgba(255,255,255,.07)}
tbody tr{border-top:1px solid rgba(255,255,255,.03);transition:background .15s}
tbody tr:hover{background:rgba(255,255,255,.02)}
td{padding:.8rem 1rem;vertical-align:middle}
#toast{position:fixed;bottom:2rem;right:2rem;background:#111820;border:1px solid rgba(255,255,255,.13);color:#eef2f6;padding:.8rem 1.4rem;border-radius:10px;font-size:.85rem;font-weight:500;opacity:0;transform:translateY(10px);transition:all .3s;pointer-events:none;z-index:999}
#toast.show{opacity:1;transform:translateY(0)}
@media(max-width:900px){.stats{grid-template-columns:1fr 1fr 1fr}.content{padding:1rem}}
</style></head><body id="bodyEl">

<div class="topbar">
  <div>
    <div class="tb-brand">Abinaya — Admin Panel</div>
    <div class="tb-sub"><span class="live-dot"></span> Live · Checking for new applications</div>
  </div>
  <div class="tb-right">
    <span class="tb-time" id="clock"></span>
    <button class="tb-btn sound-on" id="soundBtn" onclick="toggleSound()">🔔 Sound: ON</button>
    <button class="tb-btn csv-btn" onclick="exportCSV('applications')">⬇ Export Apps CSV</button>
    <button class="tb-btn csv-btn" onclick="exportCSV('contacts')">⬇ Export Msgs CSV</button>
    <button class="tb-btn" onclick="location.reload()">↻ Refresh</button>
    <a href="/" class="tb-btn">← Live Site</a>
  </div>
</div>

<div class="content">
  <div class="alert-banner" id="alertBanner" onclick="dismissAlert()">
    🎉 <span id="alertText">New application received!</span> — click to dismiss
  </div>
  <div class="stats">
    <div class="sc c1"><div class="sc-n" id="statTotal">${totalApps}</div><div class="sc-l">Total Applications</div></div>
    <div class="sc c2"><div class="sc-n" id="statNew">${newApps}</div><div class="sc-l">New Applications</div></div>
    <div class="sc c3"><div class="sc-n" id="statMsg">${newContacts}</div><div class="sc-l">New Messages</div></div>
    <div class="sc c4"><div class="sc-n">${totalViews}</div><div class="sc-l">Total Page Views</div></div>
    <div class="sc c5"><div class="sc-n">${weekViews}</div><div class="sc-l">Views (7 Days)</div></div>
  </div>
  <div class="tabs">
    <button class="tab on" onclick="showTab('apps')">📋 Applications (${apps.length})</button>
    <button class="tab" onclick="showTab('cons')">💬 Messages (${contacts.length})</button>
  </div>
  <div class="panel on" id="p-apps">
    <div class="tw"><table>
      <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Service</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
      <tbody id="appsBody">${appRows}</tbody>
    </table></div>
  </div>
  <div class="panel" id="p-cons">
    <div class="tw"><table>
      <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
      <tbody id="consBody">${conRows}</tbody>
    </table></div>
  </div>
</div>
<div id="toast"></div>

<script>
let lastAppId=${maxAppId}, lastConId=${maxConId}, soundOn=true;

function showTab(n){
  document.querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('on',['apps','cons'][i]===n));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on',p.id==='p-'+n));
}
function toast(msg,ok=true){
  const t=document.getElementById('toast');
  t.textContent=msg;t.style.borderColor=ok?'rgba(52,211,153,.4)':'rgba(239,68,68,.4)';
  t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);
}
async function upd(type,id,status){
  const r=await fetch('/admin/api/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,id,status})});
  const d=await r.json();
  if(d.success){toast('Status updated to "'+status+'"');setTimeout(()=>location.reload(),900);}
  else toast('Update failed',false);
}
async function del(type,id){
  if(!confirm('Permanently delete this record?'))return;
  const r=await fetch('/admin/api/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,id})});
  const d=await r.json();
  if(d.success){toast('Record deleted');setTimeout(()=>location.reload(),900);}
  else toast('Delete failed',false);
}
function replyTo(email,name,subject){
  const body=encodeURIComponent('Hi '+name+',\\n\\nThank you for reaching out!\\n\\nBest regards,\\nAbinaya');
  const sub=encodeURIComponent('Re: '+subject);
  window.open('https://mail.google.com/mail/?view=cm&to='+email+'&su='+sub+'&body='+body,'_blank');
}
function updateClock(){document.getElementById('clock').textContent=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});}
updateClock();setInterval(updateClock,1000);

function toggleSound(){
  soundOn=!soundOn;
  const btn=document.getElementById('soundBtn');
  btn.textContent=soundOn?'🔔 Sound: ON':'🔕 Sound: OFF';
  btn.classList.toggle('sound-on',soundOn);
  localStorage.setItem('adminSound',soundOn?'1':'0');
}
if(localStorage.getItem('adminSound')==='0'){soundOn=false;document.getElementById('soundBtn').textContent='🔕 Sound: OFF';document.getElementById('soundBtn').classList.remove('sound-on');}

function playAlert(){
  if(!soundOn)return;
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    [[880,0,.15],[1100,.18,.15],[1320,.36,.2]].forEach(([f,s,d])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.value=f;o.type='sine';
      g.gain.setValueAtTime(.25,ctx.currentTime+s);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+s+d);
      o.start(ctx.currentTime+s);o.stop(ctx.currentTime+s+d);
    });
  }catch(e){}
}
function showAlert(text){
  document.getElementById('alertText').textContent=text;
  document.getElementById('alertBanner').style.display='flex';
  document.getElementById('bodyEl').classList.add('flash');
  if(Notification&&Notification.permission==='granted')new Notification('Abinaya Portfolio',{body:text});
}
function dismissAlert(){
  document.getElementById('alertBanner').style.display='none';
  document.getElementById('bodyEl').classList.remove('flash');
}
if(window.Notification&&Notification.permission==='default')Notification.requestPermission();

async function pollForUpdates(){
  try{
    const res=await fetch('/admin/api/poll?lastApp='+lastAppId+'&lastCon='+lastConId);
    const data=await res.json();
    if(data.newApplications&&data.newApplications.length){
      playAlert();
      const a=data.newApplications[0];
      showAlert('New application from '+a.first_name+' for '+a.service+'!');
      lastAppId=Math.max(...data.newApplications.map(x=>x.id));
      document.getElementById('statNew').textContent=data.stats.newApplications;
      document.getElementById('statTotal').textContent=data.stats.totalApplications;
      setTimeout(()=>location.reload(),3500);
    }
    if(data.newContacts&&data.newContacts.length){
      playAlert();
      showAlert('New message from '+data.newContacts[0].name+'!');
      lastConId=Math.max(...data.newContacts.map(x=>x.id));
      setTimeout(()=>location.reload(),3500);
    }
  }catch(e){}
}
setInterval(pollForUpdates,5000);

// CSV Export
function exportCSV(type){
  fetch('/admin/api/data').then(r=>r.json()).then(data=>{
    const rows = type==='applications' ? data.applications : data.contacts;
    if(!rows||!rows.length){toast('No data to export',false);return;}
    const keys=Object.keys(rows[0]);
    const csv=[keys.join(','),...rows.map(r=>keys.map(k=>'"'+(String(r[k]||'').replace(/"/g,'""'))+'"').join(','))].join('\\n');
    const a=document.createElement('a');
    a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
    a.download='abinaya_'+type+'_'+new Date().toISOString().slice(0,10)+'.csv';
    a.click();
    toast('CSV downloaded!');
  });
}
</script>
</body></html>`);
});

router.get('/api/poll',(req,res)=>{
  const lastApp=parseInt(req.query.lastApp,10)||0;
  const lastCon=parseInt(req.query.lastCon,10)||0;
  res.json({
    newApplications: stmts.getNewerApplications(lastApp),
    newContacts:     stmts.getNewerContacts(lastCon),
    stats:{
      totalApplications: stmts.countApplications()?.count||0,
      newApplications:   stmts.countNewApplications()?.count||0,
      newContacts:       stmts.countNewContacts()?.count||0,
    }
  });
});
router.get('/api/data',(req,res)=>{
  res.json({ applications:stmts.getAllApplications(), contacts:stmts.getAllContacts() });
});
router.post('/api/status',express.json({limit:'1kb'}),(req,res)=>{
  const{type,id,status}=req.body;
  if(!['application','contact'].includes(type)||!['new','read','replied','closed'].includes(status)||!Number.isInteger(Number(id)))
    return res.status(400).json({success:false});
  try{
    if(type==='application') stmts.updateApplicationStatus(status,Number(id));
    else stmts.updateContactStatus(status,Number(id));
    res.json({success:true});
  }catch{res.status(500).json({success:false});}
});
router.post('/api/delete',express.json({limit:'1kb'}),(req,res)=>{
  const{type,id}=req.body;
  if(!['application','contact'].includes(type)||!Number.isInteger(Number(id)))
    return res.status(400).json({success:false});
  try{
    if(type==='application') stmts.deleteApplication(Number(id));
    else stmts.deleteContact(Number(id));
    res.json({success:true});
  }catch{res.status(500).json({success:false});}
});

module.exports = router;
