(function(){
var S=window.LCStore;
var DB=(function(){try{return localStorage.getItem('lc_db')||''}catch(_){return ''}})()||'__DB_URL__';
if(DB.indexOf('__')===0)DB='';
DB=DB.replace(/\/+$/,'');
var AL='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newCode(){var a=new Uint8Array(12),s='';(window.crypto||window.msCrypto).getRandomValues(a);for(var i=0;i<12;i++)s+=AL.charAt(a[i]%32);return s}
function norm(c){return String(c||'').toUpperCase().replace(/[^A-Z0-9]/g,'')}
function fmt(c){return c.replace(/(.{4})(?=.)/g,'$1-')}
function room(){return S.get('lc_room',null)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var mods={},busy={};
function url(mod,coll){return DB+'/rooms/'+room()+'/'+mod+(coll?'/'+coll:'')+'.json'}
function synced(mod,coll){return S.get('lc_sy_'+mod+'_'+coll,{})}
function tick(mod){
 var A=mods[mod];if(!A||!DB||!room()||busy[mod])return Promise.resolve();busy[mod]=1;
 return fetch(url(mod),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(rem){
  rem=rem||{};var local=A.get(),changed=false,any=false,jobs=[];
  Object.keys(local).forEach(function(coll){
   var L=local[coll],R=rem[coll]||{},Sy=synced(mod,coll),patch={},np={},newL={};
   Object.keys(L).forEach(function(id){newL[id]=L[id]});
   Object.keys(L).forEach(function(id){
    if(!(id in R)){ if(Sy[id]){delete newL[id];changed=true} else patch[id]=L[id] }
    else if(JSON.stringify(L[id])!==JSON.stringify(R[id])){var lu=(L[id]&&L[id]._u)||0,ru=(R[id]&&R[id]._u)||0;
     if(ru>lu){newL[id]=R[id];changed=true}else if(lu>ru)patch[id]=L[id]}});
   Object.keys(R).forEach(function(id){
    if(!(id in L)){ if(Sy[id])patch[id]=null; else{newL[id]=R[id];changed=true} }});
   Object.keys(newL).forEach(function(id){np[id]=1});
   Object.keys(patch).forEach(function(id){if(patch[id]!==null)np[id]=1});
   if(Object.keys(patch).length){any=true;jobs.push(fetch(url(mod,coll),{method:'PATCH',body:JSON.stringify(patch)}).then(function(r){if(!r.ok)throw 0}))}
   if(changed)A.set(coll,newL);
   S.set('lc_sy_'+mod+'_'+coll,np)});
  if(changed&&A.done)A.done();
  return Promise.all(jobs).then(function(){S.set('lc_sy_last',Date.now());status(true)})
 }).catch(function(){status(false)}).then(function(){busy[mod]=0})}
var stEl=[];
function status(ok){stEl.forEach(function(el){var t=S.get('lc_sy_last',0);el.textContent=ok===false?'⚠️ 연결 확인 중… (인터넷 상태를 확인해 주세요)':'✅ 연결됨 · '+(t?new Date(t).toTimeString().slice(0,5)+' 동기화':'동기화 중')})}
function all(){Object.keys(mods).forEach(tick)}
function mount(el,mod,A){
 mods[mod]=A;
 function draw(){var r=room();
  if(!DB){el.innerHTML='<h3 class="hh" style="margin-top:0">👨‍👩‍👧 가족 연동</h3><p class="note">가족 연동은 준비 중이에요.</p>';return}
  if(!r){el.innerHTML='<h3 class="hh" style="margin-top:0">👨‍👩‍👧 가족 연동</h3><p class="note">같은 가족 코드를 입력하면 일정과 육아기록이 서로에게 자동으로 보여요. 로그인은 필요 없어요.</p><button type="button" class="sh" data-a="new">✨ 새 가족 코드 만들기</button><label for="syc">이미 코드가 있어요</label><input id="syc" maxlength="16" placeholder="예: ABCD-EFGH-JKLM" autocomplete="off" autocapitalize="characters"><button type="button" class="sec" data-a="join" style="margin-top:8px;width:100%">코드로 연결하기</button>';return}
  el.innerHTML='<h3 class="hh" style="margin-top:0">👨‍👩‍👧 가족 연동</h3><div class="syc">'+esc(fmt(r))+'</div><p class="note syst">동기화 중</p><p class="note">이 코드를 아는 사람은 누구나 일정·육아기록을 볼 수 있어요. 가족에게만 알려 주세요.</p><div class="btnrow"><button type="button" class="sec" data-a="copy">코드 복사</button><button type="button" class="sec" data-a="link">링크 보내기</button><button type="button" class="sec" data-a="off">연결 끊기</button></div>';
  var s=el.querySelector('.syst');if(s){stEl=stEl.filter(function(x){return document.body.contains(x)});stEl.push(s);status(true)}}
 el.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.getAttribute('data-a');
  if(a==='new'){S.set('lc_room',newCode());draw();all()}
  else if(a==='join'){var c=norm(document.getElementById('syc').value);if(c.length<10){S.notify('코드를 확인해 주세요','12자리 코드를 입력해 주세요.');return}S.set('lc_room',c);draw();all()}
  else if(a==='copy'){var t=fmt(room());if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){S.notify('복사했어요',t)},function(){prompt('코드를 복사하세요',t)});else prompt('코드를 복사하세요',t)}
  else if(a==='link'){var u=location.origin+'/index.html#room='+room(),m='우리 가족 일정·육아기록 연동 링크예요. 열어서 [연결]을 눌러 주세요.';
   if(navigator.share&&/Mobi|Android/i.test(navigator.userAgent))navigator.share({title:'가족 연동',text:m,url:u}).catch(function(){});
   else if(navigator.clipboard)navigator.clipboard.writeText(u).then(function(){S.notify('링크를 복사했어요','가족에게 붙여넣어 보내세요')},function(){prompt('링크를 복사하세요',u)});else prompt('링크를 복사하세요',u)}
  else if(a==='off'){if(confirm('연결을 끊을까요? 이 폰의 기록은 그대로 남아요.')){try{localStorage.removeItem('lc_room')}catch(_){}S.set('lc_room',null);['baby_logs','baby_babies','baby_sleep','cal_events'].forEach(function(k){S.set('lc_sy_'+k,{})});draw()}}});
 draw();tick(mod)}
// 링크로 들어온 경우
function fromLink(){var m=/[#&]room=([A-Za-z0-9-]+)/.exec(location.hash||'');if(!m||!DB)return;var c=norm(m[1]);if(c.length<10)return;
 try{history.replaceState(null,'',location.pathname+location.search)}catch(_){}
 if(room()===c)return;
 if(confirm('가족 코드 '+fmt(c)+'로 연결할까요?\n연결하면 서로의 일정·육아기록이 함께 보여요.')){S.set('lc_room',c);S.notify('연결했어요','달력이나 육아기록 화면에서 확인하세요');all()}}
window.LCSync={mount:mount,kick:function(m){setTimeout(function(){tick(m)},50)},on:function(){return !!(DB&&room())}};
fromLink();
setInterval(all,5000);document.addEventListener('visibilitychange',function(){if(!document.hidden)all()});
})();
