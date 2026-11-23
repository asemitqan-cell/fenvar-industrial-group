/* Horizon: معاينة 3D للمنتجات (موبايل، لابتوب، كمبيوتر، ثلاجة، غسالة، حلة، أطباق، صيدلية، عطر).
   وضع "3D" خلفية بيضاء، وضع "تجربة" خلفية مكان حقيقي. بيتحمّل لما تضغط معاينة فقط. */
(function(){'use strict';
const $=s=>document.querySelector(s);
let T,R,sc,cam,root,acts=[],cvs,ov,raf=0,kind='phone',mode='try',tgt,pushed=0,skip=0,P={},spinOn=0,ticks=[];
const view={y:.5,p:.15,d:5,fit:5,vy:0};let drag=0,lastT=0,VT=null,KL=null;const UP=['window','door','shutter','profile'],FU=['wardrobe','bed','kitchen','sofa','table'],PRO=UP.concat(FU);
function goV(y,p,d){const k=Math.PI*2;VT={y:y+k*Math.round((view.y-y)/k),p:p,d:d};view.vy=0}
const NAMES={phone:'موبايل',laptop:'لابتوب',pc:'كمبيوتر',fridge:'ثلاجة',washer:'غسالة',pot:'حلة',plates:'أطباق وصيني',pharmacy:'علبة وشريط وزجاجة دواء',perfume:'عطر',tv:'شاشة تلفزيون',microwave:'ميكروويف',earbuds:'سماعات أذن (علبة وسماعتين)'};
const BG={phone:'desk',laptop:'desk',pc:'desk',fridge:'kitchen',washer:'kitchen',pot:'kitchen',plates:'kitchen',pharmacy:'pharm',perfume:'room',tv:'living',microwave:'kitchen',earbuds:'desk'};
const loadT=()=>window.THREE?Promise.resolve():new Promise((ok,no)=>{const u=['three.min.js?v=1','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];let i=0;const nx=()=>{if(window.THREE)return ok();if(i>=u.length)return no();const s=document.createElement('script');s.src=u[i++];s.onload=nx;s.onerror=nx;document.head.appendChild(s)};nx()});
const mat=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.45,metalness:.15},o||{}));
const bx=(w,h,d,m,x,y,z,p)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x||0,y||0,z||0);(p||root).add(o);return o};
const cy=(rt,rb,h,m,x,y,z,p)=>{const o=new T.Mesh(new T.CylinderGeometry(rt,rb,h,40),m);o.position.set(x||0,y||0,z||0);(p||root).add(o);return o};
const gp=(x,y,z,p)=>{const g=new T.Group();g.position.set(x||0,y||0,z||0);(p||root).add(g);return g};
function act(g,fn,sp){const a={t:0,g:0,fn,sp:sp||.12};g.traverse(o=>{o.userData.act=a});acts.push(a);fn(0);return a}
function shell(w,h,d,th,m,x,y,z,noTop,noFront){const g=gp(x,y,z);bx(w,h,th,m,0,0,-d/2+th/2,g);bx(th,h,d,m,-w/2+th/2,0,0,g);bx(th,h,d,m,w/2-th/2,0,0,g);bx(w,th,d,m,0,-h/2+th/2,0,g);if(!noTop)bx(w,th,d,m,0,h/2-th/2,0,g);if(!noFront)bx(w,h,th,m,0,0,d/2-th/2,g);return g}
const glass=(c,op)=>mat(c,{transparent:true,opacity:op||.5,roughness:.1,metalness:.1});
const M={
phone(){const dark=mat(0x111827,{metalness:.6,roughness:.3}),scr=mat(0x050505,{roughness:.2}),g=gp();
 bx(.72,1.46,.09,dark,0,0,0,g);bx(.66,1.38,.004,scr,0,0,.047,g);bx(.18,.03,.006,mat(0x000000),0,.64,.05,g);
 [[-.2,.55],[-.2,.37],[0,.46]].forEach(c=>{const o=cy(.085,.085,.03,mat(0x1f2937),c[0],c[1],-.06,g);o.rotation.x=Math.PI/2;const l=cy(.04,.04,.032,mat(0x38bdf8,{metalness:.9}),c[0],c[1],-.062,g);l.rotation.x=Math.PI/2});
 bx(.012,.22,.02,mat(0x9ca3af),.366,.3,0,g);bx(.012,.12,.02,mat(0x9ca3af),-.366,.4,0,g);
 act(g,t=>scr.emissive.setRGB(.12*t,.35*t,.9*t))},
laptop(){const body=mat(0x9ca3af,{metalness:.7,roughness:.35}),dk=mat(0x111827);
 bx(1.6,.07,1.1,body,0,0,0);bx(1.35,.006,.55,dk,0,.038,-.12);bx(.5,.006,.28,mat(0x6b7280),0,.038,.35);
 const piv=gp(0,.035,-.55),lid=gp(0,0,0,piv),sm=mat(0x0b1020,{emissive:0x000000});
 bx(1.6,1.05,.04,body,0,.525,-.02,lid);bx(1.5,.95,.004,sm,0,.525,.004,lid);
 act(lid,t=>{piv.rotation.x=Math.PI/2-(Math.PI/2+.32)*t;sm.emissive.setRGB(.1*t,.3*t,.8*t)},.1)},
pc(){const dk=mat(0x111827),st=mat(0x6b7280,{metalness:.8}),sm=mat(0x050505,{emissive:0x000000}),mon=gp();
 bx(1.3,.75,.06,dk,-.9,.75,0,mon);bx(1.2,.65,.004,sm,-.9,.75,.032,mon);cy(.05,.05,.3,st,-.9,.25,0,mon);bx(.5,.03,.3,st,-.9,.1,0,mon);
 act(mon,t=>sm.emissive.setRGB(.1*t,.3*t,.8*t));
 const tw=mat(0x374151,{metalness:.5}),tx=.6;shell(.5,1.1,.9,.03,tw,tx,.55,0,false,true);
 bx(.02,.85,.6,mat(0x15803d),tx-.22,.55,-.05);bx(.3,.06,.22,mat(0x1d4ed8),tx,.4,.1);[.75,.4].forEach(y=>{const f=cy(.12,.12,.04,mat(0x111827),tx,y,-.42);f.rotation.x=Math.PI/2});
 const pv=gp(tx-.25,.55,.45),dr=gp(0,0,0,pv);bx(.5,1.1,.03,glass(0x93c5fd,.35),.25,0,0,dr);bx(.5,.03,.032,dk,.25,.55,0,dr);
 act(dr,t=>{pv.rotation.y=-t*1.9})},
fridge(){const w=mat(0xf3f4f6,{roughness:.35}),st=mat(0x9ca3af,{metalness:.8});shell(.9,1.9,.8,.04,w,0,.95,0,false,true);
 [.7,1.05,1.5].forEach(y=>bx(.8,.02,.7,glass(0xbfdbfe,.6),0,y,0));bx(.82,.02,.75,w,0,1.17,0);
 [[1.53,.68],[.59,1.1]].forEach(d=>{const pv=gp(-.45,d[0],.4),dr=gp(0,0,0,pv);bx(.9,d[1],.04,w,.45,0,.02,dr);bx(.03,Math.min(.5,d[1]*.6),.05,st,.8,d[0]>1?-.08:.2,.06,dr);act(dr,t=>{pv.rotation.y=-t*1.7})})},
washer(){const w=mat(0xf9fafb,{roughness:.35});bx(.9,1,.85,w,0,.5,0);bx(.9,.16,.02,mat(0xd1d5db),0,.9,.43);cy(.04,.04,.03,mat(0x374151),.25,.9,.45).rotation.x=Math.PI/2;
 const dm=cy(.3,.3,.02,mat(0x0b1020),0,.45,.43);dm.rotation.x=Math.PI/2;
 const pv=gp(-.3,.45,.44),dr=gp(0,0,0,pv),ring=new T.Mesh(new T.TorusGeometry(.3,.04,12,36),mat(0x9ca3af,{metalness:.8}));ring.position.x=.3;dr.add(ring);
 const gl=cy(.28,.28,.03,glass(0x7dd3fc,.45),.3,0,0,dr);gl.rotation.x=Math.PI/2;act(dr,t=>{pv.rotation.y=-t*1.8})},
pot(){const st=mat(0xcfd6dd,{metalness:.85,roughness:.25,side:T.DoubleSide});
 const b=new T.Mesh(new T.CylinderGeometry(.5,.45,.55,48,1,true),st);b.position.y=.275;root.add(b);cy(.45,.45,.03,st,0,.015,0);
 cy(.43,.43,.01,mat(0xd97706),0,.42,0);[-1,1].forEach(s=>bx(.28,.06,.1,mat(0x111827),s*.62,.42,0));
 const lid=gp(0,.55,0);cy(.52,.52,.04,st,0,.02,0,lid);const dome=new T.Mesh(new T.SphereGeometry(.5,32,12,0,Math.PI*2,0,Math.PI/2),st);dome.scale.y=.28;dome.position.y=.04;lid.add(dome);
 const kn=new T.Mesh(new T.SphereGeometry(.06,16,12),mat(0x111827));kn.position.y=.2;lid.add(kn);
 act(lid,t=>{lid.position.set(t*.75,.55+t*.45,0);lid.rotation.z=-t*.55})},
plates(){const wh=mat(0xfafafa,{roughness:.2}),bl=mat(0x2563eb);
 for(let i=0;i<6;i++){const g=gp(0,.03+i*.06,0);cy(.56,.4,.05,wh,0,0,0,g);const r=new T.Mesh(new T.TorusGeometry(.5,.012,8,48),bl);r.rotation.x=Math.PI/2;r.position.y=.024;g.add(r);
  const s=i%2?1:-1;act(g,t=>{g.position.x=s*1.3*t;g.position.y=.03+i*.06+t*.1})}
 const pts=[[0,0],[.22,0],[.34,.1],[.38,.24],[.4,.3]].map(p=>new T.Vector2(p[0],p[1]));const bw=new T.Mesh(new T.LatheGeometry(pts,40),mat(0xfafafa,{side:T.DoubleSide}));bw.position.set(1.5,0,0);root.add(bw)},
pharmacy(){const wh=mat(0xffffff,{roughness:.5}),gr=mat(0x0f766e),bx0=-.55;
 const g=gp();shell(.5,.9,.22,.015,wh,bx0,.45,0,true);bx(.3,.34,.005,gr,bx0,.12,.112,g);bx(.14,.04,.006,wh,bx0,.12,.115,g);bx(.04,.14,.006,wh,bx0,.12,.115,g);
 const pv=gp(bx0,.9,-.11,g),fl=gp(0,0,0,pv);bx(.5,.015,.22,wh,0,.0075,.11,fl);
 const st=gp(bx0,.45,0,g);bx(.34,.7,.012,mat(0xd1d5db,{metalness:.85,roughness:.25}),0,0,0,st);
 for(let c=0;c<2;c++)for(let r=0;r<5;r++){const p=new T.Mesh(new T.SphereGeometry(.045,14,10),mat([0xf87171,0xfbbf24][c],{roughness:.3}));p.scale.z=.6;p.position.set(c?.08:-.08,-.28+r*.14,.014);st.add(p)}
 act(g,t=>{pv.rotation.x=-t*1.9;st.position.y=.45+.62*t});
 const bt=gp(),am=mat(0xb45309,{transparent:true,opacity:.88,roughness:.15});
 cy(.22,.22,.7,am,.55,.35,0,bt);cy(.12,.22,.1,am,.55,.75,0,bt);cy(.12,.12,.06,am,.55,.83,0,bt);cy(.223,.223,.3,mat(0xffffff),.55,.35,0,bt);cy(.14,.14,.01,mat(0xdc2626),.55,.35,.223,bt).rotation.x=Math.PI/2;
 const cp=gp(.55,.9,0,bt);cy(.14,.14,.12,mat(0xf8fafc),0,.06,0,cp);act(bt,t=>{cp.position.y=.9+t*.55;cp.rotation.y=t*8})},
tv(){const dk=mat(0x0b0f19,{metalness:.5}),sm=mat(0x050505,{emissive:0x000000}),sl=mat(0x6b7280,{metalness:.8}),g=gp();
 bx(2,1.15,.06,dk,0,.95,0,g);bx(1.92,1.07,.004,sm,0,.95,.033,g);bx(.7,.04,.32,sl,0,.02,0,g);bx(.1,.36,.06,sl,0,.2,-.02,g);
 act(g,t=>sm.emissive.setRGB(.08*t,.35*t,.95*t),.1)},
microwave(){const bd=mat(0xd1d5db,{metalness:.6,roughness:.35}),dk=mat(0x111827);shell(1.1,.65,.8,.03,bd,0,.325,0,false,true);
 cy(.28,.28,.02,glass(0xe5e7eb,.7),-.12,.05,0);bx(.26,.55,.02,dk,.42,.325,.395);[.45,.3,.15].forEach(y=>bx(.12,.04,.01,mat(0x9ca3af),.42,y+.05,.408));
 const pv=gp(-.55,.325,.4),dr=gp(0,0,0,pv);bx(.78,.58,.03,glass(0x1f2937,.6),.39,0,0,dr);bx(.03,.42,.04,mat(0x9ca3af,{metalness:.8}),.72,0,.03,dr);
 act(dr,t=>{pv.rotation.y=-t*1.9})},
earbuds(){const wh=mat(0xf9fafb,{roughness:.3});cy(.4,.4,.34,wh,0,.17,0);
 const pv=gp(0,.34,-.4),lid=gp(0,0,0,pv);cy(.4,.4,.12,wh,0,.06,.4,lid);
 act(lid,t=>{pv.rotation.x=-t*1.9},.1);
 const bd=gp();[-.15,.15].forEach(x=>{const e=gp(x,0,0,bd);const h=new T.Mesh(new T.SphereGeometry(.1,20,14),wh);h.position.y=.1;e.add(h);cy(.025,.025,.22,wh,0,-.04,.02,e)});
 bd.position.y=.2;act(bd,t=>{bd.position.y=.2+t*.55},.1)},
perfume(){const gl=glass(0xfbcfe8,.55),gd=mat(0xb8860b,{metalness:.9,roughness:.25});
 bx(.6,.7,.3,gl,0,.35,0);bx(.52,.5,.22,mat(0xf9a8d4,{transparent:true,opacity:.9}),0,.3,0);cy(.1,.1,.08,gd,0,.74,0);
 const cp=gp(0,.78,0);cy(.16,.16,.35,gd,0,.175,0,cp);act(cp,t=>{cp.position.y=.78+t*.6;cp.rotation.z=t*.4})}};
