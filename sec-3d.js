/* Horizon: معاينة 3D للمنتجات (موبايل، لابتوب، كمبيوتر، ثلاجة، غسالة، حلة، أطباق، صيدلية، عطر).
   وضع "3D" خلفية بيضاء، وضع "تجربة" خلفية مكان حقيقي. بيتحمّل لما تضغط معاينة فقط. */
(function(){'use strict';
const $=s=>document.querySelector(s);
let T,R,sc,cam,root,acts=[],cvs,ov,raf=0,kind='phone',mode='try',tgt,pushed=0,skip=0;
const view={y:.5,p:.15,d:5,fit:5};
const NAMES={phone:'موبايل',laptop:'لابتوب',pc:'كمبيوتر',fridge:'ثلاجة',washer:'غسالة',pot:'حلة',plates:'أطباق وصيني',pharmacy:'علبة وشريط وزجاجة دواء',perfume:'عطر',tv:'شاشة تلفزيون',microwave:'ميكروويف',earbuds:'سماعات أذن (علبة وسماعتين)'};
const BG={phone:'desk',laptop:'desk',pc:'desk',fridge:'kitchen',washer:'kitchen',pot:'kitchen',plates:'kitchen',pharmacy:'pharm',perfume:'room',tv:'living',microwave:'kitchen',earbuds:'desk'};
const loadT=()=>window.THREE?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});
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
function panel(){const P=$('#h3p');P.innerHTML=`<button type="button" class="pill ${mode==='360'?'on':''}" data-h3m="360">🔄 3D (360°)</button><button type="button" class="pill ${mode==='try'?'on':''}" data-h3m="try">🖐️ تجربة (افتح وحرّك)</button><p>${mode==='try'?'اضغط على أي جزء (باب، غطاء، علبة) عشان يتفتح أو يتحرك. اسحب بصباعك للف.':'اسحب للف حواليه وقرّب ببصباعين.'}</p><button type="button" class="pill" data-h3a="1">افتح الكل</button><button type="button" class="pill" data-h3a="0">اقفل الكل</button>${[['f','أمام'],['s','جنب'],['b','خلف'],['t','فوق'],['u','تحت']].map(v=>`<button type="button" class="pill" data-h3v="${v[0]}">${v[1]}</button>`).join('')}`;$('#h3v').dataset.bg=mode==='360'?'white':BG[kind]}
function build(){if(root)sc.remove(root);acts=[];root=new T.Group();sc.add(root);M[kind]();const b=new T.Box3().setFromObject(root),s=b.getSize(new T.Vector3());tgt=b.getCenter(new T.Vector3());view.fit=view.d=Math.max(s.x,s.y,s.z)*1.9+.4;shadow(b,s)}
function shadow(b,s){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,'rgba(0,0,0,.35)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);
 const z=Math.max(s.x,s.z)*1.6+.3,p=new T.Mesh(new T.PlaneGeometry(z,z),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.set((b.min.x+b.max.x)/2,b.min.y+.002,(b.min.z+b.max.z)/2);root.add(p)}
function fit(){const v=$('#h3v');if(!v||!R)return;R.setSize(v.clientWidth,v.clientHeight);cam.aspect=v.clientWidth/Math.max(1,v.clientHeight);cam.updateProjectionMatrix()}
function loop(){raf=requestAnimationFrame(loop);if(!ov||ov.hidden)return;acts.forEach(a=>{a.t+=(a.g-a.t)*a.sp;if(Math.abs(a.g-a.t)<.002)a.t=a.g;a.fn(a.t)});
 const c=Math.cos(view.p);cam.position.set(tgt.x+view.d*c*Math.sin(view.y),tgt.y+view.d*Math.sin(view.p),tgt.z+view.d*c*Math.cos(view.y));cam.lookAt(tgt);R.render(sc,cam)}
function pick(e){const r=cvs.getBoundingClientRect(),m=new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),rc=new T.Raycaster();rc.setFromCamera(m,cam);for(const x of rc.intersectObjects(root.children,true)){const a=x.object.userData.act;if(a){a.g=a.g?0:1;return}}}
function wire(){const v=$('#h3v');let pts={},moved=0,pd=0;
 v.addEventListener('pointerdown',e=>{v.setPointerCapture&&v.setPointerCapture(e.pointerId);pts[e.pointerId]=[e.clientX,e.clientY];moved=0;const k=Object.values(pts);pd=k.length==2?Math.hypot(k[0][0]-k[1][0],k[0][1]-k[1][1]):0});
 v.addEventListener('pointermove',e=>{const p=pts[e.pointerId];if(!p)return;const dx=e.clientX-p[0],dy=e.clientY-p[1];pts[e.pointerId]=[e.clientX,e.clientY];const k=Object.values(pts);
  if(k.length==2){const d=Math.hypot(k[0][0]-k[1][0],k[0][1]-k[1][1]);if(pd)view.d=Math.max(view.fit*.35,Math.min(view.fit*2.6,view.d*pd/d));pd=d;moved=9;return}
  moved+=Math.abs(dx)+Math.abs(dy);view.y-=dx*.008;view.p=Math.max(-1.45,Math.min(1.45,view.p+dy*.006))});
 const up=e=>{const was=pts[e.pointerId];delete pts[e.pointerId];if(was&&moved<8&&mode==='try'&&e.type==='pointerup')pick(e)};v.addEventListener('pointerup',up);v.addEventListener('pointercancel',up);
 v.addEventListener('wheel',e=>{e.preventDefault();view.d=Math.max(view.fit*.35,Math.min(view.fit*2.6,view.d*(1+e.deltaY*.001)))},{passive:false});
 ov.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.id==='h3x'){closeOv();return}
  if(t.dataset.h3m){mode=t.dataset.h3m;acts.forEach(a=>a.g=0);panel();return}
  if(t.dataset.h3a!==undefined){acts.forEach(a=>a.g=+t.dataset.h3a);return}
  if(t.dataset.h3v){const m={f:[0,.1],s:[1.57,.1],b:[3.14,.1],t:[.01,1.45],u:[.01,-1.4]}[t.dataset.h3v];view.y=m[0];view.p=m[1]}})}
