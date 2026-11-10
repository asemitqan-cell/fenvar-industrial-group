const SUPABASE_URL='https://zxeykzxoxylfsdnaimwk.supabase.co';
const SUPABASE_KEY='sb_publishable_5i-jel2xo4kqyHz707aWsA_RTaJuZzx';
const COMPANY_ID='910c5fe2-1add-4c9c-9f3c-4434bd43bc6a';
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id);
let currentView='overview';
const viewMeta={
 overview:['Overview','Business snapshot'],
 leads:['Lead Management','All incoming inquiries and follow-ups'],
 customers:['Customers','Your buyer and distributor directory'],
 opportunities:['Market Opportunities','Global buyer and sourcing pipeline'],
 offers:['Customer Offers','Commercial offers and approvals']
};
const esc=v=>String(v??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const val=id=>($(id)?.value||'').trim();
function msg(id,text){if($(id))$(id).textContent=text||''}
function showLogin(){$('loginPanel').hidden=false;$('appPanel').hidden=true;$('logout').hidden=true}
async function checkSession(){
 const{data:{session}}=await db.auth.getSession();
 if(!session){showLogin();return}
 const{data:profile,error}=await db.from('profiles').select('id,company_id,role,is_active,full_name').eq('id',session.user.id).maybeSingle();
 if(error||!profile||!profile.is_active||profile.company_id!==COMPANY_ID||!['owner','admin'].includes(profile.role)){
  await db.auth.signOut();showLogin();msg('loginMessage','This account is not authorized for this FENVAR workspace.');return;
 }
 $('userEmail').textContent=session.user.email||profile.full_name||'';
 $('loginPanel').hidden=true;$('appPanel').hidden=false;$('logout').hidden=false;
 await loadData();
}
async function count(table,filters=[]){
 let q=db.from(table).select('id',{count:'exact',head:true});
 filters.forEach(([k,v])=>q=q.eq(k,v));
 const{count,error}=await q;if(error)throw error;return count||0;
}
async function loadData(){
 msg('appMessage','Loading workspace…');
 try{
  const [leads,customers,opps,offers,approval]=await Promise.all([
   count('leads',[['company_id',COMPANY_ID]]),
   count('customers',[['company_id',COMPANY_ID]]),
   count('broker_opportunities',[['company_id',COMPANY_ID]]),
   count('broker_customer_offers'),
   count('broker_customer_offers',[['status','pending_approval']])
  ]);
  $('leadCount').textContent=leads;$('customerCount').textContent=customers;
  $('opportunityCount').textContent=opps;$('offerCount').textContent=offers;
  $('approvalCount').textContent=approval;
  await renderView(currentView);
  $('updatedAt').textContent='Updated '+new Date().toLocaleTimeString();
  msg('appMessage','');
 }catch(e){msg('appMessage','Could not load workspace data: '+e.message)}
}
function navTo(view){currentView=view;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===view));renderView(view).catch(e=>msg('appMessage',e.message))}
function tableHtml(columns,rows,actions=''){
 if(!rows?.length)return '<div class="empty">No records yet. Add the first record using the form above.</div>';
 return '<table><thead><tr>'+columns.map(c=>'<th>'+esc(c.label)+'</th>').join('')+(actions?'<th>Actions</th>':'')+'</tr></thead><tbody>'+
 rows.map(r=>'<tr>'+columns.map(c=>'<td>'+ (c.render?c.render(r):esc(r[c.key]))+'</td>').join('')+(actions?'<td>'+actions(r)+'</td>':'')+'</tr>').join('')+'</tbody></table>';
}
function field(label,id,placeholder='',type='text',required=false){
 return '<label class="field">'+esc(label)+'<input id="'+id+'" type="'+type+'" placeholder="'+esc(placeholder)+'" '+(required?'required':'')+'></label>';
}
function selectField(label,id,options){
 return '<label class="field">'+esc(label)+'<select id="'+id+'">'+options.map(o=>'<option value="'+esc(o[0])+'">'+esc(o[1])+'</option>').join('')+'</select></label>';
}
function actionForm(title,fields,button='Save record'){
 return '<form class="create-form" id="createForm"><div class="form-heading"><strong>'+title+'</strong><span>FENVAR workspace</span></div><div class="form-grid">'+fields.join('')+'</div><div class="form-bottom"><button class="primary" type="submit">'+button+'</button><span id="formMessage" class="message"></span></div></form>';
}
async function renderView(view){
 currentView=view;
 $('viewTitle').textContent=viewMeta[view][0];$('tableTitle').textContent=viewMeta[view][1];
 const wrap=$('tableWrap');wrap.innerHTML='<div class="empty">Loading records…</div>';
 if(view==='overview'){
  const{data,error}=await db.from('leads').select('name,company_name,email,country,interest,status,created_at').eq('company_id',COMPANY_ID).order('created_at',{ascending:false}).limit(8);
  if(error)throw error;
  wrap.innerHTML=tableHtml([{key:'name',label:'Contact'},{key:'company_name',label:'Company'},{key:'email',label:'Email'},{key:'country',label:'Country'},{key:'interest',label:'Interest'},{key:'status',label:'Status'},{key:'created_at',label:'Received',render:r=>r.created_at?new Date(r.created_at).toLocaleDateString():'—'}],data);
  $('viewActions').innerHTML='<p class="muted">Use the workspace sections to manage leads, customers, opportunities and commercial offers.</p>';
  return;
 }
 if(view==='leads'){
  $('viewActions').innerHTML=actionForm('Add a lead',[
   field('Contact name','fName','Full name','text',true),field('Company','fCompany','Company / importer'),
   field('Email','fEmail','name@company.com','email'),field('Phone / WhatsApp','fPhone','+20…'),
   field('Country','fCountry','Country'),field('City','fCity','City'),
   field('Product interest','fInterest','UPVC profiles / accessories'),selectField('Source','fSource',[['manual','Manual entry'],['website','Website'],['referral','Referral'],['linkedin','LinkedIn'],['trade_show','Trade show']])
  ]);
  const{data,error}=await db.from('leads').select('id,customer_id,name,company_name,email,phone,country,interest,status,follow_up_at,created_at').eq('company_id',COMPANY_ID).order('created_at',{ascending:false}).limit(100);
  if(error)throw error;
  wrap.innerHTML=tableHtml([
   {key:'name',label:'Contact'},{key:'company_name',label:'Company'},{key:'email',label:'Email'},{key:'phone',label:'Phone'},
   {key:'country',label:'Country'},{key:'interest',label:'Interest'},
   {key:'status',label:'Status',render:r=>'<select class="inline-select lead-status" data-id="'+r.id+'">'+['new','contacted','qualified','quoted','won','lost'].map(s=>'<option '+(r.status===s?'selected':'')+' value="'+s+'">'+s+'</option>').join('')+'</select>'},
   {key:'follow_up_at',label:'Follow-up',render:r=>'<input class="inline-date lead-followup" data-id="'+r.id+'" type="date" value="'+(r.follow_up_at?new Date(r.follow_up_at).toISOString().slice(0,10):'')+'">'}
  ],data,r=>r.customer_id?'<span class="muted">Customer linked</span>':'<button class="small-action convert-lead" data-id="'+r.id+'">Convert to customer</button>');
  return;
 }
 if(view==='customers'){
  $('viewActions').innerHTML=actionForm('Add a buyer / distributor',[
   field('Company / buyer name','cName','Legal or trading name','text',true),field('Contact person','cPerson','Contact name'),
   field('Email','cEmail','buyer@company.com','email'),field('Phone / WhatsApp','cPhone','International format'),
   field('Country','cCountry','Country'),field('City','cCity','City'),
   selectField('Customer type','cType',[['distributor','Distributor'],['manufacturer','Manufacturer'],['business','Business buyer'],['contractor','Contractor'],['exporter','Exporter']]),
   selectField('Status','cStatus',[['active','Active'],['lead','Lead'],['inactive','Inactive']])
  ]);
  const{data,error}=await db.from('customers').select('id,name,contact_person,email,phone,country,city,customer_type,status').eq('company_id',COMPANY_ID).order('created_at',{ascending:false}).limit(150);
  if(error)throw error;
  wrap.innerHTML=tableHtml([{key:'name',label:'Company'},{key:'contact_person',label:'Contact'},{key:'email',label:'Email'},{key:'phone',label:'Phone'},{key:'country',label:'Country'},{key:'city',label:'City'},{key:'customer_type',label:'Type'},{key:'status',label:'Status'}],data);
  return;
 }
 if(view==='opportunities'){
  $('viewActions').innerHTML=actionForm('Add a global market opportunity',[
   field('Buyer / company','oBuyer','Company name','text',true),field('Contact person','oContact','Contact name'),
   field('Email','oEmail','buyer@company.com','email'),field('Phone','oPhone','Phone / WhatsApp'),
   field('Country','oCountry','Country'),field('City','oCity','City'),
   field('Product required','oProduct','UPVC profiles','text',true),field('Source URL','oUrl','https://…','url'),
   selectField('Verification','oVerify',[['unverified','Unverified'],['needs_review','Needs review'],['verified','Verified'],['rejected','Rejected']]),
   selectField('Pipeline status','oStatus',[['new','New'],['qualified','Qualified'],['supplier_search','Supplier search'],['quoting','Quoting'],['offer_pending_approval','Offer pending approval'],['offered','Offered'],['won','Won'],['lost','Lost'],['rejected','Rejected'],['archived','Archived']])
  ]);
  const{data,error}=await db.from('broker_opportunities').select('id,buyer_name,buyer_company,buyer_email,country,product_name,verification_status,status,source_url,created_at').eq('company_id',COMPANY_ID).order('created_at',{ascending:false}).limit(150);
  if(error)throw error;
  wrap.innerHTML=tableHtml([
   {key:'buyer_company',label:'Buyer / Company'},{key:'buyer_name',label:'Contact'},{key:'buyer_email',label:'Email'},{key:'country',label:'Country'},
   {key:'product_name',label:'Product'},
   {key:'verification_status',label:'Verification',render:r=>'<select class="inline-select opportunity-verify" data-id="'+r.id+'">'+['unverified','needs_review','verified','rejected'].map(s=>'<option '+(r.verification_status===s?'selected':'')+' value="'+s+'">'+s+'</option>').join('')+'</select>'},
   {key:'status',label:'Pipeline',render:r=>'<select class="inline-select opportunity-status" data-id="'+r.id+'">'+['new','qualified','supplier_search','quoting','offer_pending_approval','offered','won','lost','rejected','archived'].map(s=>'<option '+(r.status===s?'selected':'')+' value="'+s+'">'+s+'</option>').join('')+'</select>'},
   {key:'source_url',label:'Source',render:r=>r.source_url?'<a href="'+esc(r.source_url)+'" target="_blank" rel="noopener">Open source ↗</a>':'—'}
  ],data,r=>'<button class="small-action log-contact" data-id="'+r.id+'">Log communication</button>');
  const comms=await db.from('broker_communications').select('id,opportunity_id,direction,party_type,channel,recipient,subject,body,created_at').order('created_at',{ascending:false}).limit(100);
  if(comms.error)throw comms.error;
  $('viewActions').innerHTML += '<form id="communicationForm" class="create-form"><div class="form-heading"><strong>Log buyer communication</strong><span>Internal record only — does not send a message</span></div><div class="form-grid">'+
   selectField('Buyer opportunity','mOpportunity',data.map(o=>[o.id,(o.buyer_company||o.buyer_name||'Buyer')+' — '+(o.country||'')]))+
   selectField('Direction','mDirection',[['outbound','Outbound'],['inbound','Inbound'],['internal','Internal note']])+
   selectField('Channel','mChannel',[['email','Email'],['whatsapp','WhatsApp'],['phone','Phone'],['linkedin','LinkedIn'],['internal','Internal']])+
   field('Subject','mSubject','Subject')+field('Recipient','mRecipient','Name or email')+
   '<label class="field">Message / notes<textarea id="mBody" rows="3" placeholder="Record the conversation or next step"></textarea></label></div><div class="form-bottom"><button class="primary" type="submit">Save communication</button><span id="commMessage" class="message"></span></div></form>'+
   '<div class="panel"><div class="panel-head"><h3>Recent communications</h3><span>Latest 100 records</span></div><div class="table-wrap">'+tableHtml([{key:'created_at',label:'Date',render:r=>new Date(r.created_at).toLocaleString()},{key:'recipient',label:'Recipient'},{key:'channel',label:'Channel'},{key:'direction',label:'Direction'},{key:'subject',label:'Subject'},{key:'body',label:'Notes'}],comms.data)+'</div></div>';
  return;
 }
 if(view==='offers'){
  const [oppRes,offerRes]=await Promise.all([
   db.from('broker_opportunities').select('id,buyer_name,buyer_company,buyer_email,buyer_phone,country,product_name').eq('company_id',COMPANY_ID).order('created_at',{ascending:false}),
   db.from('broker_customer_offers').select('id,opportunity_id,offer_number,customer_name,customer_company,customer_email,currency,supplier_cost,shipping_cost,other_costs,margin_type,margin_value,customer_total,status,validity_until,created_at').order('created_at',{ascending:false}).limit(100)
  ]);
  if(oppRes.error)throw oppRes.error;if(offerRes.error)throw offerRes.error;
  const opps=oppRes.data||[];
  $('viewActions').innerHTML=actionForm('Create a customer quotation',[
   selectField('Buyer opportunity','qOpportunity',opps.map(o=>[o.id,(o.buyer_company||o.buyer_name||'Buyer')+' — '+(o.country||'')+' / '+o.product_name])),
   field('Offer number','qNumber','FEN-2026-001'),field('Contact name','qName','Buyer contact'),field('Company','qCompany','Buyer company'),
   field('Email','qEmail','buyer@company.com','email'),field('Phone','qPhone','International phone'),
   field('Supplier cost','qSupplier','0','number'),field('Shipping cost','qShipping','0','number'),
   field('Other costs','qOther','0','number'),selectField('Margin type','qMarginType',[['percent','Percentage'],['fixed','Fixed amount']]),
   field('Margin value','qMargin','15','number'),selectField('Currency','qCurrency',[['USD','USD'],['EUR','EUR'],['GBP','GBP'],['AED','AED'],['SAR','SAR'],['EGP','EGP']]),
   field('Valid until','qValidity','','date'),field('Delivery terms','qDelivery','FOB / CIF / EXW'),field('Payment terms','qPayment','Advance / LC / TT')
  ],'Save draft quotation');
  $('viewActions').innerHTML+='<p class="muted">The total is calculated as supplier + shipping + other costs, plus the selected margin. New quotations are saved as drafts and are not sent to customers.</p>';
  wrap.innerHTML=tableHtml([
   {key:'offer_number',label:'Offer No.'},{key:'customer_name',label:'Contact'},{key:'customer_company',label:'Company'},
   {key:'customer_total',label:'Total',render:r=>Number(r.customer_total||0).toLocaleString(undefined,{maximumFractionDigits:2})+' '+r.currency},
   {key:'status',label:'Status',render:r=>'<select class="inline-select offer-status" data-id="'+r.id+'">'+['draft','pending_approval','approved','sent','accepted','rejected','expired','cancelled'].map(s=>'<option '+(r.status===s?'selected':'')+' value="'+s+'">'+s+'</option>').join('')+'</select>'},
   {key:'validity_until',label:'Valid until'}
  ],offerRes.data);
 }
}
$('loginForm').addEventListener('submit',async e=>{
 e.preventDefault();msg('loginMessage','Signing in…');
 const fd=new FormData(e.target);const{error}=await db.auth.signInWithPassword({email:fd.get('email'),password:fd.get('password')});
 if(error){msg('loginMessage',error.message);return}msg('loginMessage','');await checkSession();
});
$('logout').addEventListener('click',async()=>{await db.auth.signOut();showLogin()});
$('refresh').addEventListener('click',loadData);
document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>navTo(b.dataset.view)));
$('viewActions').addEventListener('submit',async e=>{
 if(e.target.id==='communicationForm'){
  e.preventDefault();msg('commMessage','Saving…');
  const{error}=await db.from('broker_communications').insert({opportunity_id:val('mOpportunity'),direction:val('mDirection'),party_type:'customer',channel:val('mChannel'),recipient:val('mRecipient')||null,subject:val('mSubject')||null,body:val('mBody')||null});
  if(error){msg('commMessage','Could not save: '+error.message);return}
  await renderView('opportunities');msg('appMessage','Communication record saved. No message was sent.');return;
 }
 if(e.target.id!=='createForm')return;e.preventDefault();msg('formMessage','Saving…');
 let table,payload;
 if(currentView==='leads'){
  table='leads';payload={company_id:COMPANY_ID,name:val('fName'),company_name:val('fCompany')||null,email:val('fEmail')||null,phone:val('fPhone')||null,country:val('fCountry')||null,city:val('fCity')||null,interest:val('fInterest')||null,source:val('fSource'),status:'new',message:'Added from FENVAR Control Center'};
 }else if(currentView==='customers'){
  table='customers';payload={company_id:COMPANY_ID,name:val('cName'),contact_person:val('cPerson')||null,email:val('cEmail')||null,phone:val('cPhone')||null,whatsapp:val('cPhone')||null,country:val('cCountry')||null,city:val('cCity')||null,customer_type:val('cType'),status:val('cStatus'),source:'admin'};
 }else if(currentView==='opportunities'){
  table='broker_opportunities';payload={company_id:COMPANY_ID,source_type:'manual',buyer_company:val('oBuyer'),buyer_name:val('oContact')||null,buyer_email:val('oEmail')||null,buyer_phone:val('oPhone')||null,country:val('oCountry')||null,city:val('oCity')||null,product_name:val('oProduct'),source_url:val('oUrl')||null,verification_status:val('oVerify'),status:val('oStatus')};
 }else if(currentView==='offers'){
  const base=Number(val('qSupplier')||0)+Number(val('qShipping')||0)+Number(val('qOther')||0);
  const margin=Number(val('qMargin')||0);
  if(!Number.isFinite(base)||!Number.isFinite(margin)||base<0||margin<0){msg('formMessage','Costs and margin must be valid non-negative numbers.');return}
  const total=base+(val('qMarginType')==='percent'?base*margin/100:margin);
  const offerNo=val('qNumber')||('FEN-'+new Date().getFullYear()+'-'+Date.now().toString().slice(-6));
  const opp=await db.from('broker_opportunities').select('id').eq('id',val('qOpportunity')).eq('company_id',COMPANY_ID).maybeSingle();
  if(opp.error||!opp.data){msg('formMessage','Select a valid FENVAR buyer opportunity first.');return}
  table='broker_customer_offers';payload={opportunity_id:val('qOpportunity'),offer_number:offerNo,customer_name:val('qName')||null,customer_company:val('qCompany')||null,customer_email:val('qEmail')||null,customer_phone:val('qPhone')||null,currency:val('qCurrency'),supplier_cost:Number(val('qSupplier')||0),shipping_cost:Number(val('qShipping')||0),other_costs:Number(val('qOther')||0),margin_type:val('qMarginType'),margin_value:margin,customer_total:Number(total.toFixed(2)),validity_until:val('qValidity')||null,delivery_terms:val('qDelivery')||null,payment_terms:val('qPayment')||null,status:'draft'};
 }else return;
 const{error}=await db.from(table).insert(payload);
 if(error){msg('formMessage','Could not save: '+error.message);return}
 await loadData();
});
$('tableWrap').addEventListener('click',async e=>{
 const btn=e.target.closest('.convert-lead');if(!btn)return;
 const id=btn.dataset.id;btn.disabled=true;btn.textContent='Converting…';
 const lead=await db.from('leads').select('*').eq('id',id).eq('company_id',COMPANY_ID).maybeSingle();
 if(lead.error||!lead.data){msg('appMessage','Could not load lead: '+(lead.error?.message||'not found'));btn.disabled=false;return}
 if(lead.data.customer_id){msg('appMessage','This lead is already linked to a customer.');await renderView('leads');return}
 const{data:customer,error}=await db.from('customers').insert({company_id:COMPANY_ID,name:lead.data.company_name||lead.data.name,contact_person:lead.data.name,phone:lead.data.phone,email:lead.data.email,country:lead.data.country,city:lead.data.city,customer_type:'business',status:'active',source:lead.data.source,notes:lead.data.message||lead.data.interest}).select('id').single();
 if(error){msg('appMessage','Customer creation failed: '+error.message);btn.disabled=false;return}
 const linked=await db.from('leads').update({customer_id:customer.id,status:'won',updated_at:new Date().toISOString()}).eq('id',id).eq('company_id',COMPANY_ID);
 if(linked.error){await db.from('customers').delete().eq('id',customer.id).eq('company_id',COMPANY_ID);msg('appMessage','Could not link lead; the new customer record was rolled back: '+linked.error.message);btn.disabled=false;return}
 msg('appMessage','Lead converted to a customer successfully.');await loadData();
});
$('tableWrap').addEventListener('change',async e=>{
 const el=e.target;if(!el.dataset.id)return;let result;
 if(el.classList.contains('lead-status'))result=await db.from('leads').update({status:el.value,updated_at:new Date().toISOString()}).eq('id',el.dataset.id).eq('company_id',COMPANY_ID);
 if(el.classList.contains('lead-followup'))result=await db.from('leads').update({follow_up_at:el.value?new Date(el.value+'T09:00:00').toISOString():null,updated_at:new Date().toISOString()}).eq('id',el.dataset.id).eq('company_id',COMPANY_ID);
 if(el.classList.contains('opportunity-status'))result=await db.from('broker_opportunities').update({status:el.value,updated_at:new Date().toISOString()}).eq('id',el.dataset.id).eq('company_id',COMPANY_ID);
 if(el.classList.contains('opportunity-verify'))result=await db.from('broker_opportunities').update({verification_status:el.value,updated_at:new Date().toISOString()}).eq('id',el.dataset.id).eq('company_id',COMPANY_ID);
 if(el.classList.contains('offer-status'))result=await db.from('broker_customer_offers').update({status:el.value,updated_at:new Date().toISOString(),...(el.value==='pending_approval'?{approval_requested_at:new Date().toISOString()}:{}),...(el.value==='approved'?{approved_at:new Date().toISOString()}:{}),...(el.value==='sent'?{sent_at:new Date().toISOString()}:{})}).eq('id',el.dataset.id);
 if(result){if(result.error)msg('appMessage','Update failed: '+result.error.message);else msg('appMessage','Record updated.')}
});
db.auth.onAuthStateChange(()=>{});
checkSession();
