const CFG={url:'',key:''}; // À renseigner une fois : URL du script Google et clé d'accès (voir LISEZMOI.txt)
const LS=localStorage,$=s=>document.querySelector(s);
const H=(t,p={},...c)=>{const e=document.createElement(t);for(const k in p){if(k=='class')e.className=p[k];else if(k.startsWith('on'))e[k]=p[k];else e.setAttribute(k,p[k])}c.flat().forEach(x=>e.append(x));return e};
let recs=JSON.parse(LS.nc2||'[]'),set=JSON.parse(LS.nc2set||'{}'),cur=null,refs=[];
const dev=LS.nc2dev||(LS.nc2dev=Math.random().toString(36).slice(2,8));
const url=()=>set.url||CFG.url,key=()=>set.key||CFG.key;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)};
const show=v=>{['home','entry','list','cfg'].forEach(x=>$('#v-'+x).classList.toggle('hidden',x!=v));$('#snav').classList.toggle('hidden',v!='entry');scrollTo(0,0)};
function home(){$('#gD').classList.toggle('hidden',!LS.nc2draft);$('#nA').textContent=recs.filter(r=>r.type=='A').length;$('#nB').textContent=recs.filter(r=>r.type=='B').length;$('#nP').textContent=recs.filter(r=>!r.sync).length}
const persist=()=>{LS.nc2=JSON.stringify(recs);home()};
const GEO={Ad:{Vina:['Ngaoundéré'],'Djérem':['Tibati'],'Mbéré':['Meiganga'],'Mayo-Banyo':['Banyo'],'Faro-et-Déo':['Tignère']},N:{'Bénoué':['Garoua'],'Mayo-Louti':['Guider'],Faro:['Poli'],'Mayo-Rey':['Touboro']},EN:{'Diamaré':['Maroua'],'Mayo-Kani':['Kaélé'],'Mayo-Tsanaga':['Mokolo'],'Mayo-Danay':['Yagoua'],'Mayo-Sava':['Mora']}};
const RG={Ad:'Adamaoua',N:'Nord',EN:'Extrême-Nord'};
let hk=[],secs=[],si=0,gr=[],tmr;
const today=()=>new Date().toISOString().slice(0,10);
const nextNo=()=>dev.toUpperCase().slice(0,4)+'-'+String((+LS.nc2cnt||0)+1).padStart(3,'0');
const qvis=it=>{const c=it.c;if(!c)return true;const v=cur.data[c.q];if(c.min)return(v||[]).length>=c.min;if(c.has)return String(v||'').toLowerCase().includes(c.has);
 if(v==null||v===''||(Array.isArray(v)&&!v.length))return false;const a=[].concat(v);if(c.in)return a.some(x=>c.in.includes(x));const e=a.includes(c.v);return c.op=='='?e:!e};
