"use strict";
/* ================= أدوات ================= */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ld=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const fmt=d=>new Date(d).toLocaleString("ar-EG",{dateStyle:"short",timeStyle:"short"});
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),2200)}
async function copy(s){try{await navigator.clipboard.writeText(s);toast("📋 اتنسخ")}catch(e){prompt("انسخ:",s)}}
function dl(name,text,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click()}

/* ================= البيانات (استبدلها بـ API) ================= */
const TARGETS=[
 {id:"MARS_JZERO_01",body:"mars",name:"فوهة جيزيرو",env:"دلتا قاع بحيرة قديمة",elevation:500,slope:4,aridity:90},
 {id:"MARS_GALE_01",body:"mars",name:"فوهة جيل",env:"رواسب طبقية",elevation:900,slope:6,aridity:92},
 {id:"MARS_ARCH_01",body:"mars",name:"سهول أركاديا",env:"سهول بركانية",elevation:1500,slope:2,aridity:96},
 {id:"MARS_MERID_01",body:"mars",name:"سهل ميريديياني",env:"رواسب هيماتيت",elevation:0,slope:1,aridity:95},
 {id:"MOON_TRNQ_01",body:"moon",name:"بحر الهدوء",env:"سهل بازلتي",elevation:300,slope:2,aridity:100},
 {id:"MOON_SHKL_01",body:"moon",name:"حافة شاكلتون",env:"قاعدة مقترحة بالقطب الجنوبي",elevation:2500,slope:12,aridity:100},
 {id:"MOON_TYCH_01",body:"moon",name:"فوهة تيخو",env:"فوهة حديثة",elevation:1800,slope:9,aridity:100},
 {id:"MOON_HADL_01",body:"moon",name:"وادي هادلي",env:"وادٍ بين الجبال",elevation:1000,slope:7,aridity:100}
];
const EARTH=[
 {id:"ATH_01",name:"صحراء أتاكاما",region:"تشيلي",elevation:650,slope:3.5,aridity:95,lat:-24.5,lon:-69.25},
 {id:"ATH_02",name:"محطة أبحاث المريخ MDRS",region:"يوتا، أمريكا",elevation:1400,slope:5,aridity:85,lat:38.4,lon:-110.8},
 {id:"ATH_03",name:"رامبلا دي باراكو",region:"إسبانيا",elevation:200,slope:6,aridity:70,lat:37,lon:-2.4},
 {id:"ATH_04",name:"وادي الموت",region:"كاليفورنيا",elevation:-80,slope:4,aridity:92,lat:36.5,lon:-117.1},
 {id:"ATH_05",name:"الوديان الجافة",region:"أنتاركتيكا",elevation:800,slope:7,aridity:98,lat:-77.5,lon:162.5},
 {id:"ATH_06",name:"جزيرة ديفون",region:"كندا",elevation:300,slope:3,aridity:88,lat:75.4,lon:-89},
 {id:"ATH_07",name:"براكين ماونا كيا",region:"هاواي",elevation:2800,slope:11,aridity:75,lat:19.8,lon:-155.5},
 {id:"ATH_08",name:"منخفض الدانكيل",region:"إثيوبيا",elevation:-100,slope:2,aridity:90,lat:14.2,lon:40.3},
 {id:"ATH_09",name:"وادي رم",region:"الأردن",elevation:900,slope:5,aridity:93,lat:29.6,lon:35.4},
 {id:"ATH_10",name:"بركان أسكجا",region:"آيسلندا",elevation:1500,slope:8,aridity:60,lat:65,lon:-16.7},
 {id:"ATH_11",name:"الصحراء الغربية",region:"مصر",elevation:150,slope:1.5,aridity:99,lat:27.5,lon:27},
 {id:"ATH_12",name:"نهر ريو تينتو",region:"إسبانيا",elevation:400,slope:7,aridity:65,lat:37.7,lon:-6.5}
];
const PROPS=[{k:"elevation",l:"الارتفاع",u:"م",r:3000,i:"⛰"},{k:"slope",l:"الميل",u:"°",r:15,i:"📐"},{k:"aridity",l:"الجفاف",u:"",r:100,i:"🏜"}];
const LAND=[
 [[-168,66],[-140,70],[-95,72],[-65,62],[-55,50],[-70,42],[-81,30],[-80,25],[-97,25],[-105,20],[-92,15],[-80,8],[-85,12],[-105,22],[-117,32],[-125,42],[-125,50],[-140,60],[-165,60]],
 [[-80,8],[-60,10],[-50,0],[-35,-6],[-40,-22],[-58,-38],[-65,-55],[-72,-50],[-72,-30],[-80,-5]],
 [[-10,36],[-9,43],[0,50],[10,55],[30,70],[70,73],[110,77],[180,68],[165,60],[140,45],[122,30],[110,20],[100,8],[90,22],[78,8],[70,22],[57,25],[50,30],[35,30],[28,36],[12,38]],
 [[-17,21],[-10,35],[10,37],[32,31],[43,12],[51,12],[40,-5],[40,-15],[33,-27],[20,-35],[12,-18],[9,4],[-8,4],[-17,14]],
 [[114,-22],[130,-12],[142,-11],[153,-27],[146,-39],[130,-32],[115,-34]],
 [[-55,60],[-20,70],[-20,82],[-60,82],[-70,76]],[[-180,-70],[180,-70],[180,-90],[-180,-90]]
];

