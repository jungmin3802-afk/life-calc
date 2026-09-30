(function(){
var mem={};
window.LCStore={
 get:function(k,d){try{var v=localStorage.getItem(k);if(v)return JSON.parse(v)}catch(_){}
  return mem[k]!==undefined?JSON.parse(mem[k]):d},
 set:function(k,o){var s=JSON.stringify(o);mem[k]=s;try{localStorage.setItem(k,s)}catch(_){}},
 persistent:function(){try{localStorage.setItem('lc_t','1');localStorage.removeItem('lc_t');return true}catch(_){return false}},
 download:function(name,text,type){try{var b=new Blob([text],{type:type||'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);return true}catch(_){return false}},
 notify:function(title,body){
  var t=document.getElementById('lctoast');
  if(!t){t=document.createElement('div');t.id='lctoast';t.setAttribute('role','alert');document.body.appendChild(t)}
  var d=document.createElement('div');d.className='lct';d.innerHTML='<b></b><span></span><button type="button" aria-label="닫기">×</button>';
  d.children[0].textContent=title;d.children[1].textContent=body||'';d.children[2].onclick=function(){d.remove()};t.appendChild(d);
  try{if(navigator.vibrate&&navigator.userActivation&&navigator.userActivation.hasBeenActive)navigator.vibrate([200,100,200])}catch(_){}
  try{if('Notification' in window&&Notification.permission==='granted'){
   if(navigator.serviceWorker&&navigator.serviceWorker.ready){navigator.serviceWorker.ready.then(function(r){r.showNotification(title,{body:body||'',icon:'icon-192.png',tag:title+body})}).catch(function(){new Notification(title,{body:body||''})})}
   else new Notification(title,{body:body||''})}}catch(_){}},
 ask:function(cb){try{if(!('Notification' in window)){cb&&cb('unsupported');return}
  Notification.requestPermission().then(function(p){cb&&cb(p)})}catch(_){cb&&cb('unsupported')}},
 pad:function(n){return n<10?'0'+n:''+n},
 ymd:function(d){return d.getFullYear()+'-'+(d.getMonth()<9?'0':'')+(d.getMonth()+1)+'-'+(d.getDate()<10?'0':'')+d.getDate()}
};
})();