function css(){if($('#h3css'))return;const s=document.createElement('style');s.id='h3css';s.textContent=`#hz3d[hidden]{display:none!important}#hz3d{position:fixed;inset:0;z-index:99999;background:var(--bg);color:var(--ink);display:flex;flex-direction:column;direction:rtl}#hz3d .h3h{display:flex;align-items:center;gap:8px;padding:10px 12px;padding-top:max(10px,env(safe-area-inset-top));border-bottom:1px solid var(--line)}#hz3d .h3h b{flex:1;text-align:center}#hz3d .h3h button{border:1px solid var(--line);background:var(--card);border-radius:12px;width:40px;height:36px;font-size:16px;cursor:pointer}#h3v{flex:1;min-height:200px;touch-action:none;position:relative;background:#fff}#h3v canvas{display:block;width:100%;height:100%}#h3v[data-bg=white]{background:#fff}#h3v[data-bg=desk]{background:linear-gradient(180deg,rgba(255,255,255,.55),transparent 30%),linear-gradient(#e4ebf1 0 62%,#c9d3dc 62% 64%,#a47448 64% 100%)}#h3v[data-bg=kitchen]{background:repeating-linear-gradient(90deg,transparent 0 69px,rgba(0,0,0,.07) 69px 70px),repeating-linear-gradient(0deg,transparent 0 69px,rgba(0,0,0,.07) 69px 70px),linear-gradient(#f1f5f6 0 58%,#8f959b 58% 61%,#d9c9ae 61% 100%)}#h3v[data-bg=pharm]{background:linear-gradient(#e6f4f1 0 60%,#b9ddd6 60% 63%,#f8fafa 63% 100%)}#h3v[data-bg=room]{background:linear-gradient(#efe4d3 0 64%,#d8c7ad 64% 66%,#a9805a 66% 100%)}#h3v[data-bg=living]{background:linear-gradient(#e9e4dc 0 66%,#cfc6b8 66% 68%,#8a6a4a 68% 100%)}#h3p{padding:10px 12px calc(12px + env(safe-area-inset-bottom));display:flex;flex-wrap:wrap;gap:8px;justify-content:center}#h3p .pill.on{background:var(--p,#0F766E);color:#fff;border-color:var(--p,#0F766E)}#h3p .pill{cursor:pointer}#h3p p{flex-basis:100%;margin:0;text-align:center;font-size:13px;color:var(--mut)}`;document.head.appendChild(s)}
const SW={up:[['#F8FAFC','أبيض'],['#E8DCC0','بيج'],['#3F454B','رمادي غامق'],['#8B5A2B','شكل خشب']],fu:[['#8B5A2B','جوزي'],['#C9A06A','بلوط فاتح'],['#F3F4F6','أبيض'],['#475569','رمادي']],sf:[['#64748B','رمادي'],['#1E3A5F','كحلي'],['#C8B89A','بيج'],['#3F6B4E','أخضر زيتي']],ki:[['#E5E7EB','أبيض رمادي'],['#8B5A2B','جوزي'],['#1F2937','أسود'],['#B8A88A','بيج']]};
const SK={window:'up',door:'up',shutter:'up',profile:'up',wardrobe:'fu',bed:'fu',table:'fu',sofa:'sf',kitchen:'ki'};
const DEF={window:'#f8fafc',door:'#a16207',shutter:'#f1f5f9',profile:'#f8fafc',wardrobe:'#8B5A2B',bed:'#8B5A2B',table:'#8B5A2B',sofa:'#64748b',kitchen:'#e5e7eb'};
const QK=['window','door','shutter','profile','glass','wardrobe','bed','kitchen','sofa','table','planks'];
const WA='201040930136';
const nv=(k,d)=>(P[k]!=null&&P[k]!==''&&!isNaN(+P[k]))?+P[k]:d;
function colName(){const l=SW[SK[kind]]||[],c=String(P.color||DEF[kind]||'').toLowerCase(),m=l.find(x=>x[0].toLowerCase()===c);return m?m[1]:(P.color?'مخصص':'')}
const cv=(k,d,a,b)=>Math.max(a,Math.min(b,nv(k,d)));
function specs(){const a=[];
 if(kind==='window'){const ns=Math.round(cv('sashes',2,1,3));a.push(['المقاس',cv('w',120,50,300)+' × '+cv('h',120,50,250)+' سم'],['عدد الضلف',ns],['الفتح',P.open==='slide'&&ns>1?'جرّار':'مفصلي'])}
 else if(kind==='door')a.push(['المقاس',cv('w',90,60,140)+' × '+cv('h',210,180,260)+' سم'],['الزجاج',P.glass==='1'?'بزجاج':'بدون زجاج']);
 else if(kind==='shutter')a.push(['المقاس',cv('w',150,60,300)+' × '+cv('h',150,60,300)+' سم']);
 else if(kind==='wardrobe')a.push(['المقاس',cv('w',180,60,400)+' × '+cv('h',210,100,300)+' × '+cv('d',60,30,100)+' سم'],['عدد الضلف',Math.round(cv('doors',3,1,6))],['الأدراج',Math.round(cv('drawers',2,0,5))],['الأرفف',Math.round(cv('shelves',4,0,10))],['شماعة',P.rod!=='0'?'موجودة':'بدون']);
 else if(kind==='bed')a.push(['المقاس',cv('w',160,90,220)+' × '+cv('l',200,160,230)+' سم'],['ارتفاع الراس',cv('hb',110,60,160)+' سم'],['التخزين',P.storage!=='0'?'بصندوق تخزين':'بدون']);
 else if(kind==='kitchen'){const L0=cv('len',240,120,480);a.push(['الطول',L0+' سم'],['عدد الوحدات',Math.max(2,Math.round(L0/60))])}
 else if(kind==='sofa')a.push(['عدد المقاعد',Math.round(cv('seats',3,2,5))],['النوع',P.corner==='1'?'ركنة':'عادي']);
 else if(kind==='table')a.push(['عدد الكراسي',Math.round(cv('seats',6,4,10)/2)*2],['الشكل',P.shape==='round'?'دائرية':'مستطيلة']);
 const cn=colName();if(cn)a.push([FU.includes(kind)?(kind==='sofa'?'القماش':'الخامة / اللون'):'اللون',cn]);return a}