function closeOv(){if(ov)ov.hidden=true;document.body.style.overflow='';if(pushed){pushed=0;skip=1;try{history.back()}catch(_){window.hz3dOpen=0}}else window.hz3dOpen=0}
addEventListener('popstate',()=>{if(skip)skip=0;else if(ov&&!ov.hidden){ov.hidden=true;document.body.style.overflow='';pushed=0}setTimeout(()=>{window.hz3dOpen=0},0)});
async function open(k){kind=M[k]?k:'phone';mode='try';css();
 if(!ov){ov=document.createElement('div');ov.id='hz3d';ov.innerHTML='<div class="h3h"><button id="h3x" type="button" aria-label="إغلاق">✕</button><b id="h3t"></b><span style="width:40px"></span></div><div id="h3v"><p class="empty" style="padding:30px;text-align:center">جاري تحميل المعاينة…</p></div><div id="h3p"></div>';document.body.appendChild(ov);wire()}
 ov.hidden=false;document.body.style.overflow='hidden';window.hz3dOpen=1;if(!pushed){try{history.pushState({hz3d:1},'');pushed=1}catch(_){}}$('#h3t').textContent='معاينة: '+NAMES[kind];
 try{await loadT()}catch(_){$('#h3v').innerHTML='<p class="msg" style="padding:30px;text-align:center">محتاج إنترنت عشان تتحمّل المعاينة.</p>';return}
 T=window.THREE;const v=$('#h3v');
 if(!R){v.innerHTML='';R=new T.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(2,devicePixelRatio||1));v.appendChild(R.domElement);cvs=R.domElement;sc=new T.Scene();cam=new T.PerspectiveCamera(40,1,.05,100);sc.add(new T.HemisphereLight(0xffffff,0x667788,.95));const d=new T.DirectionalLight(0xffffff,.8);d.position.set(2,4,3);sc.add(d);addEventListener('resize',fit);loop()}
 else if(!v.contains(cvs)){v.innerHTML='';v.appendChild(cvs)}
 view.y=.5;view.p=.15;build();panel();fit();setTimeout(fit,60)}
window.hz3d={open,kinds:Object.keys(M),names:NAMES,_t:M};
})();
