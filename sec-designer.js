/* Horizon: مصمم الشبابيك الحي (UPVC).
   رسم SVG بالمقاسات الفعلية: عرض/ارتفاع، تقسيم أعمدة، سوفاليس علوي، نوع فتح لكل خانة، نظام، لون، زجاج.
   "أضف للمقايسة" بيبعت البنود لنموذج عرض السعر (window.hzQuoteAdd في quote.js). */
(function(){
'use strict';
const $q=s=>document.querySelector(s);
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const OPEN={fix:['ثابت','▫'],hl:['مفصلي شمال','◁'],hr:['مفصلي يمين','▷'],tilt:['قلاب','▽'],tt:['مفصلي + قلاب','◇'],slide:['جرار','↔'],dl:['باب شمال','🚪◁'],dr:['باب يمين','🚪▷']};
const COLORS={white:['أبيض','#F4F4F2'],anth:['أنثراسيت','#3B4048'],oak:['بلوط ذهبي','#B07A3C'],gray:['رمادي','#8D9196'],black:['أسود','#1F2124']};
const COLW={white:'أبيض',anth:'أنثراسيت',oak:'بلوط ذهبي',gray:'رمادي',black:'أسود'};
const GLASS={'زجاج مفرد':'#CFE8F3','دبل جلاس':'#BFE0F0','سيكوريت':'#C6E6EE','عاكس':'#8FA6B3','ملون':'#C9B48A'};
const D={view:'2d',w:150,h:120,cols:2,cw:[75,75],tr:0,cells:{},sel:'0-0',sys:'',color:'white',glass:'دبل جلاس',msg:''};
let built=0;

const rows=()=>D.tr>0?2:1;
function getOpen(r,c){const k=r+'-'+c;if(D.cells[k])return D.cells[k];
 if(rows()>1&&r===0)return 'fix';return D.cols===1?'hr':c===0?'hl':(c===D.cols-1?'hr':'fix')}
function even(){const b=Math.floor(D.w/D.cols);D.cw=Array.from({length:D.cols},(_,i)=>i===D.cols-1?D.w-b*(D.cols-1):b)}
function rescale(old){if(!old||old<=0){even();return}const f=D.w/old;let s=0;D.cw=D.cw.map((x,i)=>{if(i===D.cols-1)return Math.max(10,D.w-s);const v=Math.max(10,Math.round(x*f));s+=v;return v})}
function clampAll(){D.w=Math.min(400,Math.max(30,Math.round(+D.w||150)));D.h=Math.min(300,Math.max(30,Math.round(+D.h||120)));if(D.tr>0)D.tr=Math.min(D.h-20,Math.max(20,Math.round(D.tr)))}

/* ---------- الرسم ---------- */
function symbol(o,x,y,w,h){const st='stroke="#1e3a8a" stroke-width="1" fill="none" stroke-dasharray="4 3"',mx=x+w/2,my=y+h/2;
 const hinge=side=>side==='l'?`<path ${st} d="M${x+w} ${y} L${x} ${my} L${x+w} ${y+h}"/>`:`<path ${st} d="M${x} ${y} L${x+w} ${my} L${x} ${y+h}"/>`;
 const hop=`<path ${st} d="M${x} ${y} L${mx} ${y+h} L${x+w} ${y}"/>`;
 const handle=side=>{const hx=side==='l'?x+w-7:x+7;return `<rect x="${hx-1.5}" y="${my-8}" width="3" height="16" rx="1.5" fill="#334155"/>`};
 if(o==='hl')return hinge('l')+handle('l');if(o==='hr')return hinge('r')+handle('r');
 if(o==='dl')return hinge('l')+handle('l')+`<rect x="${x+w-10}" y="${my-3}" width="6" height="6" fill="#334155"/>`;
 if(o==='dr')return hinge('r')+handle('r')+`<rect x="${x+4}" y="${my-3}" width="6" height="6" fill="#334155"/>`;
 if(o==='tilt')return hop+`<rect x="${mx-8}" y="${y+4}" width="16" height="3" rx="1.5" fill="#334155"/>`;
 if(o==='tt')return hinge('l')+hop+handle('l');
 if(o==='slide')return `<path d="M${x+w*.25} ${my} H${x+w*.75} M${x+w*.65} ${my-6} L${x+w*.75} ${my} L${x+w*.65} ${my+6}" stroke="#1e3a8a" stroke-width="1.6" fill="none"/>`;
 return ''}
function svg(){clampAll();const W=D.w,H=D.h,maxW=250,maxH=290,s=Math.min(maxW/W,maxH/H),fw=W*s,fh=H*s,ox=56,oy=30,f=Math.min(9,Math.max(5,s*6)),m=f*.7,
  col=COLORS[D.color][1],gl=GLASS[D.glass]||'#CFE8F3',R=rows(),vw=fw+ox+30,vh=fh+oy+52;
 let out=`<svg viewBox="0 0 ${vw} ${vh}" width="100%" style="max-height:360px" xmlns="http://www.w3.org/2000/svg"><rect x="${ox}" y="${oy}" width="${fw}" height="${fh}" rx="2" fill="${col}" stroke="#0f172a" stroke-width="1"/>`;
 const bx=[];let acc=0;D.cw.forEach(w=>{acc+=w;bx.push(ox+acc*s)});
 const ys=[oy+f,R>1?oy+D.tr*s-m/2:null,R>1?oy+D.tr*s+m/2:null,oy+fh-f];
 for(let r=0;r<R;r++){const y0=r===0?ys[0]:ys[2],y1=r===0?(R>1?ys[1]:ys[3]):ys[3],ch=y1-y0;
  for(let c=0;c<D.cols;c++){const x0=c===0?ox+f:bx[c-1]+m/2,x1=c===D.cols-1?ox+fw-f:bx[c]-m/2,cwid=x1-x0,k=r+'-'+c,o=getOpen(r,c),sel=D.sel===k,ins=3,xx=x0,yy=y0;
   out+=`<g data-wcell="${k}" style="cursor:pointer"><rect x="${xx}" y="${yy}" width="${cwid}" height="${ch}" fill="${col}" stroke="#0f172a" stroke-width=".6"/><rect x="${xx+ins}" y="${yy+ins}" width="${cwid-2*ins}" height="${ch-2*ins}" fill="${gl}" stroke="#334155" stroke-width=".8"/><path d="M${xx+ins+6} ${yy+ins+ch*.3} l${cwid*.25} -${ch*.18}" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>${symbol(o,xx+ins,yy+ins,cwid-2*ins,ch-2*ins)}`
   +(sel?`<rect x="${xx+1}" y="${yy+1}" width="${cwid-2}" height="${ch-2}" fill="rgba(15,118,110,.12)" stroke="#0F766E" stroke-width="2.5"/>`:'')+`</g>`}}
 /* خطوط الأبعاد */
 const dm=(x1,y1,x2,y2,t,v)=>`<g stroke="#475569" stroke-width="1" fill="none"><path d="M${x1} ${y1} L${x2} ${y2}"/>${v?`<path d="M${x1-4} ${y1} h8 M${x2-4} ${y2} h8"/>`:`<path d="M${x1} ${y1-4} v8 M${x2} ${y2-4} v8"/>`}</g>`+(v?`<text x="${x1-8}" y="${(y1+y2)/2}" font-size="11" text-anchor="middle" fill="#0f172a" transform="rotate(-90 ${x1-8} ${(y1+y2)/2})">${t}</text>`:`<text x="${(x1+x2)/2}" y="${y1+14}" font-size="11" text-anchor="middle" fill="#0f172a">${t}</text>`);
 out+=dm(ox,oy+fh+30,ox+fw,oy+fh+30,W,0)+dm(ox-26,oy,ox-26,oy+fh,H,1);
 if(D.cols>1){let a=ox;D.cw.forEach(w=>{out+=dm(a,oy+fh+12,a+w*s,oy+fh+12,w,0);a+=w*s})}
 if(D.tr>0)out+=dm(ox+fw+14,oy,ox+fw+14,oy+D.tr*s,D.tr,1).replace(/rotate\(-90/g,'rotate(90');
 return out+'</svg>'}

/* ---------- الواجهة ---------- */
function names(){const hz=window.hzSys;return hz?hz.get().map(x=>x.n):[]}
function panel(){const r=+D.sel.split('-')[0],c=+D.sel.split('-')[1],o=getOpen(r,c),R=rows(),area=(D.w*D.h/10000).toFixed(2);
 const sysOpts=['<option value="">أي نظام</option>'].concat(names().map(n=>`<option${D.sys===n?' selected':''}>${E(n)}</option>`)).join('');
 return `<div class="wd-svg">${D.view==='3d'?'<div id="wd3d"></div>':svg()}</div>
 <div class="wd-vt"><button type="button" data-wdb="v2d" class="${D.view==='3d'?'':'on'}">2D</button><button type="button" data-wdb="v3d" class="${D.view==='3d'?'on':''}">3D</button></div>
 ${D.view==='3d'&&D.cols*R>1?`<div class="wd-ch">${Array.from({length:R*D.cols},(_,n)=>{const rr=Math.floor(n/D.cols),cc=n%D.cols,k=rr+'-'+cc;return `<button type="button" data-wcell="${k}" class="${D.sel===k?'on':''}">${R>1?(rr===0?'علوية ':'سفلية '):''}خانة ${cc+1}</button>`}).join('')}</div>`:''}
 <div class="wd-row"><label>العرض (سم)<input type="number" inputmode="numeric" data-wd="w" value="${D.w}"></label><label>الارتفاع (سم)<input type="number" inputmode="numeric" data-wd="h" value="${D.h}"></label></div>
 <div class="wd-row"><div class="wd-st"><span>الأعمدة</span><button type="button" data-wdb="cols-">−</button><b>${D.cols}</b><button type="button" data-wdb="cols+">＋</button></div>
  <div class="wd-st"><span>سوفاليس علوي</span><button type="button" data-wdb="tr0" class="${D.tr?'':'on'}">لا</button><button type="button" data-wdb="tr1" class="${D.tr?'on':''}">أيوه</button></div></div>
 ${D.tr>0?`<div class="wd-row"><label>ارتفاع السوفاليس (سم)<input type="number" inputmode="numeric" data-wd="tr" value="${D.tr}"></label></div>`:''}
 ${D.cols>1?`<div class="wd-row">${D.cw.map((w,i)=>`<label>عمود ${i+1} (سم)<input type="number" inputmode="numeric" data-wdcw="${i}" value="${w}"></label>`).join('')}</div>`:''}
 <div class="wd-h">الخانة المختارة: ${R>1?(r===0?'علوية':'سفلية')+' · ':''}عمود ${c+1}</div>
 <div class="wd-op">${Object.keys(OPEN).map(k=>`<button type="button" data-wdo="${k}" class="${o===k?'on':''}"><i>${OPEN[k][1]}</i>${OPEN[k][0]}</button>`).join('')}</div>
 <div class="wd-h">النظام واللون والزجاج</div>
 <label class="wd-l">النظام<select data-wd="sys">${sysOpts}</select></label>
 <div class="wd-ch">${Object.keys(COLORS).map(k=>`<button type="button" data-wdcol="${k}" class="${D.color===k?'on':''}"><i style="background:${COLORS[k][1]}"></i>${COLORS[k][0]}</button>`).join('')}</div>
 <div class="wd-ch">${Object.keys(GLASS).map(k=>`<button type="button" data-wdg="${k}" class="${D.glass===k?'on':''}"><i style="background:${GLASS[k]}"></i>${k}</button>`).join('')}</div>
 <p class="wd-sum">${D.w}×${D.h} سم · ${area} م² · ${D.cols*R} ${D.cols*R>1?'خانات':'خانة'}</p><p class="msg">${E(D.msg)}</p>
 <div class="wd-act"><button type="button" class="btn" data-wdb="add">إضافة للمقايسة</button></div>`}
function p3d(){const k=kinds(),dr=k.some(x=>x==='dl'||x==='dr'),col=COLORS[D.color][1];
 if(dr)return ['door',{w:D.w,h:D.h,glass:'1',color:col}];
 return ['window',{w:D.w,h:D.h,sashes:Math.min(3,D.cols),open:k.includes('slide')?'slide':'hinge',color:col}]}
function load3d(){return (typeof hzLoad==='function'?hzLoad('sec-3d'):Promise.resolve()).then(()=>window.hz3d)}
function draw(){const b=$q('#wdBody');if(!b)return;b.innerHTML=panel();
 if(D.view==='3d'){const el=$q('#wd3d');if(el){const a=p3d();load3d().then(h=>{if(h&&h.mount&&D.view==='3d'&&$q('#wd3d')===el)h.mount(el,a[0],a[1])}).catch(()=>{el.innerHTML='<p class="msg" style="padding:30px;text-align:center">المعاينة 3D لسه ما اتحمّلتش.</p>'})}}
 else if(window.hz3d&&hz3d.unmount)hz3d.unmount()}

function css(){if($q('#wdCss'))return;const s=document.createElement('style');s.id='wdCss';s.textContent=`
#wdModal{position:fixed;inset:0;z-index:70;background:var(--bg);overflow:auto;padding:0 0 30px}
#wdModal .wd-top{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 16px;background:var(--bg);border-bottom:1px solid var(--line)}
#wdModal .wd-top b{font-size:16px}#wdModal .wd-top small{display:block;color:var(--mut);font-size:11.5px}
#wdBody{padding:10px 16px;display:grid;gap:10px}
#wdModal .wd-svg{background:#e5e7eb;border-radius:16px;padding:6px;min-height:200px;display:grid;place-items:center}[data-theme=dark] #wdModal .wd-svg{background:#1f2937}
#wdModal .wd-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}
#wdModal label{display:grid;gap:3px;font-size:12px;color:var(--mut)}
#wdModal input,#wdModal select{border:1px solid var(--line);border-radius:10px;padding:9px 10px;background:var(--card);color:var(--ink);width:100%;font:inherit}
#wdModal .wd-st{display:flex;align-items:center;gap:6px;border:1px solid var(--line);background:var(--card);border-radius:12px;padding:6px 8px}#wdModal .wd-st span{flex:1;font-size:12px;color:var(--mut)}
#wdModal .wd-st button{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:8px;min-width:32px;padding:4px 8px;font:inherit;font-weight:700;cursor:pointer}#wdModal .wd-st button.on{background:var(--p);color:#fff;border-color:var(--p)}
#wdModal .wd-h{font-weight:800;font-size:14px;margin-top:4px}
#wdModal .wd-op{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}#wdModal .wd-op button{display:grid;gap:2px;place-items:center;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:12px;padding:8px 2px;font:inherit;font-size:11px;font-weight:600;cursor:pointer}#wdModal .wd-op button i{font-style:normal;font-size:16px}#wdModal .wd-op button.on{border:2px solid var(--p);color:var(--p)}
#wdModal .wd-ch{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}#wdModal .wd-ch button{flex:none;display:flex;align-items:center;gap:6px;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:7px 12px;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer}#wdModal .wd-ch button.on{border:2px solid var(--p);color:var(--p)}#wdModal .wd-ch i{width:14px;height:14px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
#wdModal .wd-vt{display:flex;gap:8px;margin:-2px 0 2px}#wdModal .wd-vt button{flex:1;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:12px;padding:10px;font:inherit;font-weight:800;font-size:14px;cursor:pointer}#wdModal .wd-vt button.on{background:var(--p);border-color:var(--p);color:#fff}#wdModal .wd-svg #wd3d{width:100%}
#wdModal .wd-sum{margin:2px 0;font-weight:800}#wdModal .wd-act{display:flex;gap:8px}#wdModal .wd-act .btn{flex:1}`;document.head.appendChild(s)}

function open(pre){css();if(!built){built=1;document.body.insertAdjacentHTML('beforeend','<div id="wdModal" hidden><div class="wd-top"><div><b>🪟 مصمم الشبابيك</b><small>اضغط على أي خانة وغيّر نوع الفتح</small></div><button type="button" class="pill" data-wdb="close">✕ إغلاق</button></div><div id="wdBody"></div></div>')}
 if(pre&&pre.w){D.w=pre.w;D.h=pre.h}if(pre&&pre.sys!=null)D.sys=pre.sys;clampAll();even();D.cells={};D.sel='0-0';D.msg='';D.view='2d';
 $q('#wdModal').hidden=false;document.body.style.overflow='hidden';draw();
 if(window.hzSys&&!window.hzSys._d){window.hzSys._d=1;hzSys.load().then(draw)}}
function close(){const m=$q('#wdModal');if(m)m.hidden=true;document.body.style.overflow='';try{window.hz3d&&hz3d.unmount()}catch(_){}}

/* ---------- تحويل التصميم لبنود عرض سعر ---------- */
function kinds(){const a=[];for(let r=0;r<rows();r++)for(let c=0;c<D.cols;c++)a.push(getOpen(r,c));return a}
function mainName(){const k=kinds();if(k.includes('slide'))return 'شباك سحاب';if(k.some(x=>x==='dl'||x==='dr'))return k.some(x=>x==='fix'||x==='hl'||x==='hr')&&rows()===1&&D.cols>1?'باب بلكونة':'باب مفصلي';
 if(k.every(x=>x==='fix'))return 'فيكس';if(k.every(x=>x==='tilt'))return 'قلاب';return 'شباك مفصلي'}
function lines(){const nm=mainName(),area=+(D.w*D.h/10000).toFixed(2),R=rows(),k=[];
 for(let r=0;r<R;r++)for(let c=0;c<D.cols;c++)k.push((R>1?(r===0?'علوي ':'سفلي '):'')+'خانة '+(c+1)+': '+OPEN[getOpen(r,c)][0]);
 const note=`${D.w}×${D.h} سم · ${COLW[D.color]} · ${k.join('، ')}${D.sys?' · '+D.sys:''}`;
 return [{g:'sector',name:nm,note,area,sim:simSpec()},{g:'glass',name:D.glass,note:`${D.w}×${D.h} سم`,area,sim:null}]}
function simSpec(){const k=kinds(),t=k.includes('slide')?'sliding':k.every(x=>x==='fix')?'fixed':k.every(x=>x==='tilt')?'tilt':(D.cols>=2?'casement2':'casement1'),dr=k.some(x=>x==='dl'||x==='dr');
 return {kind:dr?'door':'window',type:dr?'hinged':t,color:D.color==='anth'?'anth':D.color==='black'?'black':D.color==='oak'?'oak':D.color==='gray'?'gray':'white',w:D.w,h:D.h,tint:D.glass==='عاكس'?'mirror':D.glass==='ملون'?'bronze':'clear'}}

document.addEventListener('click',e=>{const m=$q('#wdModal');if(!m||m.hidden||!m.contains(e.target))return;
 const cell=e.target.closest('[data-wcell]');if(cell){D.sel=cell.dataset.wcell;draw();return}
 const o=e.target.closest('[data-wdo]');if(o){const [r,c]=D.sel.split('-');D.cells[r+'-'+c]=o.dataset.wdo;draw();return}
 const col=e.target.closest('[data-wdcol]');if(col){D.color=col.dataset.wdcol;draw();return}
 const g=e.target.closest('[data-wdg]');if(g){D.glass=g.dataset.wdg;draw();return}
 const b=e.target.closest('[data-wdb]');if(!b)return;const k=b.dataset.wdb;
 if(k==='close')close();
 else if(k==='cols+'){if(D.cols<4){D.cols++;even();D.cells={};D.sel='0-0';draw()}}
 else if(k==='cols-'){if(D.cols>1){D.cols--;even();D.cells={};D.sel='0-0';draw()}}
 else if(k==='tr0'){D.tr=0;D.cells={};D.sel='0-0';draw()}
 else if(k==='tr1'){D.tr=D.tr||Math.round(D.h*.25);D.cells={};D.sel='1-0';draw()}
 else if(k==='v2d'){D.view='2d';draw()}
 else if(k==='v3d'){D.view='3d';draw()}
 else if(k==='add'){if(typeof user==='undefined'||!user){D.msg='سجّل دخول الأول عشان تضيف للمقايسة.';draw();if(typeof needLogin==='function')needLogin();return}
  if(!window.hzQuoteAdd){D.msg='نموذج عرض السعر لسه ما اتحمّلش.';draw();return}
  const l=lines(),sys=D.sys;close();window.hzQuoteAdd(l,sys)}});
document.addEventListener('change',e=>{const m=$q('#wdModal');if(!m||m.hidden||!m.contains(e.target))return;const t=e.target,d=t.dataset;
 if(d.wd==='w'){const old=D.w;D.w=+t.value;clampAll();rescale(old);draw()}
 else if(d.wd==='h'){D.h=+t.value;clampAll();draw()}
 else if(d.wd==='tr'){D.tr=+t.value;clampAll();draw()}
 else if(d.wd==='sys'){D.sys=t.value}
 else if(d.wdcw!=null){const i=+d.wdcw,v=Math.max(10,Math.round(+t.value||10)),j=i===D.cols-1?i-1:D.cols-1;const rest=D.cw.reduce((a,x,n)=>n===i||n===j?a:a+x,0),other=D.w-rest-v;
  if(other>=10){D.cw[i]=v;D.cw[j]=other}draw()}});
window.hzDesigner={open,close};
})();