function quote(){const sp=specs().map(x=>x[0]+': '+x[1]).join('، ');const t=String(P.title||NAMES[kind]).replace(/\s*·\s*نموذج توضيحي/,'');
 const msg='مرحباً Horizon، أريد عرض سعر لـ: '+t+(sp?' — '+sp:'')+' (من معاينة 3D)';window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank')}
function hdr(){const h=ov.querySelector('.h3h');h.innerHTML='<button id="h3x" type="button" aria-label="إغلاق">✕</button><b id="h3t"></b><button id="h3r" type="button" aria-label="إعادة العرض" title="إعادة العرض">↺</button><button id="h3f" type="button" aria-label="ملء الشاشة" title="ملء الشاشة">⛶</button>'}
function addHint(){const v=$('#h3v');if(!v||$('#h3hint'))return;const h=document.createElement('div');h.id='h3hint';h.textContent='↔ اسحب للف · بإصبعين للتقريب';v.appendChild(h);setTimeout(()=>{if(h.parentNode)h.remove()},4600)}
function studio(b,s){const m=Math.max(s.x,s.y,s.z);root.traverse(o=>{if(o.isMesh&&o.material&&!o.material.map&&!o.material.transparent){o.castShadow=true;o.receiveShadow=true}});
 const g=new T.Mesh(new T.PlaneGeometry(m*4,m*4),new T.ShadowMaterial({opacity:.16}));g.rotation.x=-Math.PI/2;g.position.set(tgt.x,b.min.y+.001,tgt.z);g.receiveShadow=true;root.add(g);
 if(KL){const e=m*1.4,c=KL.shadow.camera;c.left=-e;c.right=e;c.top=e;c.bottom=-e;c.near=.1;c.far=m*9;c.updateProjectionMatrix();KL.position.set(tgt.x+m*.9,tgt.y+m*2.2,tgt.z+m*1.3);KL.target.position.copy(tgt);KL.target.updateMatrixWorld()}}
function panel(){const el=$('#h3p'),A=ANIMALS.includes(kind),sp=A?[]:specs(),sk=SW[SK[kind]],cur=String(P.color||DEF[kind]||'').toLowerCase(),demo=/نموذج توضيحي/.test(P.title||'');
 let h='<div class="h3seg"><button type="button" class="'+(mode==='360'?'on':'')+'" data-h3m="360">🔄 عرض 360°</button><button type="button" class="'+(mode==='try'?'on':'')+'" data-h3m="try">🖐️ تفاعلي</button></div>';
 if(A)h+='<div class="h3row">'+ANIMALS.map(k=>'<button type="button" class="pill '+(k===kind?'on':'')+'" data-h3k="'+k+'">'+NAMES[k]+'</button>').join('')+'</div>';
 if(sp.length)h+='<div class="h3st">'+(UP.includes(kind)?'بيانات UPVC':'بيانات الأثاث')+'</div>';
 if(sp.length)h+='<div class="h3sp">'+sp.map(x=>'<div><small>'+x[0]+'</small><b>'+x[1]+'</b></div>').join('')+'</div>';
 if(demo&&sp.length)h+='<p class="h3n">نموذج توضيحي بأبعاد افتراضية</p>';
 if(sk)h+='<div class="h3sw"><span>اللون</span>'+sk.map(c=>'<button type="button" class="h3c'+(cur===c[0].toLowerCase()?' on':'')+'" data-h3c="'+c[0]+'" style="--c:'+c[0]+'" aria-label="'+c[1]+'" title="'+c[1]+'"></button>').join('')+'</div>';
 h+='<p class="h3t">'+(A?'دوس على الحيوان يطلّع صوته ويتحرك. جرّب تدوس على الضرع في البقرة 🥛':mode==='try'?'اضغط على أي جزء (باب، غطاء، علبة) عشان يتفتح أو يتحرك.':'المعاينة بتلف لوحدها. اسحب للف وقرّب ببصباعين.')+'</p>';
 h+='<div class="h3row"><button type="button" class="pill" data-h3a="1">افتح الكل</button><button type="button" class="pill" data-h3a="0">اقفل الكل</button>'+[['f','أمام'],['s','جنب'],['b','خلف'],['t','فوق'],['u','تحت']].map(v=>'<button type="button" class="pill" data-h3v="'+v[0]+'">'+v[1]+'</button>').join('')+'</div>';
 if(QK.includes(kind))h+='<button type="button" class="h3q" data-h3q="1">💬 اطلب عرض سعر عبر واتساب</button>';
 el.innerHTML=h;$('#h3v').dataset.bg=mode==='360'?'white':BG[kind]}
function css3(){if($('#h3css3'))return;const s=document.createElement('style');s.id='h3css3';s.textContent=`#h3p{display:block;padding:12px 12px calc(12px + env(safe-area-inset-bottom));border-top:1px solid var(--line);background:var(--card);max-height:46vh;overflow:auto}
.h3seg{display:flex;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:3px;margin-bottom:10px}
.h3seg button{flex:1;border:0;background:none;padding:8px;border-radius:9px;font-family:inherit;font-weight:600;font-size:13px;color:var(--mut);cursor:pointer}
.h3seg button.on{background:var(--p,#0F766E);color:#fff}
.h3sp{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px;margin-bottom:10px}
.h3sp div{background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:7px 9px}
.h3sp small{display:block;color:var(--mut);font-size:11px}.h3sp b{font-size:13px}
.h3st{font-weight:700;font-size:13px;margin:0 0 6px}
.h3sw{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:13px;color:var(--mut)}
.h3c{width:30px;height:30px;border-radius:50%;border:2px solid var(--line);background:var(--c);padding:0;cursor:pointer}
.h3c.on{border-color:var(--p,#0F766E);box-shadow:0 0 0 2px var(--card),0 0 0 4px var(--p,#0F766E)}
.h3row{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:10px;scrollbar-width:none}.h3row .pill{flex:none}
.h3q{width:100%;border:0;border-radius:12px;padding:13px;background:#16a34a;color:#fff;font-family:inherit;font-weight:700;font-size:14px;cursor:pointer}
#h3p .h3n,#h3p .h3t{margin:0 0 8px;font-size:12px;color:var(--mut);text-align:center}
#h3hint{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,.72);color:#fff;font-size:12px;padding:6px 12px;border-radius:99px;pointer-events:none;animation:h3f 4.6s forwards;white-space:nowrap}
@keyframes h3f{0%,80%{opacity:1}100%{opacity:0}}
#hz3d.fs #h3p,#hz3d.spin #h3r,#hz3d.spin #h3f{display:none}
#h3v[data-bg=white]{background:radial-gradient(ellipse at 50% 38%,#fff 0,#eef3f1 58%,#dce6e3 100%)}
[data-theme=dark] #h3v[data-bg=white]{background:radial-gradient(ellipse at 50% 38%,#223a3f 0,#122428 60%,#0b1416 100%)}`;document.head.appendChild(s)}
function build(){if(root)sc.remove(root);acts=[];ticks=[];root=new T.Group();sc.add(root);M[kind]();const b=new T.Box3().setFromObject(root),s=b.getSize(new T.Vector3());tgt=b.getCenter(new T.Vector3());view.fit=view.d=Math.max(s.x,s.y,s.z)*1.9+.4;shadow(b,s);studio(b,s)}
function shadow(b,s){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,'rgba(0,0,0,.35)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);
 const z=Math.max(s.x,s.z)*1.6+.3,p=new T.Mesh(new T.PlaneGeometry(z,z),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.set((b.min.x+b.max.x)/2,b.min.y+.002,(b.min.z+b.max.z)/2);root.add(p)}
function fit(){const v=$('#h3v');if(!v||!R)return;R.setSize(v.clientWidth,v.clientHeight);cam.aspect=v.clientWidth/Math.max(1,v.clientHeight);cam.updateProjectionMatrix()}
function loop(){raf=requestAnimationFrame(loop);if(!ov||ov.hidden||spinOn)return;acts.forEach(a=>{a.t+=(a.g-a.t)*a.sp;if(Math.abs(a.g-a.t)<.002)a.t=a.g;a.fn(a.t)});ticks.forEach(f=>f(.016));
 if(VT){view.y+=(VT.y-view.y)*.16;view.p+=(VT.p-view.p)*.16;if(VT.d)view.d+=(VT.d-view.d)*.16;if(Math.abs(VT.y-view.y)+Math.abs(VT.p-view.p)<.004){view.y=VT.y;view.p=VT.p;if(VT.d)view.d=VT.d;VT=null}}else if(!drag){if(Math.abs(view.vy)>.0004){view.y+=view.vy;view.vy*=.93}else if(mode==='360'&&performance.now()-lastT>2200)view.y+=.0035}
const c=Math.cos(view.p);cam.position.set(tgt.x+view.d*c*Math.sin(view.y),tgt.y+view.d*Math.sin(view.p),tgt.z+view.d*c*Math.cos(view.y));cam.lookAt(tgt);R.render(sc,cam)}
function pick(e){if(spinOn||!root||!cvs)return;const r=cvs.getBoundingClientRect(),m=new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),rc=new T.Raycaster();rc.setFromCamera(m,cam);for(const x of rc.intersectObjects(root.children,true)){const a=x.object.userData.act;if(a){if(a.tap)a.tap(a);else a.g=a.g?0:1;return}}}
function wire(){const v=$('#h3v');let pts={},moved=0,pd=0;
 v.addEventListener('pointerdown',e=>{v.setPointerCapture&&v.setPointerCapture(e.pointerId);pts[e.pointerId]=[e.clientX,e.clientY];moved=0;drag=1;VT=null;view.vy=0;lastT=performance.now();const hh=$('#h3hint');if(hh)hh.remove();const k=Object.values(pts);pd=k.length==2?Math.hypot(k[0][0]-k[1][0],k[0][1]-k[1][1]):0});
 v.addEventListener('pointermove',e=>{const p=pts[e.pointerId];if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];pts[e.pointerId]=[e.clientX,e.clientY];const k=Object.values(pts);
  if(k.length==2){const d=Math.hypot(k[0][0]-k[1][0],k[0][1]-k[1][1]);if(pd)view.d=Math.max(view.fit*.35,Math.min(view.fit*2.6,view.d*pd/d));pd=d;moved=9;return}
  moved+=Math.abs(dx)+Math.abs(dy);view.y-=dx*.008;view.vy=-dx*.008;view.p=Math.max(-1.45,Math.min(1.45,view.p+dy*.006))});
 const up=e=>{const was=pts[e.pointerId];delete pts[e.pointerId];drag=Object.keys(pts).length?1:0;lastT=performance.now();if(was&&moved<8&&mode==='try'&&e.type==='pointerup')pick(e)};v.addEventListener('pointerup',up);v.addEventListener('pointercancel',up);
 v.addEventListener('wheel',e=>{e.preventDefault();view.d=Math.max(view.fit*.35,Math.min(view.fit*2.6,view.d*(1+e.deltaY*.001)))},{passive:false});
 ov.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.id==='h3x'){closeOv();return}
  if(t.id==='h3r'){goV(.5,.15,view.fit);return}
  if(t.id==='h3f'){ov.classList.toggle('fs');setTimeout(fit,60);return}
  if(t.dataset.h3c){P.color=t.dataset.h3c;const d0=view.d;build();view.d=d0;panel();return}
  if(t.dataset.h3q){quote();return}
  if(t.dataset.h3k){kind=t.dataset.h3k;P={};acts.forEach(a=>a.g=0);build();panel();return}
  if(t.dataset.h3m){mode=t.dataset.h3m;acts.forEach(a=>a.g=0);panel();return}
  if(t.dataset.h3a!==undefined){acts.forEach(a=>a.g=+t.dataset.h3a);return}
  if(t.dataset.h3v){const m={f:[0,.1],s:[1.57,.1],b:[3.14,.1],t:[.01,1.45],u:[.01,-1.4]}[t.dataset.h3v];goV(m[0],m[1])}})}
