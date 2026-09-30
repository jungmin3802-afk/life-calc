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
 ymd:function(d){return d.getFullYear()+'-'+(d.getMonth()<9?'0':'')+(d.getMonth()+1)+'-'+(d.getDate()<10?'0':'')+d.getDate()} ,
 enc:function(o){var t=JSON.stringify(o),u8=new TextEncoder().encode(t);
  function b64(a){var s='';for(var i=0;i<a.length;i+=8192)s+=String.fromCharCode.apply(null,a.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  if(typeof CompressionStream==='undefined')return Promise.resolve('p'+b64(u8));
  var cs=new Blob([u8]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return new Response(cs).arrayBuffer().then(function(b){return 'z'+b64(new Uint8Array(b))})},
 dec:function(str){function un(x){x=x.replace(/-/g,'+').replace(/_/g,'/');while(x.length%4)x+='=';var b=atob(x),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
  var m=str.charAt(0),a=un(str.slice(1));
  if(m==='p')return Promise.resolve(JSON.parse(new TextDecoder().decode(a)));
  var ds=new Blob([a]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Response(ds).arrayBuffer().then(function(b){return JSON.parse(new TextDecoder().decode(b))})},
 share:function(kind,title,obj){var self=this;
  return self.enc({k:kind,d:obj}).then(function(z){
   var url=location.href.split('#')[0]+'#s='+z;
   if(url.length>6000){self.notify('기록이 너무 많아요','링크로 보내기엔 커서 [백업 저장] 파일로 보내 주세요.');return}
   if(navigator.share&&/Mobi|Android/i.test(navigator.userAgent)){navigator.share({title:title,text:title+' - 링크를 열고 [합치기]를 눌러 주세요',url:url}).catch(function(){})}
   else if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){self.notify('공유 링크를 복사했어요','카톡·문자에 붙여넣어 보내세요')},function(){prompt('아래 링크를 복사해 보내세요',url)})}
   else prompt('아래 링크를 복사해 보내세요',url)})},
 incoming:function(kind){var m=/[#&]s=([^&]+)/.exec(location.hash||'');if(!m)return Promise.resolve(null);
  return this.dec(m[1]).then(function(o){return o&&o.k===kind?o.d:null}).catch(function(){return null})},
 clearHash:function(){try{history.replaceState(null,'',location.pathname+location.search)}catch(_){}}

};
})();
