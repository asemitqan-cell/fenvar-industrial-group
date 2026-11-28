/* أفق: مصممين إضافيين بالرسم (أبواب، شتر، دولاب، غرفة نوم، قطعة موبيليا)
   مستقل عن sec-designer.js (مصمم الشبابيك). بيدّي بنود جاهزة لعرض السعر.
   الاستخدام: hzDesign2.open('door'|'shutter'|'wardrobe'|'bedroom'|'piece'[, {onDone}]) */
(function(){'use strict';
if(window.hzDesign2)return;
const $q=s=>document.querySelector(s);
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const COL={white:['أبيض','#F4F6F8'],anth:['أنثراسيت','#3C4249'],brown:['بني','#7B4B26'],oak:['سنديان','#B98B55'],black:['أسود','#1D2125'],beige:['بيج','#D9C9A3']};
const COLO=Object.keys(COL).map(k=>[k,COL[k][0]]);
const EXEC=[['commission','عمولة (نجارين)'],['finished','جاهزة من معرض'],['white','نجارة أبيض']];
const fit=(W,H,mw,mh)=>{const s=Math.min(mw/W,mh/H);return{w:W*s,h:H*s,s}};
const DEFS='<defs><linearGradient id="dg2g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DCEEF7"/><stop offset="1" stop-color="#9CC7DB"/></linearGradient><linearGradient id="dg2m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4FAFD"/><stop offset=".5" stop-color="#C8DDE8"/><stop offset="1" stop-color="#EAF3F8"/></linearGradient></defs>';
const SVG=(b,w,h)=>`<svg viewBox="0 0 ${w||320} ${h||330}" role="img" aria-label="preview">${DEFS}${b}</svg>`;
const dim=(x,y,t)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="12" fill="#64748B" font-family="inherit">${t}</text>`;
const st='#0F172A';
const lc=c=>COL[c]?COL[c][1]:'#F4F6F8';
const dk=c=>c==='white'||c==='beige'||c==='oak'?'#94A3B8':'#0F172A';

/* ---------- رسم الأبواب ---------- */
function leaf(x,y,w,h,panel,c,hand){const lw=Math.max(5,w*.1),col=lc(c);let o=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${col}" stroke="${dk(c)}" stroke-width="1.5"/>`;
 const ix=x+lw,iy=y+lw,iw=w-2*lw,ih=h-2*lw;
 if(panel==='glass')o+=`<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="url(#dg2g)" stroke="${dk(c)}"/><path d="M${ix+iw*.2} ${iy+ih*.9}L${ix+iw*.6} ${iy+ih*.1}" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>`;
 else if(panel==='half'){const gh=ih*.58;o+=`<rect x="${ix}" y="${iy}" width="${iw}" height="${gh}" fill="url(#dg2g)" stroke="${dk(c)}"/><rect x="${ix}" y="${iy+gh+lw*.6}" width="${iw}" height="${ih-gh-lw*.6}" fill="${col}" stroke="${dk(c)}"/>`}
 else{const gh=(ih-lw*.8)/2;o+=`<rect x="${ix}" y="${iy}" width="${iw}" height="${gh}" fill="${col}" stroke="${dk(c)}" stroke-opacity=".6"/><rect x="${ix}" y="${iy+gh+lw*.8}" width="${iw}" height="${gh}" fill="${col}" stroke="${dk(c)}" stroke-opacity=".6"/>`}
 const hx=hand==='L'?x+lw*.35:x+w-lw*.35-5;o+=`<rect x="${hx}" y="${y+h*.5}" width="5" height="${Math.min(46,h*.16)}" rx="2.5" fill="#64748B"/>`;return o}
function drawDoor(p){const m=fit(p.w,p.h,230,285),x=(320-m.w)/2,y=18,fr=Math.max(6,m.w*.05),c=p.col;
 let o=`<rect x="${x}" y="${y}" width="${m.w}" height="${m.h}" fill="${lc(c)}" stroke="${dk(c)}" stroke-width="2"/>`;
 const ix=x+fr,iy=y+fr,iw=m.w-2*fr,ih=m.h-2*fr;
 if(p.type==='single')o+=leaf(ix,iy,iw,ih,p.panel,c,p.hand);
 else if(p.type==='double'){const w2=iw/2;o+=leaf(ix,iy,w2-1,ih,p.panel,c,'R')+leaf(ix+w2+1,iy,w2-1,ih,p.panel,c,'L')}
 else if(p.type==='sliding'){const w2=iw*.55;o+=leaf(ix,iy,w2,ih,p.panel,c,'R')+leaf(ix+iw-w2,iy,w2,ih,p.panel,c,'L')+`<path d="M${x+m.w/2-18} ${y+m.h+10}h36m-6 -5l6 5-6 5m-24 -10l-6 5 6 5" stroke="#64748B" fill="none" stroke-width="1.5"/>`}
 else{const fw=iw*.33;o+=leaf(ix,iy,iw-fw-1,ih,p.panel,c,p.hand)+`<rect x="${ix+iw-fw}" y="${iy}" width="${fw}" height="${ih}" fill="url(#dg2g)" stroke="${dk(c)}"/>`}
 o+=dim(160,y+m.h+(p.type==='sliding'?34:24),p.w+' سم')+`<text x="${x+m.w+14}" y="${y+m.h/2}" font-size="12" fill="#64748B" text-anchor="middle" transform="rotate(90 ${x+m.w+14} ${y+m.h/2})">${p.h} سم</text>`;
 return SVG(o)}

/* ---------- رسم الشتر ---------- */
function drawShutter(p){const m=fit(p.w,p.h,240,280),x=(320-m.w)/2,y=18,c=p.col,col=lc(c),boxH=Math.max(26,m.h*.13),rail=8;
 let o=`<rect x="${x-rail}" y="${y}" width="${rail}" height="${m.h}" fill="#CBD5E1"/><rect x="${x+m.w}" y="${y}" width="${rail}" height="${m.h}" fill="#CBD5E1"/>`;
 const sh=m.h-boxH,n=Math.max(8,Math.round(sh/7));
 for(let i=0;i<n;i++){const yy=y+boxH+i*sh/n;o+=`<rect x="${x}" y="${yy}" width="${m.w}" height="${sh/n+.6}" fill="${col}" stroke="${dk(c)}" stroke-opacity=".55" stroke-width=".8"/>`;if(p.vent&&i%3===1){for(let j=1;j<8;j++)o+=`<rect x="${x+j*m.w/8-4}" y="${yy+sh/n*.35}" width="8" height="${sh/n*.3}" rx="1" fill="#0F172A" fill-opacity=".35"/>`}}
 o+=`<rect x="${x-rail}" y="${y}" width="${m.w+2*rail}" height="${boxH}" rx="8" fill="${col}" stroke="${dk(c)}" stroke-width="1.5"/><rect x="${x}" y="${y+m.h-6}" width="${m.w}" height="6" fill="#475569"/>`;
 if(p.motor)o+=`<circle cx="${x+m.w-14}" cy="${y+boxH/2}" r="8" fill="#0F766E"/><text x="${x+m.w-14}" y="${y+boxH/2+4}" font-size="10" fill="#fff" text-anchor="middle" font-weight="700">M</text>`;
 o+=dim(160,y+m.h+24,p.w+' سم')+`<text x="${x+m.w+rail+14}" y="${y+m.h/2}" font-size="12" fill="#64748B" text-anchor="middle" transform="rotate(90 ${x+m.w+rail+14} ${y+m.h/2})">${p.h} سم</text>`;
 return SVG(o)}

/* ---------- رسم الدولاب ---------- */
function wardrobeShapes(x,y,W,H,s,p,ox){const c=p.col,col=lc(c),n=p.doors,w=W*s,h=H*s,pl=Math.max(6,h*.04),dh=p.drawers?Math.min(h*.14,(h-pl)*.16):0;
 let o=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" stroke="${dk(c)}" stroke-width="1.6"/>`;
 const bh=h-pl-dh*p.drawers,dw=w/n;
 for(let i=0;i<n;i++){const xx=x+i*dw,mir=p.mirror&&i===n-1;
  o+=`<rect x="${xx+1}" y="${y+1}" width="${dw-2}" height="${bh-2}" fill="${mir?'url(#dg2m)':col}" stroke="${dk(c)}" stroke-opacity=".7"/>`;
  if(p.kind==='sliding'){if(i%2)o+=`<rect x="${xx+1}" y="${y+1}" width="${dw-2}" height="${bh-2}" fill="#000" fill-opacity=".05"/>`;o+=`<rect x="${xx+dw/2-2}" y="${y+bh*.4}" width="4" height="${bh*.2}" rx="2" fill="#64748B"/>`}
  else{const left=i%2===0;o+=`<rect x="${left?xx+dw-9:xx+5}" y="${y+bh*.45}" width="4" height="${Math.min(46,bh*.12)}" rx="2" fill="#64748B"/>`}}
 for(let d=0;d<p.drawers;d++){const yy=y+bh+d*dh;o+=`<rect x="${x+1}" y="${yy}" width="${w-2}" height="${dh-1}" fill="${col}" stroke="${dk(c)}" stroke-opacity=".7"/><rect x="${x+w/2-14}" y="${yy+dh/2-2}" width="28" height="4" rx="2" fill="#64748B"/>`}
 o+=`<rect x="${x+4}" y="${y+h-pl}" width="${w-8}" height="${pl}" fill="#0F172A" fill-opacity=".55"/>`;return o}
function drawWardrobe(p){const m=fit(p.w,p.h,285,260),x=(320-m.w)/2,y=14;let o=wardrobeShapes(x,y,p.w,p.h,m.s,p);
 o+=dim(160,y+m.h+22,p.w+' سم')+`<text x="${x+m.w+14}" y="${y+m.h/2}" font-size="12" fill="#64748B" text-anchor="middle" transform="rotate(90 ${x+m.w+14} ${y+m.h/2})">${p.h} سم</text>`+dim(160,y+m.h+40,'العمق '+p.d+' سم');return SVG(o)}

/* ---------- رسم غرفة النوم ---------- */
function drawBedroom(p){const parts=[];const GAP=12;
 const items=[];if(p.wardrobe)items.push({t:'w',w:p.ww,h:p.wh});items.push({t:'n',w:42,h:52});items.push({t:'b',w:p.bed+12,h:p.hb});items.push({t:'n',w:42,h:52});if(p.dresser)items.push({t:'d',w:100,h:150});
 const tot=items.reduce((n,i)=>n+i.w,0)+GAP*(items.length-1),mh=Math.max(...items.map(i=>i.h)),s=Math.min(300/tot,235/mh);
 const VH=Math.round(mh*s)+64;let x=(320-tot*s)/2,base=VH-44,o='',col=lc(p.col),c=p.col;
 items.forEach(i=>{const w=i.w*s,h=i.h*s,y=base-h;
  if(i.t==='w'){o+=wardrobeShapes(x,y,i.w,i.h,s,{col:p.col,doors:p.wdoors,kind:'hinged',drawers:0,mirror:false})}
  else if(i.t==='n'){o+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${col}" stroke="${dk(c)}" stroke-width="1.5"/><rect x="${x+3}" y="${y+h*.1}" width="${w-6}" height="${h*.34}" fill="${col}" stroke="${dk(c)}" stroke-opacity=".7"/><rect x="${x+w/2-6}" y="${y+h*.25}" width="12" height="3" rx="1.5" fill="#64748B"/><rect x="${x+3}" y="${y+h*.5}" width="${w-6}" height="${h*.34}" fill="${col}" stroke="${dk(c)}" stroke-opacity=".7"/><rect x="${x+w/2-6}" y="${y+h*.65}" width="12" height="3" rx="1.5" fill="#64748B"/>`}
  else if(i.t==='b'){const hbH=i.h*s,baseH=40*s,mw=w;
   o+=`<rect x="${x}" y="${y}" width="${mw}" height="${hbH}" rx="${p.style==='classic'?hbH*.12:3}" fill="${col}" stroke="${dk(c)}" stroke-width="1.5"/>`;
   if(p.style==='classic'){for(let k=1;k<4;k++)o+=`<rect x="${x+k*mw/4-10}" y="${y+hbH*.15}" width="20" height="${hbH*.5}" rx="6" fill="${col}" stroke="${dk(c)}" stroke-opacity=".6"/>`}
   else o+=`<rect x="${x+mw*.06}" y="${y+hbH*.12}" width="${mw*.88}" height="${hbH*.42}" fill="#000" fill-opacity=".07" stroke="${dk(c)}" stroke-opacity=".4"/>`;
   o+=`<rect x="${x+mw*.04}" y="${base-baseH-22*s}" width="${mw*.92}" height="${22*s+3}" rx="${6*s}" fill="#F8FAFC" stroke="#94A3B8"/><rect x="${x+mw*.04}" y="${base-baseH+1}" width="${mw*.92}" height="${baseH-1}" fill="${col}" stroke="${dk(c)}" stroke-width="1.2"/>`}
  else{o+=`<rect x="${x}" y="${y+h*.5}" width="${w}" height="${h*.5}" fill="${col}" stroke="${dk(c)}" stroke-width="1.5"/><rect x="${x+w*.08}" y="${y}" width="${w*.84}" height="${h*.44}" rx="4" fill="url(#dg2m)" stroke="${dk(c)}"/><rect x="${x+w/2-8}" y="${y+h*.72}" width="16" height="3" rx="1.5" fill="#64748B"/>`}
  x+=w+GAP*s});
 o+=`<rect x="10" y="${base}" width="300" height="2" fill="#CBD5E1"/>`+dim(160,base+22,'سرير '+p.bed+' سم');return SVG(o,320,VH)}

/* ---------- قطعة موبيليا ---------- */
const PIECES=[['dining','سفرة','غرفة سفرة','table'],['corner','ركنة / أنتريه','ركنة / أنتريه','sofa'],['living','غرفة معيشة','غرفة معيشة','sofa'],['table','ترابيزة','ترابيزة','table'],['desk','مكتب','مكتب','desk'],['dressing','تسريحة','تسريحة','dresser']];
function drawPiece(p){const sh=(PIECES.find(x=>x[0]===p.piece)||PIECES[0])[3],m=fit(p.w,p.h,270,170),x=(320-m.w)/2,y=40,c=p.col,col=lc(c),str=dk(c);let o='';
 if(sh==='table'){o+=`<rect x="${x}" y="${y}" width="${m.w}" height="${m.h*.1}" rx="3" fill="${col}" stroke="${str}" stroke-width="1.5"/>`;[x+m.w*.06,x+m.w*.94-8].forEach(lx=>o+=`<rect x="${lx}" y="${y+m.h*.1}" width="8" height="${m.h*.9}" fill="${col}" stroke="${str}"/>`)}
 else if(sh==='sofa'){o+=`<rect x="${x+m.w*.08}" y="${y}" width="${m.w*.84}" height="${m.h*.5}" rx="10" fill="${col}" stroke="${str}" stroke-width="1.5"/><rect x="${x}" y="${y+m.h*.3}" width="${m.w*.12}" height="${m.h*.55}" rx="8" fill="${col}" stroke="${str}"/><rect x="${x+m.w*.88}" y="${y+m.h*.3}" width="${m.w*.12}" height="${m.h*.55}" rx="8" fill="${col}" stroke="${str}"/><rect x="${x+m.w*.1}" y="${y+m.h*.42}" width="${m.w*.8}" height="${m.h*.38}" rx="8" fill="${col}" stroke="${str}"/>`;for(let i=1;i<3;i++)o+=`<path d="M${x+m.w*.1+i*m.w*.8/3} ${y+m.h*.45}V${y+m.h*.78}" stroke="${str}" stroke-opacity=".5"/>`}
 else if(sh==='desk'){o+=`<rect x="${x}" y="${y}" width="${m.w}" height="${m.h*.1}" rx="3" fill="${col}" stroke="${str}" stroke-width="1.5"/><rect x="${x+m.w*.66}" y="${y+m.h*.1}" width="${m.w*.3}" height="${m.h*.9}" fill="${col}" stroke="${str}"/>`;for(let i=0;i<3;i++)o+=`<rect x="${x+m.w*.69}" y="${y+m.h*.14+i*m.h*.28}" width="${m.w*.24}" height="${m.h*.24}" fill="${col}" stroke="${str}" stroke-opacity=".7"/>`;o+=`<rect x="${x+m.w*.06}" y="${y+m.h*.1}" width="8" height="${m.h*.9}" fill="${col}" stroke="${str}"/>`}
 else{o+=`<rect x="${x}" y="${y}" width="${m.w}" height="${m.h*.7}" rx="3" fill="${col}" stroke="${str}" stroke-width="1.5"/><rect x="${x+m.w*.3}" y="${y-m.h*.45}" width="${m.w*.4}" height="${m.h*.42}" rx="6" fill="url(#dg2m)" stroke="${str}"/>`;for(let i=0;i<3;i++)o+=`<rect x="${x+m.w*.05}" y="${y+m.h*.06+i*m.h*.21}" width="${m.w*.9}" height="${m.h*.18}" fill="${col}" stroke="${str}" stroke-opacity=".7"/>`;[x+4,x+m.w-12].forEach(lx=>o+=`<rect x="${lx}" y="${y+m.h*.7}" width="8" height="${m.h*.3}" fill="${col}" stroke="${str}"/>`)}
 o+=dim(160,y+m.h+26,'العرض '+p.w+' سم · العمق '+p.d+' سم · الارتفاع '+p.h+' سم');return SVG(o,320,260)}

/* ---------- تعريف المصممين ---------- */
const N=(k,l,min,max,def,step)=>({k,l,t:'num',min,max,def,step:step||5}),S=(k,l,o,def)=>({k,l,t:'sel',o,def:def!==undefined?def:o[0][0]}),C=(k,l,def)=>({k,l,t:'col',def:def||'white'}),K=(k,l,def)=>({k,l,t:'chk',def:!!def});
const PAN=[['glass','زجاج كامل'],['half','نص زجاج'],['solid','بانيل صلب']];
const KINDS={
 door:{sec:'upvc',ico:'door',ar:'مصمم الأبواب',draw:drawDoor,f:[S('type','نوع الباب',[['single','ضلفة واحدة'],['double','ضلفتين'],['sliding','سحاب'],['balcony','بلكونة (ضلفة + فيكس)']]),N('w','العرض (سم)',60,320,90),N('h','الارتفاع (سم)',180,280,210),S('panel','الشكل',PAN),S('hand','اتجاه المقبض',[['R','يمين'],['L','شمال']]),C('col','اللون'),N('qty','العدد',1,50,1,1)],
  lines:p=>{const nm=p.type==='balcony'||p.type==='sliding'?'باب بلكونة':'باب مفصلي',a=+(p.w*p.h/10000*p.qty).toFixed(2),tn={single:'ضلفة واحدة',double:'ضلفتين',sliding:'سحاب',balcony:'بلكونة + فيكس'}[p.type],pn=PAN.find(x=>x[0]===p.panel)[1];
   return [{g:'sector',name:nm,area:a,qty:p.qty,note:`باب ${tn} ${p.w}×${p.h} سم · ${pn} · ${COL[p.col][0]} · العدد ${p.qty}`}]}},
 shutter:{sec:'upvc',ico:'shutter',ar:'مصمم الشتر',draw:drawShutter,f:[N('w','العرض (سم)',60,500,150),N('h','الارتفاع (سم)',60,400,150),C('col','لون الشرائح'),K('motor','موتور كهربائي'),K('vent','فتحات تهوية'),N('qty','العدد',1,50,1,1)],
  lines:p=>[{g:'sector',name:'شتر UPVC',area:+(p.w*p.h/10000*p.qty).toFixed(2),qty:p.qty,note:`شتر ${p.w}×${p.h} سم · ${COL[p.col][0]}${p.motor?' · بموتور':' · يدوي'}${p.vent?' · بتهوية':''} · العدد ${p.qty}`}]},
 wardrobe:{sec:'furniture',ico:'ward',ar:'مصمم الدولاب',draw:drawWardrobe,f:[S('kind','نوع الفتح',[['hinged','ضلف مفصلي'],['sliding','سحاب']]),N('w','العرض (سم)',60,600,240),N('h','الارتفاع (سم)',150,300,240),N('d','العمق (سم)',30,80,60),N('doors','عدد الضلف',2,8,4,1),N('drawers','عدد الأدراج',0,4,0,1),K('mirror','مراية على ضلفة'),C('col','اللون','oak'),S('exec','طريقة التنفيذ',EXEC)],
  lines:p=>[{g:p.exec,name:'دولاب',qty:1,note:`دولاب ${p.w}×${p.h} سم عمق ${p.d} · ${p.doors} ضلف ${p.kind==='sliding'?'سحاب':'مفصلي'}${p.drawers?' · '+p.drawers+' أدراج':''}${p.mirror?' · مراية':''} · ${COL[p.col][0]}`}]},
 bedroom:{sec:'furniture',ico:'bed',ar:'مصمم غرفة النوم',draw:drawBedroom,f:[S('bed','مقاس السرير (سم)',[[140,'140'],[160,'160'],[180,'180'],[200,'200']],160),S('style','شكل ظهر السرير',[['classic','كلاسيك مكبّس'],['modern','مودرن']]),K('wardrobe','دولاب',true),N('ww','عرض الدولاب (سم)',120,500,240),N('wh','ارتفاع الدولاب (سم)',200,300,240),N('wdoors','ضلف الدولاب',2,8,4,1),K('dresser','تسريحة',true),C('col','اللون','oak'),S('exec','طريقة التنفيذ',EXEC)],
  lines:p=>[{g:p.exec,name:'غرفة نوم',qty:1,note:`غرفة نوم: سرير ${p.bed} سم (${p.style==='classic'?'كلاسيك':'مودرن'}) + 2 كومودينو${p.wardrobe?' + دولاب '+p.ww+'×'+p.wh+' ('+p.wdoors+' ضلف)':''}${p.dresser?' + تسريحة':''} · ${COL[p.col][0]}`}],
  pre:p=>{p.hb=p.style==='classic'?125:110}},
 piece:{sec:'furniture',ico:'sofa',ar:'مصمم قطعة موبيليا',draw:drawPiece,f:[S('piece','القطعة',PIECES.map(x=>[x[0],x[1]])),N('w','العرض (سم)',40,600,180),N('h','الارتفاع (سم)',30,250,80),N('d','العمق (سم)',20,300,90),C('col','اللون','oak'),S('exec','طريقة التنفيذ',EXEC),N('qty','العدد',1,20,1,1)],
  lines:p=>{const it=PIECES.find(x=>x[0]===p.piece);return [{g:p.exec,name:it[2],qty:p.qty,note:`${it[1]} ${p.w}×${p.d}×${p.h} سم · ${COL[p.col][0]} · العدد ${p.qty}`}]}}
};
const ICO={door:'<rect x="6" y="3" width="12" height="18" rx="1.5"/><circle cx="15" cy="12" r=".9"/>',shutter:'<rect x="4" y="3" width="16" height="4" rx="1"/><path d="M5 9h14M5 12h14M5 15h14M5 18h14"/>',ward:'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M9.5 11v2M14.5 11v2"/>',bed:'<path d="M3 19V6M3 14h18v5M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/>',sofa:'<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v5H3z"/>'};
const icon=k=>`<svg class="hzi" viewBox="0 0 24 24" aria-hidden="true">${ICO[k]||''}</svg>`;

/* ---------- الواجهة ---------- */
const st0=document.createElement('style');st0.textContent=`
#dg2Modal .sheet{max-width:520px}
.dg2-h{display:flex;align-items:center;gap:10px;margin:0 0 8px}.dg2-h h3{margin:0;font-size:19px}
.dg2-pv{border:1px solid var(--line);background:linear-gradient(180deg,color-mix(in srgb,var(--p) 5%,var(--card)),var(--card));border-radius:20px;padding:6px;margin:6px 0 12px}
.dg2-pv svg{display:block;width:100%;max-height:340px}
.dg2-f{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.dg2-f label{display:grid;gap:4px;font-size:12.5px;color:var(--mut)}
.dg2-f label.w{grid-column:1/-1}
.dg2-f input[type=number],.dg2-f select{width:100%;border:1.5px solid var(--line);background:var(--card);color:var(--ink);border-radius:12px;padding:9px 10px;font:inherit;font-size:14.5px}
.dg2-f .k{display:flex;align-items:center;gap:8px;color:var(--ink);font-size:14px;padding:8px 2px}
.dg2-sw{display:flex;gap:8px;flex-wrap:wrap}.dg2-sw button{width:34px;height:34px;border-radius:50%;border:2px solid var(--line);cursor:pointer;padding:0}
.dg2-sw button.on{border-color:var(--p);box-shadow:0 0 0 2px color-mix(in srgb,var(--p) 25%,transparent)}
.dg2-sm{margin:12px 0;padding:11px 12px;border-radius:14px;background:color-mix(in srgb,var(--p) 8%,var(--card));font-size:13.5px;line-height:1.7}
.dg2-vt{display:flex;gap:8px;margin:-4px 0 12px}.dg2-vt button{flex:1;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:12px;padding:10px;font:inherit;font-weight:800;font-size:14px;cursor:pointer}.dg2-vt button.on{background:var(--p);border-color:var(--p);color:#fff}
.dg2-a{display:flex;gap:8px}.dg2-a .btn{flex:1}`;document.head.appendChild(st0);

let K0=null,P=null,OPT={},VW='2d';
function ensure(){if($q('#dg2Modal'))return;document.body.insertAdjacentHTML('beforeend','<div class="modal" id="dg2Modal" hidden><div class="sheet st"><button type="button" class="x" data-close>×</button><div id="dg2Body"></div></div></div>')}
function ctl(f){const v=P[f.k];
 if(f.t==='num')return `<label><span>${f.l}</span><input type="number" inputmode="numeric" data-dg2f="${f.k}" min="${f.min}" max="${f.max}" step="${f.step}" value="${v}"></label>`;
 if(f.t==='sel')return `<label><span>${f.l}</span><select data-dg2f="${f.k}">${f.o.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${E(o[1])}</option>`).join('')}</select></label>`;
 if(f.t==='col')return `<label class="w"><span>${f.l}</span><div class="dg2-sw">${COLO.map(c=>`<button type="button" data-dg2c="${f.k}:${c[0]}" class="${v===c[0]?'on':''}" style="background:${COL[c[0]][1]}" aria-label="${c[1]}" title="${c[1]}"></button>`).join('')}</div></label>`;
 return `<label class="k"><input type="checkbox" data-dg2f="${f.k}"${v?' checked':''}> ${f.l}</label>`}
function norm(){const d=KINDS[K0];d.f.forEach(f=>{if(f.t==='num'){let n=+P[f.k];if(!isFinite(n))n=f.def;P[f.k]=Math.min(f.max,Math.max(f.min,Math.round(n)))}});if(d.pre)d.pre(P)}
function p3d(){const c=lc(P.col),n=(v,a,b,df)=>Math.max(a,Math.min(b,Math.round(+v)||df));
 if(K0==='door')return ['ddoor',{w:P.w,h:P.h,type:P.type,panel:P.panel,hand:P.hand,color:c}];
 if(K0==='shutter')return ['shutter',{w:P.w,h:P.h,color:c,motor:P.motor?'1':'0',vent:P.vent?'1':'0'}];
 if(K0==='wardrobe')return ['wardrobe',{w:P.w,h:P.h,d:P.d,doors:P.doors,drawers:P.drawers,kind:P.kind,mirror:P.mirror?'1':'0',color:c}];
 if(K0==='bedroom')return ['bedroom',{bed:P.bed,style:P.style,wardrobe:!!P.wardrobe,ww:P.ww,wh:P.wh,wdoors:P.wdoors,dresser:!!P.dresser,color:c}];
 if(K0==='piece'){const w=+P.w||180;
  if(P.piece==='dining')return ['table',{seats:n(Math.round(w/35/2)*2,4,10,6),shape:'rect',color:c}];
  if(P.piece==='table')return ['table',{seats:4,shape:'rect',color:c}];
  if(P.piece==='corner')return ['sofa',{seats:n(w/72,2,5,3),corner:'1',color:c}];
  if(P.piece==='living')return ['sofa',{seats:n(w/72,2,5,3),corner:'0',color:c}]}
 return [null,{}]}
function load3d(){return (typeof hzLoad==='function'?hzLoad('sec-3d'):Promise.resolve()).then(()=>window.hz3d)}
function mount3d(){const pv=$q('#dg2Pv');if(!pv)return;const a=p3d();
 if(!a[0]){if(window.hz3d&&hz3d.unmount)hz3d.unmount();pv.innerHTML='<p style="padding:34px 14px;text-align:center;color:var(--mut);line-height:1.8">'+T('3D preview is not available for this piece yet. Use 2D.','المعاينة 3D مش متاحة للقطعة دي لسه (المكتب والتسريحة). استخدم 2D.')+'</p>';return}
 load3d().then(h=>{if(h&&h.mount&&VW==='3d'&&$q('#dg2Pv')===pv)h.mount(pv,a[0],a[1])}).catch(()=>{pv.innerHTML='<p style="padding:34px;text-align:center">'+T('3D preview not loaded.','المعاينة 3D لسه ما اتحمّلتش.')+'</p>'})}
function preview(){const d=KINDS[K0];norm();const pv=$q('#dg2Pv');if(pv){if(VW==='3d')mount3d();else{if(window.hz3d&&hz3d.unmount)hz3d.unmount();pv.innerHTML=d.draw(P)}}const sm=$q('#dg2Sm');if(sm)sm.innerHTML=d.lines(P).map(l=>E(l.note)).join('<br>')}
function draw(){const d=KINDS[K0];$q('#dg2Body').innerHTML=`<div class="dg2-h">${icon(d.ico)}<h3>${d.ar}</h3></div><div class="dg2-pv" id="dg2Pv"></div><div class="dg2-vt"><button type="button" data-dg2v="2d" class="${VW==='2d'?'on':''}">2D</button><button type="button" data-dg2v="3d" class="${VW==='3d'?'on':''}">3D</button></div><div class="dg2-f">${d.f.map(ctl).join('')}</div><div class="dg2-sm" id="dg2Sm"></div><div class="dg2-a"><button type="button" class="btn" data-dg2="add">${T('Add to my request','أضف للطلب')}</button></div>`;preview()}
function show(){ensure();const el=$q('#dg2Modal'),cur=[...document.querySelectorAll('.modal')].filter(m=>!m.hidden&&m!==el).pop();
 try{if(cur&&MS[MS.length-1]!=='#'+cur.id)MS.push('#'+cur.id)}catch(_){}
 el.hidden=false;try{hzBk(el)}catch(_){}}
function def(k){const o={};KINDS[k].f.forEach(f=>{o[f.k]=f.def});return o}
function done(lines){const d=KINDS[K0];const el=$q('#dg2Modal');
 if(OPT.onDone){el.hidden=true;try{MS.pop()}catch(_){}OPT.onDone(lines);return}
 const pop=()=>{el.hidden=true;try{MS.length=0}catch(_){}};
 if(typeof window.hzQuoteAdd==='function'){pop();window.hzQuoteAdd(lines,'',d.sec,lines[0]&&lines[0].g)}
 else if(typeof window.hzQuote==='function'){pop();window.hzQuote(d.sec,'',{lines})}}
window.hzDesign2={kinds:Object.keys(KINDS),label:k=>KINDS[k]&&KINDS[k].ar,sec:k=>KINDS[k]&&KINDS[k].sec,
 open(k,opt){if(!KINDS[k])return;K0=k;OPT=opt||{};P=def(k);VW='2d';show();draw()}};
document.addEventListener('input',e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.dg2f||!P)return;P[t.dataset.dg2f]=t.type==='checkbox'?t.checked:t.type==='number'?t.value:t.value;
 if(t.tagName==='SELECT'&&/^\d+$/.test(t.value))P[t.dataset.dg2f]=+t.value;
 if(t.type==='number'&&t.value==='')return;
 preview();if(t.type==='checkbox')draw()});
document.addEventListener('change',e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.dg2f||!P)return;if(t.type==='number'){norm();t.value=P[t.dataset.dg2f]}preview()});
document.addEventListener('click',e=>{const vt=e.target.closest&&e.target.closest('[data-dg2v]');if(vt&&P){VW=vt.dataset.dg2v;draw();return}
 const c=e.target.closest&&e.target.closest('[data-dg2c]');
 if(c&&P){const [k,v]=c.dataset.dg2c.split(':');P[k]=v;draw();return}
 const a=e.target.closest&&e.target.closest('[data-dg2="add"]');if(a&&P){norm();done(KINDS[K0].lines(P))}});
})();