const svis=it=>{const s=it.show;if(!s)return true;const v=[].concat(cur.data[s.q]||[]);return v.length?v.some(x=>s.any.includes(x)):s.empty};
const vis=()=>secs.map((s,i)=>i).filter(i=>svis(secs[i].it));
function nav(){secs.forEach(s=>s.el.classList.toggle('hidden',!svis(s.it)));prog()}
function prog(){const h=document.documentElement,m=h.scrollHeight-innerHeight,p=m>0?Math.min(100,Math.round(100*scrollY/m)):100;$('#pb').style.width=p+'%';$('#sinfo').textContent=p+' % parcouru'}
function upd(){hk.forEach(f=>f());refs.forEach(r=>r.el.classList.toggle('hidden',!qvis(r.it)));nav();clearTimeout(tmr);tmr=setTimeout(()=>LS.nc2draft=JSON.stringify(cur),400)}
function ctl(it){const d=cur.data,k=it.k;
 const inp=(t,f,ph)=>{const i=H('input',{type:t,inputmode:t=='number'?'decimal':'text'});i.value=d[k]||'';i.oninput=()=>d[k]=i.value;i.onchange=upd;return i};
 const opts=(o,get,put,single,max,name,from)=>{const L=[];const box=H('div',{class:'opts'},o.map(x=>{const c=H('input',{type:single?'radio':'checkbox',name});c.checked=single?get()==x:(get()||[]).includes(x);
  c.onchange=()=>{if(single)put(x);else{let a=get()||[];a=c.checked?[...a,x]:a.filter(y=>y!=x);if(max&&a.length>max){c.checked=false;toast('Maximum '+max+' choix');return}put(a)}upd()};const l=H('label',{class:'opt'},c,x);L.push([x,l,c]);return l}));
  if(from)hk.push(()=>{const s=[].concat(d[from]||[]);L.forEach(([x,l,c])=>l.classList.toggle('hidden',!s.includes(x)));if(d[k]&&!s.includes(d[k])){d[k]='';L.forEach(y=>y[2].checked=false)}});return box};
 const geo=(list,reset)=>{const w=H('div'),s=H('select'),o=H('input',{type:'text',placeholder:'Préciser'});let other=!!d[k]&&!list().includes(d[k]);
  gr.push(()=>other=false);
  hk.push(()=>{const L=list(),v=d[k]||'';s.innerHTML='';s.append(H('option',{value:''},'— Choisir —'),...L.map(x=>H('option',{value:x},x)),H('option',{value:'__o'},'Autre (préciser)'));
   s.value=L.includes(v)?v:(other||v)?'__o':'';o.classList.toggle('hidden',s.value!='__o');if(s.value=='__o'&&document.activeElement!=o)o.value=v});
  s.onchange=()=>{if(s.value=='__o'){other=true;d[k]=''}else{other=false;d[k]=s.value}upd()};o.oninput=()=>d[k]=o.value;w.append(s,o);return w};
 if(it.kind=='auto')return H('div',{class:'auto'},d[k]||'');
 if(it.kind=='date'){const i=H('input',{type:'date'});i.value=d[k]||'';i.onchange=()=>d[k]=i.value;return i}
 if(it.kind=='region'){const s=H('select',{},H('option',{value:''},'— Choisir —'),Object.keys(RG).map(x=>H('option',{value:x},RG[x])));s.value=d[k]||'';s.onchange=()=>{d[k]=s.value;d.q3='';d.q4='';gr.forEach(f=>f());upd()};return s}
 if(it.kind=='dep')return geo(()=>Object.keys(GEO[d.q6]||{}));
 if(it.kind=='com')return geo(()=>d.q3?(GEO[d.q6]||{})[d.q3]||[]:Object.values(GEO[d.q6]||{}).flat());
 if(it.kind=='short'){const i=inp('text');if(k=='q5'||k=='q12'){const id='dl'+k;i.setAttribute('list',id);return H('div',{},i,H('datalist',{id},[...new Set(recs.map(r=>r.data[k]).filter(Boolean))].map(x=>H('option',{value:x}))))}return i}
 if(it.kind=='num')return H('div',{class:'nu'},inp('number'),it.unit||'');
 if(it.kind=='open'){const t=H('textarea',{rows:it.long?5:3});t.value=d[k]||'';t.oninput=()=>d[k]=t.value;t.onchange=upd;return t}
 if(it.kind=='single')return opts(it.opts,()=>d[k],v=>d[k]=v,1,0,k,it.optsFrom);
 if(it.kind=='multi')return H('div',{},opts(it.opts,()=>d[k],v=>d[k]=v,0,it.max,k),H('p',{class:'note'},'Plusieurs réponses possibles'+(it.max?' ('+it.max+' au maximum)':'')));
 if(it.kind=='groups'){d[k]=d[k]||{};return H('div',{},it.groups.map((g,i)=>{const n=g.label||i;return H('div',{},H('div',{class:'gl'},g.label||''),g.opts?opts(g.opts,()=>d[k][n],v=>d[k][n]=v,0,0,k+i):(()=>{const x=H('input',{type:'text'});x.value=d[k][n]||'';x.oninput=()=>d[k][n]=x.value;return x})())}))}
 if(it.kind=='grid'){d[k]=d[k]||{};const T=[];const tb=H('table',{},H('tr',{},H('th'),it.cols.map(c=>H('th',{},c))),it.rows.map(r=>{d[k][r]=d[k][r]||{};const tr=H('tr',{},H('td',{},r),it.cols.map(c=>{const i=H('input',{type:'text'});i.value=d[k][r][c]||'';i.oninput=()=>d[k][r][c]=i.value;return H('td',{},i)}));T.push([r,tr]);return tr}));
  if(it.rowsFrom)hk.push(()=>{const s=[].concat(d[it.rowsFrom]||[]);T.forEach(([r,tr])=>tr.classList.toggle('hidden',!s.includes(r)))});
  return H('div',{class:'gw'},tb,(it.notes||[]).map(n=>H('p',{class:'note'},n)))}
}
function start(type,rec,draft){const last=recs[recs.length-1];
 if(rec)cur=JSON.parse(JSON.stringify(rec));else{cur={id:(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2)),type,dev,enq:set.enq||'',cre:new Date().toISOString(),data:{q1:nextNo(),q2:today()}};
  if(last)['q6','q3','q4','q5','q6b'].forEach(k=>{if(last.data[k]!=null)cur.data[k]=last.data[k]})}
 $('#ft').textContent=(rec&&!draft?'Modifier — ':'Fiche — ')+(cur.type=='A'?'Producteurs / vendeurs':'Consommateurs');
 const box=$('#form');box.innerHTML='';refs=[];hk=[];secs=[];gr=[];si=0;let w=box;
 Q[cur.type].forEach(it=>{if(it.s){w=H('div',{class:'sec hidden'},H('h3',{},it.s),it.notes.map(n=>H('p',{class:'note'},n)));box.append(w);secs.push({el:w,it})}
  else{const el=H('div',{class:'q'},H('label',{class:'ql'},it.n+'. '+it.t),it.note?H('p',{class:'note'},it.note):'',ctl(it));w.append(el);refs.push({el,it})}});
 upd();show('entry')}