/* ================= الحالة ================= */
const DEF_W={elevation:35,slope:30,aridity:35};
const newMission=()=>({id:uid(),name:"مهمة استكشاف جديدة",targetId:TARGETS[0].id,W:{...DEF_W},cmp:[]});
let M=ld("nz_cur",null)||newMission();
let saved=ld("nz_missions",[]),readings=ld("nz_readings",[]),DEV=ld("nz_devices",[]);
const save=()=>sv("nz_cur",M);
const tgt=()=>TARGETS.find(t=>t.id===M.targetId)||TARGETS[0];

/* ================= خوارزمية الـ Analog Score ================= */
const sim=(t,e,p)=>100*(1-Math.min(1,Math.abs(t[p.k]-e[p.k])/p.r));
const score=(t,e)=>{const tw=PROPS.reduce((a,p)=>a+M.W[p.k],0)||1;return PROPS.reduce((a,p)=>a+M.W[p.k]*sim(t,e,p),0)/tw};
const ranked=()=>{const t=tgt();return EARTH.map(e=>({...e,score:+score(t,e).toFixed(1),sims:PROPS.map(p=>Math.round(sim(t,e,p)))})).sort((a,b)=>b.score-a.score)};
const mine=()=>readings.filter(r=>r.mission===M.targetId);
function valOf(id){const a=mine().filter(r=>r.site===id);return a.length?+(a.reduce((s,r)=>s+r.v,0)/a.length).toFixed(1):null}

