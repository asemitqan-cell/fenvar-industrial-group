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
  const{data,error}=await db.from('leads').select('id,name,company_name,email,phone,country,interest,status,follow_up_at,created_at').eq('company_id',COMPANY_ID).order('created_at',{ascending:false}).limit(100);
  if(error)throw error;
  wrap.innerHTML=tableHtml([
   {key:'name',label:'Contact'},{key:'company_name',label:'Company'},{key:'email',label:'Email'},{key:'phone',label:'Phone'},
   {key:'country',label:'Country'},{key:'interest',label:'Interest'},
   {key:'status',label:'Status',render:r=>'<select class="inline-select lead-status" data-id="'+r.id+'">'+['new','contacted','qualified','quoted','won','lost'].map(s=>'<option '+(r.status===s?'selected':'')+' value="'+s+'">'+s+'</option>').join('')+'</select>'},
   {key:'follow_up_at',label:'Follow-up',render:r=>'<input class="inline-date lead-followup" data-id="'+r.id+'" type="date" value="'+(r.follow_up_at?new Date(r.follow_up_at).toISOString().slice(0,10):'')+'">'}
  ],data);
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
   {key:'product_name',label:'Product'},{key:'verification_status',label:'Verification'},
   {key:'status',label:'Pipeline'},{key:'source_url',label:'Source',render:r=>r.source_url?'<a href="'+esc(r.source_url)+'" target="_blank" rel="noopener">Open source ↗</a>':'—'}
  ],data);
  return;
 }
 if(view==='offers'){
  const{data,error}=await db.from('broker_customer_offers').select('offer_number,customer_name,customer_company,currency,customer_total,status,validity_until,created_at').order('created_at',{ascending:false}).limit(100);
  if(error)throw error;
  $('viewActions').innerHTML='<p class="muted">Offers are linked to a market opportunity. The approval and quotation workflow will be added after the buyer pipeline is populated.</p>';
  wrap.innerHTML=tableHtml([{key:'offer_number',label:'Offer No.'},{key:'customer_name',label:'Contact'},{key:'customer_company',label:'Company'},{key:'customer_total',label:'Total'},{key:'currency',label:'Currency'},{key:'status',label:'Status'},{key:'validity_until',label:'Valid until'}],data);
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
 if(e.target.id!=='createForm')return;e.preventDefault();msg('formMessage','Saving…');
 let table,payload;
 if(currentView==='leads'){
  table='leads';payload={company_id:COMPANY_ID,name:val('fName'),company_name:val('fCompany')||null,email:val('fEmail')||null,phone:val('fPhone')||null,country:val('fCountry')||null,city:val('fCity')||null,interest:val('fInterest')||null,source:val('fSource'),status:'new',message:'Added from FENVAR Control Center'};
 }else if(currentView==='customers'){
  table='customers';payload={company_id:COMPANY_ID,name:val('cName'),contact_person:val('cPerson')||null,email:val('cEmail')||null,phone:val('cPhone')||null,whatsapp:val('cPhone')||null,country:val('cCountry')||null,city:val('cCity')||null,customer_type:val('cType'),status:val('cStatus'),source:'admin'};
 }else if(currentView==='opportunities'){
  table='broker_opportunities';payload={company_id:COMPANY_ID,source_type:'manual',buyer_company:val('oBuyer'),buyer_name:val('oContact')||null,buyer_email:val('oEmail')||null,buyer_phone:val('oPhone')||null,country:val('oCountry')||null,city:val('oCity')||null,product_name:val('oProduct'),source_url:val('oUrl')||null,verification_status:val('oVerify'),status:val('oStatus')};
 }else return;
 const{error}=await db.from(table).insert(payload);
 if(error){msg('formMessage','Could not save: '+error.message);return}
 await loadData();
});
$('tableWrap').addEventListener('change',async e=>{
 const el=e.target;if(!el.dataset.id)return;
 if(el.classList.contains('lead-status')){
  const{error}=await db.from('leads').update({status:el.value,updated_at:new Date().toISOString()}).eq('id',el.dataset.id).eq('company_id',COMPANY_ID);
  if(error)msg('appMessage','Status update failed: '+error.message);else msg('appMessage','Lead status updated.');
 }
 if(el.classList.contains('lead-followup')){
  const{error}=await db.from('leads').update({follow_up_at:el.value?new Date(el.value+'T09:00:00').toISOString():null,updated_at:new Date().toISOString()}).eq('id',el.dataset.id).eq('company_id',COMPANY_ID);
  if(error)msg('appMessage','Follow-up update failed: '+error.message);else msg('appMessage','Follow-up date saved.');
 }
});
db.auth.onAuthStateChange(()=>{});
checkSession();