function trySave(){if(!cur.data.q6||!cur.data.q4){scrollTo(0,0);return toast('Choisis la région et la commune')}save()}
function save(){if(cur.data.q6c&&cur.data.q6c!='Oui'&&!confirm('Consentement non confirmé. Enregistrer quand même ?'))return;
 cur.mod=new Date().toISOString();cur.enq=set.enq||cur.enq;cur.sync=0;const i=recs.findIndex(r=>r.id==cur.id);if(i<0){recs.push(cur);LS.nc2cnt=(+LS.nc2cnt||0)+1}else recs[i]=cur;
 delete LS.nc2draft;persist();show('home');toast('Fiche enregistrée');sync()}
function flat(r){const o={type:r.type,enqueteur:r.enq,appareil:r.dev,cree:r.cre,modifie:r.mod};
 Q[r.type].filter(i=>!i.s).forEach(it=>{const v=r.data[it.k],K='Q'+it.n;if(v==null)return;
  if(typeof v=='string')o[K]=v;else if(Array.isArray(v))o[K]=v.join(' ; ');
  else for(const a in v){const w=v[a];if(typeof w=='string')o[K+'|'+a]=w;else if(Array.isArray(w))o[K+'|'+a]=w.join(' ; ');else for(const b in w)o[K+'|'+a+'|'+b]=w[b]}});return o}
async function sync(manual){const p=recs.filter(r=>!r.sync);if(!p.length){if(manual)toast('Tout est déjà synchronisé');return}
 if(!url()){if(manual)toast('Serveur non configuré (Réglages)');return}
 try{const res=await fetch(url(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({key:key(),records:p.map(r=>({id:r.id,type:r.type,flat:flat(r)}))})});const j=await res.json();
  if(j.ok){p.forEach(r=>r.sync=1);persist();toast(p.length+' fiche(s) envoyée(s) au serveur')}else toast('Refusé par le serveur : '+j.error)}
 catch(e){if(manual)toast('Pas de connexion : fiches gardées sur l\'appareil')}}