/* ================= مكونات UI ================= */
const tags=o=>`<div class="tags">${PROPS.map(p=>`<span>${p.i} ${o[p.k]}${p.u}</span>`).join("")}</div>`;
const ring=p=>`<div class="ring" style="--p:${p}"><span>${p}<small>%</small></span></div>`;
const empty=(t,b="")=>`<div class="empty">${t}${b}</div>`;
const X=lo=>(lo+180)/360*720,Y=la=>(90-la)/180*360;
const GRID='<g class="grid">'+[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(l=>`<line x1="${X(l)}" y1="0" x2="${X(l)}" y2="360"/>`).join("")+[-60,-30,0,30,60].map(l=>`<line x1="0" y1="${Y(l)}" x2="720" y2="${Y(l)}"/>`).join("")+"</g>";
const LANDS=LAND.map(p=>`<polygon class="land" points="${p.map(([a,b])=>X(a)+","+Y(b)).join(" ")}"/>`).join("");
const mapSVG=(list,sel)=>`<svg class="map" viewBox="0 0 720 360" role="img" aria-label="خريطة المواقع">${GRID}${LANDS}${list.map((r,i)=>`<g class="pin${r.id===sel?" sel":""}" data-id="${r.id}" transform="translate(${X(r.lon)} ${Y(r.lat)})"><circle class="pulse" r="11"/><circle class="dot" r="11"/><text y="4">${i+1}</text><title>${r.name}</title></g>`).join("")}</svg>`;
function spark(a){if(a.length<2)a=[a[0],a[0]];const mn=Math.min(...a),r=Math.max(...a)-mn||1;return `<svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none"><polyline points="${a.map((v,i)=>`${i/(a.length-1)*100},${28-(v-mn)/r*24}`).join(" ")}"/></svg>`}
function toggleCmp(id){const i=M.cmp.indexOf(id);if(i>=0)M.cmp.splice(i,1);else if(M.cmp.length>=3)return toast("أقصى حاجة 3 مواقع");else M.cmp.push(id);save()}
function mkReading(siteId,dev){
 const s=ranked().find(r=>r.id===siteId);
 const v=+Math.max(50,Math.min(99.5,s.score+Math.random()*8-4.5)).toFixed(1);
 readings.push({id:uid(),mission:M.targetId,site:siteId,dev,ts:new Date().toISOString(),v,soil:+(Math.random()*2.5+.3).toFixed(1),rad:+(Math.random()*2+1.5).toFixed(1),temp:+(Math.random()*40-35).toFixed(1)});
 sv("nz_readings",readings);
}

/* ================= الصفحات ================= */
function home(v){
 const t=tgt(),R=ranked(),top=R.slice(0,3),vd=mine();
 const steps=[["اختيار الهدف",1],["ترتيب النظائر الأرضية",1],["المقارنة بين المواقع",M.cmp.length>=2],["التحقق الميداني",vd.length>0],["حفظ المهمة",saved.some(s=>s.id===M.id)]];
 v.innerHTML=`
 <section class="hero2"><div>
  <p class="eyebrow">● التحقق الميداني · جاهز لإضافة القياسات والأجهزة</p>
  <h1>نكتشف من الفضاء.<br><span class="grad">نتحقق على الأرض.</span></h1>
  <p class="lead">اختار هدفك على المريخ أو القمر، قارنه بنظائره الأرضية، وبعدها اتحقق ميدانيًا بقياسات الـ Rover.</p>
  <div class="row"><select id="qt" aria-label="الهدف">${TARGETS.map(x=>`<option value="${x.id}"${x.id===t.id?" selected":""}>${x.body==="mars"?"🔴":"🌕"} ${x.name}</option>`).join("")}</select>
  <a class="btn pri" href="#/explore">استكشف النظائر ←</a></div></div>
  <div class="mapbox" style="position:static">${mapSVG(top)}</div></section>
 <div class="kpis">
  <div class="kpi"><small>الهدف الحالي</small><b>${t.name}</b><i>${t.body==="mars"?"المريخ":"القمر"}</i></div>
  <div class="kpi"><small>أفضل نظير</small><b>${R[0].name}</b><i>${R[0].score}%</i></div>
  <div class="kpi"><small>متوسط أعلى 3</small><b>${(top.reduce((s,r)=>s+r.score,0)/3).toFixed(1)}%</b></div>
  <div class="kpi"><small>قياسات ميدانية</small><b>${vd.length}</b></div>
  <div class="kpi"><small>الأجهزة</small><b>${DEV.length}</b></div></div>
 <div class="cols">
  <div class="panel"><h3>أفضل 3 نظائر</h3><div class="cards">${top.map((r,i)=>`<article class="card" data-go="explore"><div class="rank">${i+1}</div><div><h4>${r.name}</h4><p class="reg" style="margin:0">${r.region}</p></div>${ring(r.score)}</article>`).join("")}</div></div>
  <div class="panel"><h3>مسار المهمة</h3><ol class="steps">${steps.map(([l,d],i)=>`<li class="${d?"done":""}"><span>${d?"✓":i+1}</span>${l}</li>`).join("")}</ol></div></div>`;
 $("#qt").onchange=e=>{M.targetId=e.target.value;M.cmp=[];save();route()};
 v.onclick=e=>{if(e.target.closest("[data-go]"))location.hash="#/explore"};
}

let ex={min:0,sel:null};
function explore(v){
 const t=tgt();
 v.innerHTML=`<div class="panel filt">
  <div class="fg"><label>الجرم</label><div class="seg">${["mars","moon"].map(b=>`<button data-b="${b}" class="${b===t.body?"on":""}">${b==="mars"?"🔴 المريخ":"🌕 القمر"}</button>`).join("")}</div></div>
  <div class="fg"><label>الهدف</label><select id="et">${TARGETS.filter(x=>x.body===t.body).map(x=>`<option value="${x.id}"${x.id===t.id?" selected":""}>${x.name}</option>`).join("")}</select></div>
  <div class="fg"><label>أقل تشابه <output id="mv">${ex.min}%</output></label><input type="range" id="mn" min="0" max="95" value="${ex.min}"></div>
  <details class="fg wd"><summary>⚙️ أوزان المقارنة</summary>${PROPS.map(p=>`<label>${p.i} ${p.l} <output>${M.W[p.k]}%</output><input type="range" data-k="${p.k}" min="0" max="100" value="${M.W[p.k]}"></label>`).join("")}</details>
  ${tags(t)}</div>
  <div class="layout"><div class="cards" id="cl"></div><div class="mapbox" id="mw"></div></div>`;
 drawEx();
 $("#et").onchange=e=>{M.targetId=e.target.value;M.cmp=[];ex.sel=null;save();route()};
 $("#mn").oninput=e=>{ex.min=+e.target.value;$("#mv").textContent=ex.min+"%";drawEx()};
 $$(".wd input").forEach(r=>r.oninput=()=>{M.W[r.dataset.k]=+r.value;r.previousElementSibling.textContent=r.value+"%";save();drawEx()});
 v.onclick=e=>{
  const b=e.target.closest("[data-b]");
  if(b){M.targetId=TARGETS.find(x=>x.body===b.dataset.b).id;M.cmp=[];ex.sel=null;save();return route()}
  const a=e.target.closest("[data-a]");
  if(a){if(a.dataset.a==="cmp"){toggleCmp(a.dataset.id);drawEx()}else{fs=a.dataset.id;location.hash="#/field"}return}
  const c=e.target.closest(".card,.pin");
  if(c){ex.sel=ex.sel===c.dataset.id?null:c.dataset.id;drawEx()}
 };
}
function drawEx(){
 const R=ranked().filter(r=>r.score>=ex.min).slice(0,8);
 $("#mw").innerHTML=mapSVG(R,ex.sel);
 $("#cl").innerHTML=R.length?R.map((r,i)=>{const c=M.cmp.includes(r.id),vd=valOf(r.id);return `
 <article class="card${r.id===ex.sel?" sel":""}" data-id="${r.id}"><div class="rank">${i+1}</div>
  <div><h4>${r.name}${vd?`<span class="badge">متحقَّق ${vd}%</span>`:""}</h4><p class="reg">${r.region}</p>
   <div class="mini">${PROPS.map((p,j)=>`<div><span>${p.l}</span><i><u style="width:${r.sims[j]}%"></u></i><em>${r.sims[j]}%</em></div>`).join("")}</div>
   <div class="acts2"><button class="btn sm${c?" on":""}" data-a="cmp" data-id="${r.id}">⇄ ${c?"في المقارنة":"قارن"}</button><button class="btn sm" data-a="chk" data-id="${r.id}">📡 تحقق</button></div></div>
  ${ring(r.score)}</article>`}).join(""):empty("مفيش مواقع بالفلتر ده. قلّل «أقل تشابه».");
}

function compare(v){
 const R=ranked(),t=tgt(),it=M.cmp.map(id=>R.find(r=>r.id===id)).filter(Boolean),COL=["#ff6b3d","#38e0b8","#9db4e8"],mx=f=>Math.max(...it.map(f));
 v.innerHTML=`<div class="panel"><h3>اختار من 2 لـ 3 مواقع للمقارنة بالهدف: ${t.name}</h3>
  <div class="row">${R.map(r=>`<button class="btn sm${M.cmp.includes(r.id)?" on":""}" data-id="${r.id}">${r.name} · ${r.score}%</button>`).join("")}</div></div>
 ${it.length<2?empty("اختار موقعين على الأقل لبدء المقارنة"):`
 <div class="cols"><div class="panel"><h3>التشابه حسب الخاصية</h3>${PROPS.map((p,i)=>`<div class="grp"><b>${p.i} ${p.l}<small>الهدف ${t[p.k]}${p.u}</small></b>${it.map((r,j)=>`<div class="hb"><span>${r.name}</span><i><u style="width:${r.sims[i]}%;background:${COL[j]}"></u></i><em>${r.sims[i]}% · ${r[p.k]}${p.u}</em></div>`).join("")}</div>`).join("")}</div>
 <div class="panel"><h3>الجدول</h3><div class="tw"><table><thead><tr><th></th><th>الهدف</th>${it.map(r=>`<th>${r.name}</th>`).join("")}</tr></thead><tbody>
  <tr><th>التشابه</th><td>—</td>${it.map(r=>`<td class="${r.score===mx(x=>x.score)?"best":""}"><b>${r.score}%</b></td>`).join("")}</tr>
  ${PROPS.map((p,i)=>`<tr><th>${p.i} ${p.l}</th><td>${t[p.k]}${p.u}</td>${it.map(r=>`<td class="${r.sims[i]===mx(x=>x.sims[i])?"best":""}">${r[p.k]}${p.u} · ${r.sims[i]}%</td>`).join("")}</tr>`).join("")}
 </tbody></table></div><p class="mut">الخلية المميزة = الأقرب للهدف. الأفضل إجمالًا: <b>${it.find(r=>r.score===mx(x=>x.score)).name}</b></p></div></div>`}`;
 v.onclick=e=>{const b=e.target.closest("button[data-id]");if(b){toggleCmp(b.dataset.id);compare(v)}};
}

let fs=null;
function field(v){
 const R=ranked();if(!R.some(r=>r.id===fs))fs=R[0].id;
 const site=R.find(r=>r.id===fs),all=mine(),sr=all.filter(r=>r.site===fs),vs=R.filter(r=>all.some(x=>x.site===r.id));
 v.innerHTML=`<div class="panel filt"><div class="fg"><label>الموقع الأرضي</label><select id="fsel">${R.map(r=>`<option value="${r.id}"${r.id===fs?" selected":""}>${r.name} — ${r.score}%</option>`).join("")}</select></div>
  <button class="btn pri" id="sim">📡 استقبال قراءة (محاكاة MQTT)</button><button class="btn" id="clr">🗑 مسح القياسات</button></div>
 <div class="cols"><div class="panel"><h3>Analog Score مقابل Ground Validation Score</h3>${vs.length?vs.map(r=>{const g=valOf(r.id);return `<div class="vs"><b>${r.name}</b>
  <div class="hb"><span>المحسوب</span><i><u style="width:${r.score}%;background:var(--ac)"></u></i><em>${r.score}%</em></div>
  <div class="hb"><span>الميداني</span><i><u style="width:${g}%"></u></i><em>${g}%</em></div>
  <small class="${g>=80?"okc":"warn"}">${g>=80?"✔ VALIDATED_ANALOG_SITE":"⚠ يحتاج مراجعة"} · الفرق ${(g-r.score).toFixed(1)}</small></div>`}).join(""):empty("لسه مفيش قياسات للهدف ده","<br>اضغط «استقبال قراءة» للمحاكاة.")}</div>
 <div class="panel"><h3>قراءات ${site.name}</h3>${sr.length?`<div class="sparks">${[["soil","💧 رطوبة التربة","%"],["rad","☢ الإشعاع",""],["temp","🌡 حرارة السطح","°م"]].map(([k,l,u])=>`<div class="sp"><small>${l}</small><b>${sr[sr.length-1][k]}${u}</b>${spark(sr.map(x=>x[k]))}</div>`).join("")}</div>`:empty("مفيش قراءات للموقع ده")}</div></div>
 <div class="panel"><h3>سجل القياسات</h3>${all.length?`<div class="tw"><table><thead><tr><th>الوقت</th><th>الجهاز</th><th>الموقع</th><th>Validation</th><th>رطوبة</th><th>إشعاع</th><th>حرارة</th></tr></thead><tbody>${all.slice(-8).reverse().map(r=>`<tr><td>${fmt(r.ts)}</td><td>${esc(r.dev)}</td><td>${esc(EARTH.find(e=>e.id===r.site).name)}</td><td>${r.v}%</td><td>${r.soil}%</td><td>${r.rad}</td><td>${r.temp}°</td></tr>`).join("")}</tbody></table></div>`:empty("السجل فاضي")}</div>`;
 $("#fsel").onchange=e=>{fs=e.target.value;field(v)};
 $("#sim").onclick=()=>{mkReading(fs,"SIM");toast("وصلت قراءة جديدة");field(v)};
 $("#clr").onclick=()=>{readings=readings.filter(r=>r.mission!==M.targetId);sv("nz_readings",readings);field(v)};
}

function missions(v){
 v.innerHTML=`<div class="panel"><h3>حفظ المهمة الحالية</h3><div class="row"><input id="mn2" value="${esc(M.name)}" maxlength="50" aria-label="اسم المهمة"><button class="btn pri" id="ms">💾 حفظ</button><button class="btn" id="mx">⬇ تصدير JSON</button></div>
 <p class="mut">الهدف: ${tgt().name} · ${M.cmp.length} مواقع في المقارنة</p></div>
 <div class="panel"><h3>المهمات المحفوظة (${saved.length})</h3>${saved.length?`<div class="tw"><table><thead><tr><th>الاسم</th><th>الهدف</th><th>آخر حفظ</th><th></th></tr></thead><tbody>${saved.map((s,i)=>`<tr><td>${esc(s.name)}</td><td>${(TARGETS.find(t=>t.id===s.targetId)||{}).name||"—"}</td><td>${fmt(s.at)}</td><td><button class="btn sm" data-a="open" data-i="${i}">فتح</button> <button class="btn sm" data-a="del" data-i="${i}">حذف</button></td></tr>`).join("")}</tbody></table></div>`:empty("لسه مفيش مهمات محفوظة")}</div>`;
 $("#ms").onclick=()=>{
  M.name=$("#mn2").value.trim()||"مهمة بدون اسم";const s={...JSON.parse(JSON.stringify(M)),at:new Date().toISOString()},i=saved.findIndex(x=>x.id===M.id);
  if(i>=0)saved[i]=s;else saved.push(s);sv("nz_missions",saved);save();toast("💾 اتحفظت المهمة");route();
 };
 $("#mx").onclick=()=>dl("mission-"+M.id+".json",JSON.stringify({mission:M,top_analogs:ranked().slice(0,6),readings:mine()},null,2),"application/json");
 v.onclick=e=>{const a=e.target.closest("[data-a]");if(!a)return;const i=+a.dataset.i;
  if(a.dataset.a==="open"){M=JSON.parse(JSON.stringify(saved[i]));save();location.hash="#/explore"}
  else{saved.splice(i,1);sv("nz_missions",saved);missions(v)}};
}

let ct="mqtt";
function devicesView(v){
 const code=()=>{const s=ranked()[0],pl=JSON.stringify({rover_id:"EXO_ROVER_V1",site_id:s.id,timestamp:new Date().toISOString().slice(0,19)+"Z",ground_validation_score:93.8,sensor_readings:{soil_moisture:1.2,radiation:2.4,surface_temp:-15.5},status:"VALIDATED_ANALOG_SITE"},null,2);
  return ct==="mqtt"?`Topic: analog/${tgt().id}/<DEVICE_ID>/readings\nQoS:   1\n\n${pl}`:`POST /api/ingest\nAuthorization: Bearer YOUR_DEVICE_KEY\nContent-Type: application/json\n\n${pl}`};
 v.innerHTML=`<div class="cols"><div class="panel"><h3>تسجيل جهاز للمهمة</h3><p class="mut">مفتاح مستقل لكل جهاز. المفتاح بيربط القراءة بالمهمة، والجهاز مش بيبعت معرّف مستخدم.</p>
  <div class="row"><input id="dn" placeholder="اسم الجهاز (مثلاً ESP32-أتاكاما)" maxlength="40"><button class="btn pri" id="da">إنشاء مفتاح الجهاز</button></div></div>
 <div class="panel"><h3>عقد إرسال البيانات</h3><div class="seg"><button data-c="mqtt" class="${ct==="mqtt"?"on":""}">MQTT</button><button data-c="http" class="${ct==="http"?"on":""}">HTTP / JSON</button></div>
  <pre id="code">${esc(code())}</pre><button class="btn sm" id="cc">📋 نسخ</button>
  <p class="mut">الوحدات: الرطوبة % · الإشعاع بوحدة موحدة تتفقوا عليها · الحرارة °م · الوقت ISO 8601. الـ Backend لازم يتجاهل أي <code>timestamp</code> مكرر لنفس الجهاز.</p></div></div>
 <div class="panel"><h3>الأجهزة المسجلة (${DEV.length})</h3>${DEV.length?`<div class="tw"><table><thead><tr><th>الجهاز</th><th>المفتاح</th><th>أُنشئ</th><th>قراءات</th><th></th></tr></thead><tbody>${DEV.map((d,i)=>`<tr><td>${esc(d.name)}</td><td><code>dk_••••${d.key.slice(-4)}</code></td><td>${fmt(d.at)}</td><td>${readings.filter(r=>r.dev===d.name).length}</td><td><button class="btn sm" data-a="k" data-i="${i}">نسخ المفتاح</button> <button class="btn sm" data-a="s" data-i="${i}">محاكاة إرسال</button> <button class="btn sm" data-a="x" data-i="${i}">حذف</button></td></tr>`).join("")}</tbody></table></div>`:empty("مفيش أجهزة لسه")}
  <p class="mut">⚠ الاستقبال هنا محاكاة داخل المتصفح. الربط الفعلي محتاج Backend وMQTT Broker على نطاق يوصله الجهاز.</p></div>`;
 $("#da").onclick=()=>{const n=$("#dn").value.trim();if(!n)return toast("اكتب اسم الجهاز");
  DEV.push({name:n,key:"dk_"+uid()+uid()+uid(),at:new Date().toISOString()});sv("nz_devices",DEV);toast("🔑 اتعمل مفتاح الجهاز");devicesView(v)};
 $("#cc").onclick=()=>copy($("#code").textContent);
 v.onclick=e=>{
  const c=e.target.closest("[data-c]");if(c){ct=c.dataset.c;return devicesView(v)}
  const a=e.target.closest("[data-a]");if(!a)return;const d=DEV[+a.dataset.i];
  if(a.dataset.a==="k")copy(d.key);
  else if(a.dataset.a==="s"){mkReading(ranked()[0].id,d.name);toast("وصلت قراءة من "+d.name);devicesView(v)}
  else{DEV.splice(+a.dataset.i,1);sv("nz_devices",DEV);devicesView(v)}};
}

function sources(v){
 v.innerHTML=`<div class="panel"><h3>المنهجية</h3>
  <p>لكل موقع أرضي بنحسب تشابه كل خاصية: <code>100 × (1 − |Δ| ÷ المدى)</code>، وبعدين بنجمع الدرجات بأوزان المستخدم ونقسم على مجموع الأوزان. الأوزان الافتراضية: ارتفاع 35، ميل 30، جفاف 35.</p>
  <div class="tw"><table><thead><tr><th>العامل</th><th>المدى المستخدم في التطبيع</th><th>الوزن الافتراضي</th></tr></thead><tbody>${PROPS.map(p=>`<tr><td>${p.i} ${p.l}</td><td>0 — ${p.r} ${p.u}</td><td>${DEF_W[p.k]}</td></tr>`).join("")}</tbody></table></div></div>
 <div class="panel"><h3>الحدود</h3><ul><li>البيانات الحالية <b>عينات توضيحية للنموذج الأولي</b> وليست قياسات معتمدة من NASA.</li><li>الدرجة استكشافية، ومش اعتماد لصلاحية قاعدة أو موقع هبوط.</li><li>القراءات الميدانية والأجهزة هنا محاكاة لحد ما الـ Backend والـ MQTT يتوصلوا.</li><li>الإشعاع والإضاءة والموارد غير داخلة في الـ Score حاليًا.</li></ul></div>
 <div class="panel src"><h3>المصادر المقترحة للبيانات</h3><ul>
  <li>NASA Solar System Treks — <a href="https://trek.nasa.gov/" rel="noopener" target="_blank">trek.nasa.gov</a></li>
  <li>USGS · Known Terrestrial Analog Sites — <a href="https://www.usgs.gov/data/known-terrestrial-analog-sites-planetary-science" rel="noopener" target="_blank">usgs.gov/data/known-terrestrial-analog-sites-planetary-science</a></li>
  <li>USGS · PAAD — <a href="https://www.usgs.gov/data/paad-planetary-aeolian-analog-database" rel="noopener" target="_blank">usgs.gov/data/paad-planetary-aeolian-analog-database</a></li>
  <li>Open-Meteo (طقس وارتفاعات) — <a href="https://open-meteo.com/" rel="noopener" target="_blank">open-meteo.com</a></li></ul></div>`;
}

/* ================= الراوتر ================= */
const ROUTES={home:["غرفة المهمة","🛰️",home],explore:["استكشاف المواقع","🧭",explore],compare:["مختبر المقارنة","⚖️",compare],field:["القياسات الميدانية","📡",field],missions:["المهمات المحفوظة","📁",missions],devices:["الأجهزة والربط","🔌",devicesView],sources:["المنهجية والمصادر","📚",sources]};
function route(){
 const h=location.hash.replace(/^#\/?/,""),n=ROUTES[h]?h:"home",v=$("#view");
 $("#nav").innerHTML=Object.entries(ROUTES).map(([k,[l,i]])=>`<a href="#/${k}" class="${k===n?"on":""}"><span>${i}</span>${l}</a>`).join("");
 $("#vt").textContent=ROUTES[n][0];
 $("#mname").textContent=M.name+(saved.some(s=>s.id===M.id)?" · محفوظة":" · مسودة غير محفوظة");
 $("#side").classList.remove("open");
 v.classList.remove("in");void v.offsetWidth;v.classList.add("in");
 v.onclick=null;ROUTES[n][2](v);scrollTo(0,0);
}
addEventListener("hashchange",route);
$("#menu").onclick=()=>$("#side").classList.toggle("open");
$("#newm").onclick=()=>{M=newMission();save();toast("بدأنا مهمة جديدة");route()};
route();