function closeOv(){if(ov)ov.hidden=true;document.body.style.overflow='';if(pushed){pushed=0;skip=1;try{history.back()}catch(_){window.hz3dOpen=0}}else window.hz3dOpen=0}
addEventListener('popstate',()=>{if(skip)skip=0;else if(ov&&!ov.hidden){ov.hidden=true;document.body.style.overflow='';pushed=0}setTimeout(()=>{window.hz3dOpen=0},0)});
async function open(k,p){P=p||{};spinOn=0;kind=M[k]?k:'phone';mode=PRO.includes(kind)?'360':'try';css();css2();css3();
 if(!ov){ov=document.createElement('div');ov.id='hz3d';ov.innerHTML='<div class="h3h"><button id="h3x" type="button" aria-label="إغلاق">✕</button><b id="h3t"></b><span style="width:40px"></span></div><div id="h3v"><p class="empty" style="padding:30px;text-align:center">جاري تحميل المعاينة…</p></div><div id="h3p"></div>';document.body.appendChild(ov);wire()}
 ov.hidden=false;document.body.style.overflow='hidden';window.hz3dOpen=1;if(!pushed){try{history.pushState({hz3d:1},'');pushed=1}catch(_){}}ov.classList.remove('spin','fs');hdr();$('#h3t').textContent='معاينة: '+(P.title||NAMES[kind]);
 try{await loadT()}catch(_){$('#h3v').innerHTML='<p class="msg" style="padding:30px;text-align:center">محتاج إنترنت عشان تتحمّل المعاينة.</p>';return}
 T=window.THREE;const v=$('#h3v');
 if(!R){v.innerHTML='';R=new T.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(2,devicePixelRatio||1));v.appendChild(R.domElement);cvs=R.domElement;sc=new T.Scene();cam=new T.PerspectiveCamera(40,1,.05,100);sc.add(new T.HemisphereLight(0xffffff,0x667788,.8));R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;KL=new T.DirectionalLight(0xffffff,.85);KL.castShadow=true;KL.shadow.mapSize.set(1024,1024);KL.shadow.bias=-.0004;KL.position.set(2,4,3);sc.add(KL);sc.add(KL.target);const fl=new T.DirectionalLight(0xdbeafe,.28);fl.position.set(-3,2,-2);sc.add(fl);const rm=new T.DirectionalLight(0xffffff,.22);rm.position.set(-1,3,-4);sc.add(rm);addEventListener('resize',fit);loop()}
 else if(!v.contains(cvs)){v.innerHTML='';v.appendChild(cvs)}
 view.y=.5;view.p=.15;view.vy=0;VT=null;lastT=performance.now();build();panel();fit();setTimeout(fit,60);addHint()}