async function outFile(name,blob){const C=window.Capacitor;
 if(C&&C.isNativePlatform&&C.isNativePlatform()){try{
  const b64=await new Promise((ok,ko)=>{const r=new FileReader();r.onload=()=>ok(r.result.split(',')[1]);r.onerror=ko;r.readAsDataURL(blob)});
  const f=await C.Plugins.Filesystem.writeFile({path:name,data:b64,directory:'CACHE'});
  await C.Plugins.Share.share({title:name,url:f.uri,dialogTitle:'Enregistrer ou envoyer le fichier'})}catch(e){toast('Export impossible : '+(e.message||e))}return}
 H('a',{href:URL.createObjectURL(blob),download:name}).click()}
function csv(){if(!recs.length)return toast('Aucune fiche');const rows=recs.map(r=>({id:r.id,...flat(r)})),cols=[...new Set(rows.flatMap(Object.keys))],q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
 const t='\ufeff'+[cols.map(q).join(','),...rows.map(r=>cols.map(c=>q(r[c])).join(','))].join('\r\n');
 outFile('NyiriiCollect_'+new Date().toISOString().slice(0,10)+'.csv',new Blob([t],{type:'text/csv'}))}
function xlsx(){if(!recs.length)return toast('Aucune fiche');if(!window.XLSX)return toast('Bibliothèque Excel indisponible');const wb=XLSX.utils.book_new();
 ['A','B'].forEach(t=>{const rows=recs.filter(r=>r.type==t).map(r=>({id:r.id,...flat(r)}));if(!rows.length)return;const cols=[...new Set(rows.flatMap(Object.keys))];XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([cols,...rows.map(r=>cols.map(c=>r[c]??''))]),t)});
 outFile('NyiriiCollect_'+new Date().toISOString().slice(0,10)+'.xlsx',new Blob([XLSX.write(wb,{bookType:'xlsx',type:'array'})],{type:'application/octet-stream'}))}
function list(f){const b=$('#rows');b.innerHTML='';recs.filter(r=>!f||r.type==f).sort((a,c)=>(c.mod||'').localeCompare(a.mod||'')).forEach(r=>b.append(H('div',{class:'row'},H('div',{},H('b',{},r.type+' · '+(r.data.q1||'sans n°')),H('div',{class:'muted'},[r.data.q4,(r.mod||'').slice(0,10),r.sync?'✓ synchronisée':'⏳ à synchroniser'].filter(Boolean).join(' · '))),H('div',{class:'acts'},H('button',{class:'bt sm',onclick:()=>start(r.type,r)},'Modifier'),H('button',{class:'bt sm dg',onclick:()=>{if(confirm('Supprimer cette fiche de cet appareil ? Elle reste sur le serveur si elle a été synchronisée.')){recs=recs.filter(x=>x.id!=r.id);persist();list(f)}}},'Suppr.')))));show('list')}
$('#gA').onclick=()=>start('A');$('#gB').onclick=()=>start('B');$('#gL').onclick=()=>list();$('#gS').onclick=()=>sync(1);$('#gX').onclick=()=>$('#expc').classList.toggle('hidden');$('#xC').onclick=csv;$('#xX').onclick=xlsx;
$('#fl0').onclick=()=>list();$('#flA').onclick=()=>list('A');$('#flB').onclick=()=>list('B');$('#lback').onclick=()=>show('home');
$('#gC').onclick=()=>{$('#cE').value=set.enq||'';$('#cU').value=set.url||CFG.url;$('#cK').value=set.key||CFG.key;show('cfg')};$('#cb').onclick=()=>show('home');
$('#cs').onclick=()=>{set={enq:$('#cE').value.trim(),url:$('#cU').value.trim(),key:$('#cK').value.trim()};LS.nc2set=JSON.stringify(set);show('home');toast('Réglages enregistrés')};
$('#bcan').onclick=()=>{if(confirm('Quitter ? Le brouillon est gardé, vous pourrez le reprendre.'))show('home')};$('#snext').onclick=trySave;$('#gD').onclick=()=>{try{start(null,JSON.parse(LS.nc2draft),1)}catch(e){delete LS.nc2draft;home()}};
$('#bth').onclick=()=>{const h=document.documentElement;h.dataset.theme=h.dataset.theme=='dark'?'light':'dark'};
addEventListener('online',()=>sync());addEventListener('scroll',prog,{passive:true});try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}home();sync();
if('serviceWorker' in navigator&&location.hostname!='localhost')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