/* ===== v16: new 3D kinds (parametric: they read P = supplier/product params) + 360 photo viewer ===== */
Object.assign(NAMES,{wardrobe:'دولاب',bed:'سرير',door:'باب',window:'شباك UPVC',kitchen:'مطبخ',sofa:'ركنة / كنب',table:'سفرة',car:'سيارة',shutter:'شتر',profile:'قطاع UPVC',planks:'خشب',glass:'زجاج',house:'عقار (نموذج مبسّط)'});
Object.assign(BG,{wardrobe:'room',bed:'room',door:'wall',window:'wall',kitchen:'kitchen',sofa:'living',table:'living',car:'garage',shutter:'wall',profile:'white',planks:'shop',glass:'shop',house:'living'});
const nn=(v,d,a,b)=>Math.max(a,Math.min(b,(+v)||d)),cl=d=>P.color||d;
const wallM=()=>mat(0xe7e0d3,{roughness:.95,metalness:0});
M.wardrobe=function(){
 const W=nn(P.w,180,60,400)/100,H=nn(P.h,210,100,300)/100,D=nn(P.d,60,30,100)/100,nd=Math.round(nn(P.doors,3,1,6)),ns=Math.round(nn(P.shelves,4,0,10)),ndr=Math.round(nn(P.drawers,2,0,5)),th=.022,rod=P.rod!=='0';
 const body=mat(cl('#8B5A2B'),{roughness:.6,metalness:0}),inn=mat(0xdcc7a0,{roughness:.7,metalness:0}),mt=mat(0x9ca3af,{metalness:.9,roughness:.3});
 shell(W,H,D,th,body,0,H/2,0,false,true);
 const dh=ndr?ndr*.2:0,y0=th+dh,top=H-th;
 if(ndr){bx(W-2*th,th,D-2*th,inn,0,y0,0);for(let i=0;i<ndr;i++){const g=gp(0,th+.1+i*.2,D/2-.015);bx(W-2*th-.012,.186,.026,body,0,0,0,g);bx(.22,.02,.03,mt,0,0,.03,g);const bw=shell(W-2*th-.06,.15,D-.1,.012,inn,0,-.01,-(D-.1)/2,true,true);g.add(bw);act(g,t=>{g.position.z=D/2-.015+t*D*.75},.12)}}
 let A=null,B=null;
 if(rod&&W>1.1){const dx=-W/2+Math.min(.9,W*.45);bx(th,top-y0,D-2*th,body,dx,(y0+top)/2,0);A=[-W/2+th,dx-th/2];B=[dx+th/2,W/2-th]}
 else if(rod)A=[-W/2+th,W/2-th];else B=[-W/2+th,W/2-th];
 if(A){const len=A[1]-A[0],cx=(A[0]+A[1])/2,r=cy(.012,.012,len,mt,cx,top-.18,0);r.rotation.z=Math.PI/2;const cols=[0x2563eb,0xdc2626,0x16a34a,0xf59e0b,0x7c3aed,0x0891b2];for(let i=0;i<Math.min(12,Math.floor(len/.07));i++)bx(.03,Math.min(.7,top-y0-.35),.36,mat(cols[i%6],{roughness:.9,metalness:0}),A[0]+.06+i*.07,top-.2-Math.min(.7,top-y0-.35)/2,0)}
 if(B){const len=B[1]-B[0],cx=(B[0]+B[1])/2,cols=[0xf87171,0x60a5fa,0xfbbf24,0x34d399];for(let i=1;i<=ns;i++){const y=y0+(top-y0)*i/(ns+1);bx(len-.004,th,D-2*th,inn,cx,y,0);if(i%2)bx(Math.min(.35,len*.5),.09,.28,mat(cols[i%4],{roughness:.9,metalness:0}),cx,y+th/2+.045,0)}}
 const hd=H-y0,dw=W/nd,hf=Math.ceil(nd/2);
 for(let i=0;i<nd;i++){const left=i<hf,px=left?-W/2+i*dw:-W/2+(i+1)*dw,pv=gp(px,(y0+H)/2,D/2+.011),dr=gp(0,0,0,pv);bx(dw-.004,hd-.004,.022,body,left?dw/2:-dw/2,0,0,dr);bx(.02,.14,.03,mt,left?dw-.05:-dw+.05,0,.025,dr);act(dr,t=>{pv.rotation.y=(left?-1:1)*t*1.85},.1)}
};
M.bed=function(){
 const W=nn(P.w,160,90,220)/100,Lg=nn(P.l,200,160,230)/100,HB=nn(P.hb,110,60,160)/100,st=P.storage!=='0',fh=.3;
 const fr=mat(cl('#8B5A2B'),{roughness:.6,metalness:0}),ma=mat(0xf3f4f6,{roughness:.9,metalness:0}),pi=mat(0xffffff,{roughness:.9,metalness:0}),bl=mat(0x38bdf8,{roughness:.9,metalness:0}),inn=mat(0xdcc7a0,{roughness:.8,metalness:0});
 if(st){shell(W,fh,Lg,.03,fr,0,fh/2,0,true,false);bx(.5,.18,.4,mat(0xfbbf24,{roughness:.9,metalness:0}),-W*.2,.12,-Lg*.2);bx(.45,.15,.35,mat(0x34d399,{roughness:.9,metalness:0}),W*.2,.1,Lg*.1)}else bx(W,fh,Lg,fr,0,fh/2,0);
 const mg=gp(0,fh,-Lg/2),m=gp(0,0,Lg/2,mg);bx(W-.06,.22,Lg-.06,ma,0,.11,0,m);bx(W-.04,.06,Lg*.55,bl,0,.24,Lg*.2,m);[-1,1].forEach(s=>bx(.55,.12,.34,pi,s*W*.22,.28,-Lg/2+.3,m));
 bx(W+.06,HB,.07,fr,0,HB/2,-Lg/2-.035);bx(W+.06,.45,.06,fr,0,.225,Lg/2+.03);[-1,1].forEach(s=>bx(.5,.45,.4,fr,s*(W/2+.3),.225,-Lg/2+.3));
 act(mg,t=>{mg.rotation.x=-t*.95},.1)
};
M.door=function(){
 const W=nn(P.w,90,60,140)/100,H=nn(P.h,210,180,260)/100,lf=mat(cl('#a16207'),{roughness:.55,metalness:0}),fr=mat(0x6b7280,{metalness:.5,roughness:.5}),wm=wallM(),mt=mat(0xd4d4d8,{metalness:.9,roughness:.25});
 bx(.06,H,.2,fr,-W/2-.03,H/2,0);bx(.06,H,.2,fr,W/2+.03,H/2,0);bx(W+.12,.06,.2,fr,0,H+.03,0);
 bx(.7,H+.4,.2,wm,-W/2-.41,(H+.4)/2,0);bx(.7,H+.4,.2,wm,W/2+.41,(H+.4)/2,0);bx(W+1.8,.4,.2,wm,0,H+.26,0);
 const pv=gp(-W/2,0,0),dr=gp(0,0,0,pv);bx(W-.01,H-.01,.045,lf,W/2,H/2,0,dr);
 if(P.glass==='1')bx(W*.55,H*.35,.055,glass(0xbfdbfe,.55),W/2,H*.68,0,dr);else{const dk=mat(new T.Color(cl('#a16207')).multiplyScalar(.8),{roughness:.6,metalness:0});bx(W*.6,H*.3,.012,dk,W/2,H*.72,.026,dr);bx(W*.6,H*.28,.012,dk,W/2,H*.3,.026,dr)}
 bx(.04,.14,.05,mt,W-.08,H*.5,.05,dr);act(dr,t=>{pv.rotation.y=-t*1.7},.1)
};
M.window=function(){
 const W=nn(P.w,120,50,300)/100,H=nn(P.h,120,50,250)/100,ns=Math.round(nn(P.sashes,2,1,3)),sl=P.open==='slide'&&ns>1,fm=mat(P.color||'#f8fafc',{roughness:.35,metalness:.05}),gl=glass(0xbfe3ff,.35),wm=wallM(),mt=mat(0x9ca3af,{metalness:.9,roughness:.3}),fw=.07,y0=.9;
 bx(W+1.2,y0,.2,wm,0,y0/2,0);bx(W+1.2,.5,.2,wm,0,y0+H+.25,0);bx(.6,H,.2,wm,-W/2-.3,y0+H/2,0);bx(.6,H,.2,wm,W/2+.3,y0+H/2,0);
 bx(W,fw,.12,fm,0,y0+fw/2,0);bx(W,fw,.12,fm,0,y0+H-fw/2,0);bx(fw,H,.12,fm,-W/2+fw/2,y0+H/2,0);bx(fw,H,.12,fm,W/2-fw/2,y0+H/2,0);
 const iw=W-2*fw,ih=H-2*fw,sw=iw/ns,sash=(g,w,h,f)=>{bx(w,f,.05,fm,0,h/2-f/2,0,g);bx(w,f,.05,fm,0,-h/2+f/2,0,g);bx(f,h,.05,fm,-w/2+f/2,0,0,g);bx(f,h,.05,fm,w/2-f/2,0,0,g);bx(w-2*f,h-2*f,.008,gl,0,0,0,g)};
 for(let i=0;i<ns;i++){const cx=-iw/2+sw*(i+.5);
  if(sl){const g=gp(cx,y0+H/2,i%2?.04:-.04);sash(g,sw+.01,ih,.05);bx(.03,.12,.04,mt,i%2?-sw/2+.05:sw/2-.05,0,.04,g);act(g,t=>{g.position.x=cx+(i%2?-1:1)*t*sw*.85},.1)}
  else{const left=i%2===0,pv=gp(left?cx-sw/2:cx+sw/2,y0+H/2,0),g=gp(left?sw/2:-sw/2,0,0,pv);sash(g,sw-.01,ih-.01,.05);bx(.03,.12,.04,mt,left?sw/2-.05:-sw/2+.05,0,.04,g);act(pv,t=>{pv.rotation.y=(left?-1:1)*t*1.6},.1)}}
};
M.shutter=function(){
 const W=nn(P.w,150,60,300)/100,H=nn(P.h,150,60,300)/100,sl=mat(cl('#f1f5f9'),{roughness:.4,metalness:.1}),rl=mat(0x6b7280,{metalness:.5,roughness:.5}),hh=.055,n=Math.round(H/hh),g=gp(),S=[];
 bx(.05,H+.2,.1,rl,-W/2-.025,H/2+.1,0);bx(.05,H+.2,.1,rl,W/2+.025,H/2+.1,0);bx(W+.1,.22,.2,sl,0,H+.11,0);bx(W,.04,.14,rl,0,-.02,0);
 for(let i=0;i<n;i++)S.push(bx(W,hh-.004,.025,sl,0,H-(i+.5)*hh,0,g));
 act(g,t=>{S.forEach((s,i)=>{s.position.y=H-(i+.5)*hh*(1-t)+t*.12})},.07)
};
M.profile=function(){
 const s=new T.Shape(),w=.7,h=.6;s.moveTo(-w/2,-h/2);s.lineTo(w/2,-h/2);s.lineTo(w/2,h/2);s.lineTo(-w/2,h/2);s.lineTo(-w/2,-h/2);
 [[-.22,0,.18,.4],[.04,0,.18,.4],[.26,.12,.1,.16],[.26,-.14,.1,.16]].forEach(c=>{const p=new T.Path();p.moveTo(c[0]-c[2]/2,c[1]-c[3]/2);p.lineTo(c[0]+c[2]/2,c[1]-c[3]/2);p.lineTo(c[0]+c[2]/2,c[1]+c[3]/2);p.lineTo(c[0]-c[2]/2,c[1]+c[3]/2);p.lineTo(c[0]-c[2]/2,c[1]-c[3]/2);s.holes.push(p)});
 const o=new T.Mesh(new T.ExtrudeGeometry(s,{depth:2.4,bevelEnabled:false}),mat(cl('#f8fafc'),{roughness:.4,metalness:.05}));o.rotation.y=-.5;o.position.set(0,.4,-1.2);root.add(o);
 const g=gp();bx(.16,.34,2.2,mat(0x9ca3af,{metalness:.9,roughness:.3}),-.22,.4,0,g);act(g,t=>{g.position.z=t*1.2;g.position.y=t*.0},.08)
};
M.kitchen=function(){
 const n=Math.max(2,Math.round(nn(P.len,240,120,480)/60)),W=n*.6,c=cl('#e5e7eb'),bd=mat(c,{roughness:.5,metalness:.05}),inn=mat(0xd6d3d1,{roughness:.8,metalness:0}),mt=mat(0x9ca3af,{metalness:.9,roughness:.3}),top=mat(0x374151,{roughness:.4,metalness:.2});
 bx(W,.04,.62,top,0,.87,.01);shell(W-.01,.8,.58,.02,inn,0,.4,0,true,true);
 for(let i=0;i<n;i++){const x=-W/2+.3+i*.6;
  if(i%3===1){for(let j=0;j<3;j++){const g=gp(x,.17+j*.26,.3);bx(.56,.24,.02,bd,0,0,0,g);bx(.2,.02,.03,mt,0,0,.025,g);act(g,t=>{g.position.z=.3+t*.45},.1)}}
  else{const pv=gp(x-.28,.4,.3),dr=gp(0,0,0,pv);bx(.56,.78,.02,bd,.28,0,0,dr);bx(.02,.2,.03,mt,.5,0,.025,dr);act(dr,t=>{pv.rotation.y=-t*1.8},.1)}}
 bx(W,.5,.3,mat(0xf3f4f6,{roughness:.9,metalness:0}),0,1.6,-.2);
 for(let i=0;i<n;i++){const x=-W/2+.3+i*.6,pv=gp(x-.28,1.55,-.04),dr=gp(0,0,0,pv);bx(.56,.7,.02,bd,.28,0,0,dr);bx(.02,.16,.03,mt,.5,-.2,.025,dr);act(dr,t=>{pv.rotation.y=-t*1.8},.1);bx(.56,.01,.3,inn,x,1.2,-.19)}
};
M.sofa=function(){
 const sn=Math.round(nn(P.seats,3,2,5)),co=P.corner==='1',sw=.72,W=sn*sw,c=cl('#64748b'),bd=mat(c,{roughness:.95,metalness:0}),cu=mat(new T.Color(c).multiplyScalar(1.12),{roughness:.95,metalness:0}),lg=mat(0x3f3f46,{roughness:.6,metalness:.3});
 bx(W+.3,.22,.9,bd,0,.22,0);bx(W+.3,.55,.2,bd,0,.65,-.35);[-1,1].forEach(s=>bx(.15,.5,.9,bd,s*(W/2+.075),.5,0));
 for(let i=0;i<sn;i++){const x=-W/2+sw*(i+.5),g=gp(x,.4,.05);bx(sw-.03,.16,.7,cu,0,0,0,g);const b=gp(x,.68,-.22);bx(sw-.04,.4,.14,cu,0,0,0,b);act(g,t=>{g.position.y=.4+t*.12;g.rotation.x=-t*.5},.1)}
 if(co){bx(.95,.22,1.5,bd,-W/2-.4,.22,.75);bx(.8,.16,1.4,cu,-W/2-.4,.4,.75);bx(.2,.5,1.5,bd,-W/2-.9,.5,.75)}
 [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(p=>cy(.03,.03,.12,lg,p[0]*(W/2+.1),.06,p[1]*.38))
};
M.table=function(){
 const n=Math.round(nn(P.seats,6,4,10)/2)*2,rd=P.shape==='round',c=cl('#8B5A2B'),tp=mat(c,{roughness:.5,metalness:0}),ch=mat(new T.Color(c).multiplyScalar(.85),{roughness:.7,metalness:0}),cu=mat(0xd6d3d1,{roughness:.95,metalness:0});
 const L=rd?1.2:Math.max(1.2,n/2*.6),Wd=rd?1.2:.9;
 if(rd){cy(.6,.6,.05,tp,0,.75,0);cy(.08,.12,.72,tp,0,.36,0)}else{bx(L,.05,Wd,tp,0,.75,0);[-1,1].forEach(a=>[-1,1].forEach(b=>bx(.07,.72,.07,tp,a*(L/2-.08),.36,b*(Wd/2-.08))))}
 for(let i=0;i<n;i++){let x,z,r;if(rd){const a=i/n*Math.PI*2;x=Math.sin(a)*.95;z=Math.cos(a)*.95;r=a+Math.PI}else{const sd=i%2?1:-1,k=Math.floor(i/2),m=n/2;x=-L/2+L*(k+.5)/m;z=sd*(Wd/2+.28);r=sd>0?Math.PI:0}
  const g=gp(x,0,z);g.rotation.y=r;bx(.42,.05,.42,cu,0,.45,0,g);bx(.42,.45,.05,ch,0,.7,-.2,g);[-1,1].forEach(a=>[-1,1].forEach(b=>bx(.04,.43,.04,ch,a*.18,.215,b*.18,g)));
  const dx=rd?Math.sin(i/n*Math.PI*2):0,dz=rd?Math.cos(i/n*Math.PI*2):(i%2?1:-1);act(g,t=>{g.position.x=x+dx*t*.35;g.position.z=z+dz*t*.35},.1)}
};
M.car=function(){
 const bd=mat(cl('#b91c1c'),{metalness:.6,roughness:.3}),gl=glass(0x93c5fd,.35),dk=mat(0x1f2937,{roughness:.7,metalness:.1}),tr=mat(0x111827,{roughness:.9,metalness:0}),rm=mat(0xd1d5db,{metalness:.9,roughness:.25}),Wd=1.8;
 bx(4.4,.4,Wd,bd,0,.5,0);bx(2.3,.04,Wd-.1,bd,-.15,1.39,0);bx(2.3,.56,Wd-.16,gl,-.15,1.1,0);
 [[.95,.9],[.95,-.9],[-1.25,.9],[-1.25,-.9]].forEach(p=>bx(.07,.58,.07,bd,p[0],1.1,p[1]*.93));
 [[1.4,.8],[1.4,-.8],[-1.4,.8],[-1.4,-.8]].forEach(p=>{const w=cy(.34,.34,.26,tr,p[0],.34,p[1]);w.rotation.x=Math.PI/2;const r=cy(.2,.2,.27,rm,p[0],.34,p[1]);r.rotation.x=Math.PI/2});
 bx(2.4,.04,Wd-.1,dk,-.1,.72,0);[.4,-.4].forEach(z=>{bx(.5,.12,.46,dk,.05,.82,z);bx(.1,.55,.46,dk,-.2,1.08,z)});bx(.5,.12,1.4,dk,-.8,.82,0);bx(.1,.55,1.4,dk,-1.05,1.08,0);
 bx(.35,.18,Wd-.25,dk,.95,.95,0);const sw=new T.Mesh(new T.TorusGeometry(.17,.025,10,28),dk);sw.position.set(.62,1.1,.4);sw.rotation.y=Math.PI/2-.35;root.add(sw);
 [.7,-.7].forEach(z=>{bx(.06,.14,.3,mat(0xfef08a,{emissive:0x6b5b00}),2.2,.55,z);bx(.06,.14,.3,mat(0xdc2626,{emissive:0x500000}),-2.2,.55,z)});
 bx(.06,.08,Wd-.2,dk,2.2,.32,0);
 [[.55,.9,1],[-.7,.9,1],[.55,-.9,-1],[-.7,-.9,-1]].forEach(d=>{const pv=gp(d[0],.55,d[1]),dr=gp(0,0,0,pv);bx(1.0,.4,.05,bd,-.5,0,0,dr);bx(.9,.5,.03,gl,-.5,.45,0,dr);bx(.14,.03,.05,rm,-.9,.1,.04,dr);act(pv,t=>{pv.rotation.y=d[2]*t*1.1},.1)});
 const hp=gp(1.1,.72,0),hd=gp(0,0,0,hp);bx(1.1,.05,Wd-.1,bd,.55,0,0,hd);act(hp,t=>{hp.rotation.z=t*.95},.1);
 const tp=gp(-1.6,.72,0),td=gp(0,0,0,tp);bx(.6,.05,Wd-.1,bd,-.3,0,0,td);act(tp,t=>{tp.rotation.z=-t*.95},.1)
};
M.planks=function(){
 const base=new T.Color(cl('#b98a52')),g=gp();
 for(let r=0;r<4;r++)for(let k=0;k<5;k++){const b=bx(2,.05,.18,mat(base.clone().offsetHSL(0,0,(Math.sin(r*7+k*3)*.05)),{roughness:.7,metalness:0}),0,.03+r*.052,(k-2)*.19,g);if(r>=2){const s=(k%2?1:-1);act(b,t=>{b.position.x=s*t*1.4},.08)}}
 [-.7,.7].forEach(x=>bx(.1,.06,1.1,mat(0x6b7280,{metalness:.4}),x,-.005,0))
};
M.glass=function(){
 const ty=P.type||'clear',cfg={clear:[0xbfe3ff,.3,.1],frosted:[0xf1f5f9,.8,.5],bronze:[0x8b6b4a,.5,.1],laminated:[0x93c5fd,.45,.1],mirror:[0xe5e7eb,1,0]}[ty]||[0xbfe3ff,.3,.1],mt=mat(0x6b7280,{metalness:.7,roughness:.4});
 bx(2.4,.08,.7,mt,0,.04,0);[-1.15,1.15].forEach(x=>bx(.06,1.4,.7,mt,x,.74,0));
 for(let i=0;i<5;i++){const m=ty==='mirror'?mat(0xdbe3ea,{metalness:1,roughness:.04}):mat(cfg[0],{transparent:true,opacity:cfg[1],roughness:cfg[2],metalness:.1}),s=bx(2.1,1.3,.03,m,0,.75,-.28+i*.14);s.rotation.x=-.06;act(s,t=>{s.position.z=-.28+i*.14+t*.9;s.position.y=.75},.09)}
};
M.house=function(){
 const wm=wallM(),fl=mat(0xc9b79c,{roughness:.9,metalness:0}),rf=mat(cl('#9a3412'),{roughness:.8,metalness:0}),W=6,D=5,H=2.8;
 bx(W+.4,.15,D+.4,fl,0,.075,0);shell(W,H,D,.15,wm,0,H/2+.15,0,true,false);bx(.12,H,D*.55,wm,.6,H/2+.15,-D*.22);bx(W*.45,H,.12,wm,-W*.27,H/2+.15,.4);
 bx(1.6,.45,.9,mat(0x64748b,{roughness:.9,metalness:0}),-1.8,.4,-1.7);bx(1.4,.3,2,mat(0x8b5a2b,{roughness:.7,metalness:0}),1.9,.3,-1.3);bx(1.6,.4,.9,mat(0x94a3b8,{roughness:.9,metalness:0}),-1.5,.4,1.6);
 const g=gp(0,H+.3,0);bx(W+.6,.18,D+.6,rf,0,0,0,g);act(g,t=>{g.position.y=H+.3+t*2.2;g.rotation.z=t*.12},.08)
};

/* ---- 360° photo viewer ---- */
async function openSpin(urls,title){
 css();css2();css3();
 if(!ov){ov=document.createElement('div');ov.id='hz3d';ov.innerHTML='<div class="h3h"><button id="h3x" type="button" aria-label="إغلاق">✕</button><b id="h3t"></b><span style="width:40px"></span></div><div id="h3v"></div><div id="h3p"></div>';document.body.appendChild(ov);wire()}
 ov.hidden=false;document.body.style.overflow='hidden';window.hz3dOpen=1;if(!pushed){try{history.pushState({hz3d:1},'');pushed=1}catch(_){}}
 spinOn=1;ov.classList.add('spin');ov.classList.remove('fs');$('#h3t').textContent=title||'معاينة 360°';
 const v=$('#h3v');v.dataset.bg='white';v.innerHTML='<img id="h3img" alt="" draggable="false" style="width:100%;height:100%;object-fit:contain;user-select:none;-webkit-user-drag:none;pointer-events:none"><div style="position:absolute;bottom:10px;left:0;right:0;text-align:center;font-size:12px;color:#64748b;pointer-events:none">↔ اسحب بصباعك عشان تلف المنتج</div>';
 $('#h3p').innerHTML='<p>صور المورد من كل الزوايا. اسحب يمين وشمال للف.</p>';
 const im=$('#h3img'),n=urls.length;let i=0,auto=1,ax=0;urls.forEach(u=>{const x=new Image();x.src=u});
 const show=k=>{i=((Math.round(k)%n)+n)%n;im.src=urls[i]};show(0);
 let f=0;const tm=setInterval(()=>{if(!ov||ov.hidden||!spinOn){clearInterval(tm);return}if(auto){f+=.35;show(f)}},90);
 let d=null;
 const dn=e=>{d=e.clientX;auto=0;ax=f};const mv=e=>{if(d==null)return;f=ax+(e.clientX-d)/Math.max(8,v.clientWidth/n)*1.1;show(f)};const up=()=>{d=null};
 v.onpointerdown=dn;v.onpointermove=mv;v.onpointerup=up;v.onpointercancel=up
}
function css2(){if($('#h3css2'))return;const s=document.createElement('style');s.id='h3css2';s.textContent='#h3v[data-bg=wall]{background:linear-gradient(#f1ede4 0 100%)}#h3v[data-bg=garage]{background:linear-gradient(#e5e7eb 0 62%,#9ca3af 62% 64%,#4b5563 64% 100%)}#h3v[data-bg=farm]{background:linear-gradient(#cfe8ff 0 56%,#9ccc65 56% 58%,#7cb342 58% 100%)}#h3v[data-bg=shop]{background:linear-gradient(#f3efe8 0 64%,#cbbfa9 64% 66%,#8d7b62 66% 100%)}';document.head.appendChild(s)}

/* ===== v16: livestock 3D (tap animals: sound + movement; cow: tap the udder for milk) ===== */
Object.assign(NAMES,{cow:'بقرة',sheep:'خروف',goat:'ماعز',camel:'جمل',horse:'حصان',hen:'دجاجة'});
Object.assign(BG,{cow:'farm',sheep:'farm',goat:'farm',camel:'farm',horse:'farm',hen:'farm'});
let AC=null;
const ac=()=>{try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;if(!AC)AC=new A();if(AC.state==='suspended')AC.resume();return AC}catch(_){return null}};
function tone(c,o){const t=c.currentTime+(o.t0||0),os=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter(),n=o.f.length;os.type=o.type||'sawtooth';os.frequency.setValueAtTime(o.f[0],t);for(let i=1;i<n;i++)os.frequency.linearRampToValueAtTime(o.f[i],t+o.d*i/(n-1));
 if(o.vib){const lf=c.createOscillator(),lg=c.createGain();lf.frequency.value=o.vib[0];lg.gain.value=o.vib[1];lf.connect(lg);lg.connect(os.frequency);lf.start(t);lf.stop(t+o.d+.05)}
 fl.type=o.filt?o.filt[0]:'lowpass';fl.frequency.value=o.filt?o.filt[1]:1500;fl.Q.value=o.filt?o.filt[2]:1;
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.gain||.25,t+Math.min(.08,o.d/4));g.gain.exponentialRampToValueAtTime(.0001,t+o.d);
 os.connect(fl);fl.connect(g);g.connect(c.destination);os.start(t);os.stop(t+o.d+.05)}
function noise(c,d,ft,fq,gain,t0){const t=c.currentTime+(t0||0),n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=b;f.type=ft;f.frequency.value=fq;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start(t)}
const SND={
cow:c=>{tone(c,{f:[135,120,95],d:1.5,vib:[5,7],filt:['lowpass',720,4],gain:.32});tone(c,{f:[270,240,190],d:1.5,type:'sine',gain:.07})},
sheep:c=>{[0,.6].forEach(t0=>tone(c,{f:[400,350,380],d:.55,vib:[28,45],filt:['bandpass',1300,3],gain:.28,t0}))},
goat:c=>{tone(c,{f:[560,500,430],d:.85,vib:[36,60],filt:['bandpass',1700,4],gain:.26})},
camel:c=>{tone(c,{f:[95,72,60],d:1.3,vib:[18,10],filt:['lowpass',520,2],gain:.36});noise(c,.9,'lowpass',400,.18,.05)},
horse:c=>{tone(c,{f:[430,850,680,300],d:1.5,vib:[14,32],filt:['bandpass',1400,2],gain:.25});noise(c,.5,'highpass',2500,.05,0)},
hen:c=>{[0,.17,.34,.7,.87].forEach(t0=>tone(c,{f:[720,920,620],d:.11,type:'square',filt:['bandpass',1500,3],gain:.1,t0}))},
squirt:c=>noise(c,.14,'highpass',3000,.12,0)};
const snd=k=>{const c=ac();if(c&&SND[k])try{SND[k](c)}catch(_){}};
const el=(rx,ry,rz,m,x,y,z,p)=>{const o=new T.Mesh(new T.SphereGeometry(1,24,16),m);o.scale.set(rx,ry,rz);o.position.set(x||0,y||0,z||0);(p||root).add(o);return o};
const lg=(r,h,m,x,y,z,p,hoof)=>{const g=gp(x,y,z,p);cy(r,r*.85,h,m,0,-h/2,0,g);if(hoof)cy(r*1.05,r*1.05,.07,hoof,0,-h-.02,0,g);return g};
const flash=(a,ms)=>{a.g=1;setTimeout(()=>{a.g=0},ms)};
function legs(P4,r,h,m,hoof,y){return P4.map(p=>lg(r,h,m,p[0],y,p[1],null,hoof))}
M.cow=function(){
 const W=mat(0xf8fafc,{roughness:.8,metalness:0}),K=mat(0x1f2937,{roughness:.9,metalness:0}),PK=mat(0xf9a8d4,{roughness:.7,metalness:0}),DK=mat(0x111827,{roughness:.6,metalness:0}),g=gp();
 const bd=gp(0,0,0,g);el(.95,.5,.5,W,0,.98,0,bd);[[.3,.1,.47,.28,.2],[-.35,-.05,-.47,.3,.22],[.05,.25,-.47,.2,.14],[-.2,.2,.47,.22,.16]].forEach(s=>el(s[3],s[4],.05,K,s[0],.98+s[1],s[2],bd));act(bd,t=>{bd.position.y=Math.sin(t*Math.PI)*.06},.15).tap=a=>{snd('cow');flash(a,900)};
 legs([[.6,.28],[.6,-.28],[-.6,.28],[-.6,-.28]],.075,.7,W,DK,.72).forEach(l=>g.add(l));
 el(.32,.26,.26,W,.95,1.16,0,g).rotation.z=-.5;
 const hp=gp(1.18,1.22,0,g),hd=gp(0,0,0,hp);el(.3,.22,.21,W,0,0,0,hd);el(.15,.13,.18,PK,.27,-.07,0,hd);[-1,1].forEach(s=>{el(.03,.03,.03,DK,.4,-.04,s*.07,hd);el(.04,.04,.04,DK,.15,.1,s*.15,hd);el(.1,.04,.15,W,-.1,.14,s*.25,hd);const h=cy(.02,.035,.14,mat(0xfde68a,{roughness:.5,metalness:0}),-.04,.26,s*.13,hd);h.rotation.x=s*.5});
 act(hp,t=>{hp.rotation.z=t*.45;hp.position.y=1.22+t*.06},.1).tap=a=>{snd('cow');flash(a,1400)};
 const tp=gp(-.93,1.15,0,g);cy(.018,.018,.7,W,0,-.35,0,tp);el(.05,.1,.05,K,0,-.75,0,tp);act(tp,t=>{tp.rotation.x=Math.sin(t*9)*.25},.1).tap=a=>{a.g=1;setTimeout(()=>{a.g=0},900)};
 /* udder + milk */
 const ud=gp(-.28,.62,0,g);el(.2,.14,.2,PK,0,0,0,ud);[[.08,.08],[.08,-.08],[-.08,.08],[-.08,-.08]].forEach(p=>cy(.025,.02,.1,PK,p[0],-.14,p[1],ud));
 const bk=gp(-.28,0,0,g);cy(.16,.13,.22,mat(0x9ca3af,{metalness:.7,roughness:.4}),0,.11,0,bk);const lv=cy(.135,.135,.01,mat(0xffffff,{roughness:.3,metalness:0}),0,.03,0,bk);
 const ps=[];for(let i=0;i<10;i++){const s=new T.Mesh(new T.SphereGeometry(.018,8,8),mat(0xffffff,{roughness:.2,metalness:0}));s.visible=false;g.add(s);ps.push({s,y:0,x:0,z:0,on:0})}
 const ml={t:0,lv:0};
 act(ud,t=>{ud.scale.set(1+t*.12,1+t*.12,1+t*.12)},.2).tap=a=>{snd('squirt');ml.t=2.6;flash(a,500)};
 ticks.push(dt=>{if(ml.t>0){ml.t-=dt;ml.lv=Math.min(1,ml.lv+dt*.07);lv.scale.y=1+ml.lv*18;lv.position.y=.03+ml.lv*.1;
   if(Math.random()<.5){const p=ps.find(q=>!q.on);if(p){const tt=[[.08,.08],[.08,-.08],[-.08,.08],[-.08,-.08]][Math.floor(Math.random()*4)];p.on=1;p.x=-.28+tt[0];p.z=tt[1];p.y=.5;p.s.visible=true}}}
  ps.forEach(p=>{if(!p.on)return;p.y-=dt*1.3;if(p.y<.2+ml.lv*.1){p.on=0;p.s.visible=false}p.s.position.set(p.x,p.y,p.z)})})
};
M.sheep=function(){
 const WL=mat(0xf5f0e6,{roughness:1,metalness:0}),DK=mat(0x3f3a36,{roughness:.9,metalness:0}),g=gp(),body=gp(0,0,0,g);
 el(.6,.45,.45,WL,0,.85,0,body);for(let i=0;i<14;i++){const a=i/14*6.283;el(.2,.2,.2,WL,Math.cos(a)*.5,.95+Math.sin(i*2.3)*.18,Math.sin(a)*.38,body)}
 legs([[.35,.2],[.35,-.2],[-.35,.2],[-.35,-.2]],.045,.48,DK,DK,.5).forEach(l=>g.add(l));
 const hp=gp(.62,.95,0,g);el(.2,.22,.17,DK,0,0,0,hp);el(.1,.05,.09,mat(0xf5f0e6,{roughness:1,metalness:0}),0,.2,0,hp);[-1,1].forEach(s=>{el(.12,.04,.06,DK,-.02,.02,s*.2,hp);el(.03,.03,.03,mat(0xffffff),.17,.06,s*.08,hp)});
 const tl=el(.1,.1,.1,WL,-.6,.9,0,g);
 const a=act(g,t=>{g.position.y=Math.abs(Math.sin(t*Math.PI*3))*.25*(t>0?1:0);body.scale.set(1+t*.04,1+t*.06,1+t*.04)},.1);
 a.tap=x=>{snd('sheep');x.g=1;x.t=0;setTimeout(()=>{x.g=0},1200)}
};
M.goat=function(){
 const TN=mat(0xc9a27a,{roughness:.85,metalness:0}),DK=mat(0x4b3621,{roughness:.9,metalness:0}),WH=mat(0xf3ead8,{roughness:.9,metalness:0}),g=gp();
 el(.62,.3,.28,TN,0,.82,0,g);el(.28,.2,.2,TN,.62,.98,0,g).rotation.z=.6;
 legs([[.4,.16],[.4,-.16],[-.4,.16],[-.4,-.16]],.04,.58,TN,DK,.6).forEach(l=>g.add(l));
 const hp=gp(.82,1.12,0,g),hd=gp(0,0,0,hp);el(.19,.13,.12,TN,0,0,0,hd);el(.1,.1,.09,DK,.14,-.03,0,hd);
 [-1,1].forEach(s=>{const h=cy(.015,.03,.26,DK,-.04,.17,s*.06,hd);h.rotation.z=.5;h.rotation.x=s*.2;el(.1,.03,.05,TN,-.1,.05,s*.14,hd);el(.025,.025,.025,mat(0x111827),.12,.04,s*.07,hd)});
 el(.025,.1,.03,WH,.14,-.12,0,hd);
 const a=act(hp,t=>{hp.rotation.z=-t*.55;hp.position.x=.82+t*.2},.14);a.tap=x=>{snd('goat');flash(x,900)};
 const tl=el(.05,.1,.04,TN,-.62,.98,0,g);tl.rotation.z=.6
};
M.camel=function(){
 const TN=mat(0xc8a165,{roughness:.95,metalness:0}),DK=mat(0x6b4f2a,{roughness:.9,metalness:0}),g=gp(),bd=gp(0,0,0,g);
 el(.85,.4,.36,TN,0,1.25,0,bd);act(bd,t=>{bd.position.y=-t*.12},.1).tap=a=>{snd('camel');flash(a,1000)};const hump=el(.28,.32,.26,TN,-.05,1.65,0,bd);
 legs([[.55,.2],[.55,-.2],[-.55,.2],[-.55,-.2]],.06,1.0,TN,DK,1.05).forEach(l=>g.add(l));
 const np=gp(.8,1.4,0,g),nk=cy(.1,.15,.85,TN,0,.38,0,np);nk.rotation.z=-.5;nk.position.set(.2,.35,0);
 const hp=gp(1.12,2.05,0,g),hd=gp(0,0,0,hp);el(.24,.14,.13,TN,0,0,0,hd);el(.12,.1,.1,DK,.2,-.04,0,hd);[-1,1].forEach(s=>{el(.025,.025,.025,mat(0x111827),.1,.06,s*.1,hd);el(.04,.07,.03,TN,-.1,.1,s*.1,hd)});
 el(.04,.04,.1,DK,-.9,1.3,0,g);
 act(hump,t=>{hump.scale.set(1+t*.1,1-t*.18,1+t*.1)},.12).tap=a=>{snd('camel');flash(a,1000)};
 act(hp,t=>{hp.rotation.z=t*.5;hp.position.y=2.05+t*.12},.1).tap=a=>{snd('camel');flash(a,1100)};

};
M.horse=function(){
 const BR=mat(0x7c4a21,{roughness:.6,metalness:0}),DK=mat(0x1f130a,{roughness:.7,metalness:0}),g0=gp(),pv=gp(-.6,0,0,g0),g=gp(.6,0,0,pv);
 el(.8,.36,.3,BR,0,1.1,0,g);
 const L2=legs([[.5,.14],[.5,-.14],[-.5,.14],[-.5,-.14]],.055,.82,BR,DK,.84);L2.forEach(l=>g.add(l));
 const nk=cy(.11,.16,.7,BR,.78,1.45,0,g);nk.rotation.z=-.65;
 for(let i=0;i<6;i++)bx(.04,.18,.025,DK,.62+i*.09,1.55-i*.02+.1,0,g).rotation.z=-.5;
 const hp=gp(1.12,1.78,0,g),hd=gp(0,0,0,hp);el(.28,.13,.13,BR,.05,0,0,hd).rotation.z=-.4;el(.13,.1,.1,DK,.3,-.12,0,hd);[-1,1].forEach(s=>{el(.025,.025,.025,mat(0xffffff),.08,.05,s*.1,hd);const e=cy(0,.04,.12,BR,-.1,.15,s*.06,hd);e.rotation.z=.2});
 const tp=gp(-.82,1.15,0,g),tt=cy(.04,.07,.7,DK,-.05,-.3,0,tp);tt.rotation.z=.25;
 act(pv,t=>{pv.rotation.z=t*.65},.08).tap=a=>{snd('horse');flash(a,1700)}
};
M.hen=function(){
 const WH=mat(0xfafafa,{roughness:.9,metalness:0}),RD=mat(0xdc2626,{roughness:.6,metalness:0}),OR=mat(0xf59e0b,{roughness:.6,metalness:0}),g=gp(),bd=gp(0,0,0,g);
 el(.3,.25,.2,WH,0,.42,0,bd);el(.16,.15,.1,WH,-.26,.5,0,bd).rotation.z=.6;[-1,1].forEach(s=>el(.17,.12,.04,mat(0xf3f4f6,{roughness:.9,metalness:0}),0,.45,s*.19,bd));
 const hp=gp(.28,.7,0,bd);el(.1,.1,.09,WH,0,0,0,hp);cy(0,.035,.1,OR,.12,-.01,0,hp).rotation.z=-Math.PI/2;
 [.035,.05,.035].forEach((r,i)=>el(r,r*1.4,.02,RD,-.01+i*.04,.11,0,hp));el(.03,.06,.025,RD,.1,-.08,0,hp);[-1,1].forEach(s=>el(.018,.018,.018,mat(0x111827),.06,.03,s*.07,hp));
 [-.07,.07].forEach(z=>{cy(.012,.012,.26,OR,.02,.13,z,bd)});[-.07,.07].forEach(z=>bx(.12,.012,.05,OR,.06,.0,z,bd));
 const egg=el(.06,.08,.06,mat(0xfef3c7,{roughness:.4,metalness:0}),-.42,.07,0,g);egg.visible=false;
 const a=act(bd,t=>{bd.position.y=Math.abs(Math.sin(t*Math.PI*3))*.12;bd.rotation.z=Math.sin(t*20)*.05*(t>0?1:0)},.15);
 a.tap=x=>{snd('hen');x.t=0;x.g=1;setTimeout(()=>{x.g=0;egg.visible=true;egg.scale.set(.01,.01,.01);let k=0;const iv=setInterval(()=>{k+=.1;egg.scale.set(k,k,k);if(k>=1)clearInterval(iv)},40)},900)}
};

const ANIMALS=['cow','sheep','goat','camel','horse','hen'];

window.hz3d={open,openSpin,specsOf:(k,p)=>{const k0=kind,p0=P;kind=k;P=p||{};try{return specs()}finally{kind=k0;P=p0}},kinds:Object.keys(M),names:NAMES,_t:M,_dbg:()=>({acts,ticks})};
})();
