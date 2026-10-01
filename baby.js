(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},pad=S.pad,ymd=S.ymd;
var KEY='lc_baby';
var D=S.get(KEY,null);
if(!D||!D.babies||!D.babies.length)D={babies:[{id:'b1',name:'아기'}],logs:[],gap:180,alarm:false,sleep:{}};
D.logs=D.logs||[];D.sleep=D.sleep||{};D.gap=D.gap||180;
function save(){S.set(KEY,D);if(window.LCSync)LCSync.kick('baby')}
var cur=D.babies[0].id,type='formula',day=new Date();
var TY={formula:['🍼','분유','ml'],breast:['🤱','모유','분'],food:['🥣','이유식','g'],diaper:['<svg class="dia" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 4.5h19v5.5c0 5.2-4.2 9-9.5 10C6.700 19 2.500 15.200 2.500 10z" fill="#fff" stroke="#4A90E2" stroke-width="1.6" stroke-linejoin="round"/><path d="M2.500 8.500h19" stroke="#4A90E2" stroke-width="1.4"/><circle cx="6" cy="6.500" r="1" fill="#F59E0B"/><circle cx="18" cy="6.500" r="1" fill="#F59E0B"/></svg>','기저귀',''],sleep:['😴','수면',''],temp:['🌡️','체온','℃'],med:['💊','투약',''],note:['📝','메모','']};
var WH={formula:[10,400,10,120],breast:[1,60,1,10],food:[5,300,5,50]};
var CHIPS={formula:[60,80,100,120,140,160,180],breast:[5,10,15,20],food:[30,50,80,100]};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function hm(t){var d=new Date(t);return pad(d.getHours())+':'+pad(d.getMinutes())}
function dur(ms){var m=Math.max(0,Math.round(ms/6e4)),h=Math.floor(m/60);return h?h+'시간'+(m%60?' '+m%60+'분':''):m+'분'}
function dtv(t){var d=new Date(t);return ymd(d)+'T'+pad(d.getHours())+':'+pad(d.getMinutes())}
function bname(id){var b=D.babies.filter(function(x){return x.id===id})[0];return b?b.name:''}
function mine(id){return D.logs.filter(function(l){return l.b===id}).sort(function(a,b){return b.t-a.t})}
function dayStart(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()}
// 아기 탭
function drawTabs(){
 $('btabs').innerHTML=D.babies.map(function(b){return '<button type="button" class="chip'+(b.id===cur?' on':'')+'" data-b="'+b.id+'">'+esc(b.name)+'</button>'}).join('')+'<button type="button" class="chip add" id="badd">＋ 아기 추가</button>'}
// 상태
function drawStatus(){
 var L=mine(cur),now=Date.now(),h='';
 var lf=L.filter(function(l){return l.k==='formula'||l.k==='breast'})[0];
 if(lf){var next=lf.t+D.gap*6e4,left=next-now;
  h+='<div class="hl">🍼 마지막 수유</div><div class="hb">'+dur(now-lf.t)+' 전</div><div class="hs">'+hm(lf.t)+' · '+TY[lf.k][1]+' '+lf.v+TY[lf.k][2]+'</div>';
  h+='<div class="hx">다음 수유 <b>'+hm(next)+'</b> · '+(left>0?dur(left)+' 남음':'<em>'+dur(-left)+' 지났어요</em>')+'</div>'}
 else h+='<div class="hl">🍼 수유</div><div class="hb">기록 없음</div><div class="hs">아래 분유 버튼을 눌러 첫 기록을 남겨보세요</div>';
 var sl=D.sleep[cur];
 if(sl)h+='<div class="hz">😴 자는 중 · <b>'+dur(now-sl)+'</b> ('+hm(sl)+' 시작)</div>';
 $('bstat').innerHTML=h;
 var st=$('bslt');if(st){st.className='qt'+(sl?' on':'');st.innerHTML='<span>'+(sl?'☀️':'😴')+'</span>'+(sl?'깼어요':'잠들었어요')+'<small>'+(sl?dur(now-sl)+' 째':'수면 시작')+'</small>'}}
// 입력폼
var flash='';
function drawForm(){
 var P=['formula','diaper'],O=['breast','food','temp','med','note'],sl=D.sleep[cur];
 $('btypes').innerHTML=P.map(function(k){return '<button type="button" class="qt'+(k===type?' on':'')+'" data-t="'+k+'"><span>'+TY[k][0]+'</span>'+TY[k][1]+'</button>'}).join('')+'<button type="button" class="qt" id="bslt" data-t="sleep"></button>';
 $('bmore').innerHTML=O.map(function(k){return '<button type="button" class="chip'+(k===type?' on':'')+'" data-t="'+k+'">'+TY[k][0]+' '+TY[k][1]+'</button>'}).join('');
 var h=flash?'<div class="ok">✓ '+flash+'</div>':'',u=TY[type][2];
 var tm='<details id="bdet"><summary>🕒 시간 바꾸기 (지금이 아니라면)</summary><input id="bt" type="datetime-local" value="'+dtv(Date.now())+'"></details>';
 if(type==='diaper'){h+='<label>기저귀 종류 (누르면 바로 기록)</label><div class="big d2" id="bdi"><button type="button" data-d="소변">💧<br>소변</button><button type="button" data-d="대변">💩<br>대변</button><button type="button" data-d="소변+대변">💧💩<br>둘 다</button></div>'+tm}
 else if(type==='med'||type==='note'){h+='<label for="bnote">'+(type==='med'?'약 이름·용량':'내용')+'</label><input id="bnote" maxlength="80" autocomplete="off">'+tm+'<button type="button" id="brec">'+TY[type][0]+' 기록하기</button>'}
 else{
  var last=mine(cur).filter(function(l){return l.k===type})[0],dv=type==='temp'?'36.5':last?last.v:'';
  if(CHIPS[type]){var W=WH[type],dd=last&&last.v>0?+last.v:W[3];dd=Math.min(W[1],Math.max(W[0],Math.round((dd-W[0])/W[2])*W[2]+W[0]));var it='';for(var q=W[0];q<=W[1];q+=W[2])it+='<div data-v="'+q+'">'+q+'<small>'+u+'</small></div>';
   h+='<label>'+TY[type][1]+' 양 ('+u+') · 위아래로 밀어서 정하세요</label><div class="whw"><div class="wh" id="bwh" data-d="'+dd+'">'+it+'</div><i></i></div><input id="bv" type="hidden" value="'+dd+'">'}
  else h+='<label for="bv">'+TY[type][1]+' ('+u+')</label>';
  if(!CHIPS[type])h+='<input id="bv" inputmode="decimal" value="'+dv+'" autocomplete="off">';
  if(type==='formula')h+='<details><summary>📝 메모 남기기</summary><input id="bnote" maxlength="40" placeholder="예: 다 먹음, 반 남김" autocomplete="off"></details>';
  h+=tm+'<button type="button" id="brec">'+TY[type][0]+' 기록하기</button>'}
 $('bfields').innerHTML=h;wheel();drawStatus()}
function wheel(){var w=$('bwh');if(!w)return;var H=44,dd=+w.getAttribute('data-d'),its=w.children,ix=0;for(var q=0;q<its.length;q++)if(+its[q].getAttribute('data-v')===dd)ix=q;
 w.scrollTop=ix*H;var t;function sync(){var k=Math.max(0,Math.min(its.length-1,Math.round(w.scrollTop/H)));$('bv').value=its[k].getAttribute('data-v');for(var q=0;q<its.length;q++)its[q].className=q===k?'on':''}
 sync();w.addEventListener('scroll',function(){clearTimeout(t);sync()});w.addEventListener('click',function(e){var d=e.target.closest('[data-v]');if(d)w.scrollTo({top:Array.prototype.indexOf.call(its,d)*H,behavior:'smooth'})})}
// 오늘 기록
function drawLog(){
 var s0=dayStart(day),s1=s0+864e5,L=mine(cur).filter(function(l){return l.t>=s0&&l.t<s1}).sort(function(a,b){return a.t-b.t});
 var isToday=dayStart(new Date())===s0;
 $('bdate').textContent=(day.getMonth()+1)+'월 '+day.getDate()+'일 ('+'일월화수목금토'[day.getDay()]+')'+(isToday?' · 오늘':'');
 var f=0,fc=0,bm=0,fd=0,pe=0,po=0,sl=0,mx=0;
 L.forEach(function(l){if(l.k==='formula'){f+=+l.v||0;fc++}if(l.k==='breast')bm+=+l.v||0;if(l.k==='food')fd+=+l.v||0;
  if(l.k==='diaper'){if(/소변/.test(l.v))pe++;if(/대변/.test(l.v))po++}if(l.k==='sleep')sl+=(+l.e||0)-l.t;if(l.k==='temp')mx=Math.max(mx,+l.v||0)});
 var sum=[['🍼 분유',f+'ml · '+fc+'회'],['<svg class="dia" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 4.5h19v5.5c0 5.2-4.2 9-9.5 10C6.700 19 2.500 15.200 2.500 10z" fill="#fff" stroke="#4A90E2" stroke-width="1.6" stroke-linejoin="round"/><path d="M2.500 8.500h19" stroke="#4A90E2" stroke-width="1.4"/><circle cx="6" cy="6.500" r="1" fill="#F59E0B"/><circle cx="18" cy="6.500" r="1" fill="#F59E0B"/></svg> 소변/대변',pe+' / '+po],['😴 수면',sl?dur(sl):'-']];
 if(bm)sum.push(['🤱 모유',bm+'분']);if(fd)sum.push(['🥣 이유식',fd+'g']);if(mx)sum.push(['🌡️ 체온',mx+'℃']);
 $('bsum').innerHTML=sum.map(function(x){return '<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>'}).join('');
 $('blog').innerHTML=L.length?L.map(function(l){var t=TY[l.k];
  var d=l.k==='sleep'?(l.e?dur(l.e-l.t)+' 잠':'자는 중'):l.k==='diaper'?l.v:l.k==='med'||l.k==='note'?esc(l.n||''):l.v+t[2];
  var sub=l.k==='sleep'&&l.e?hm(l.t)+' → '+hm(l.e):(l.n&&l.k!=='med'&&l.k!=='note'?esc(l.n):t[1]);
  return '<div class="lg"><span class="lt">'+hm(l.t)+'</span><span class="li k-'+l.k+'">'+t[0]+'</span><span class="ld"><b>'+d+'</b><small>'+sub+'</small></span><button type="button" class="x" data-x="'+l.id+'" aria-label="삭제">×</button></div>'}).join(''):'<p class="note">이 날의 기록이 없습니다.</p>';
 // 7일 분유 그래프
 var days=[],max=1;for(var i=6;i>=0;i--){var d0=dayStart(new Date(day.getFullYear(),day.getMonth(),day.getDate()-i)),v=0;
  mine(cur).forEach(function(l){if(l.k==='formula'&&l.t>=d0&&l.t<d0+864e5)v+=+l.v||0});days.push([new Date(d0),v]);max=Math.max(max,v)}
 $('bchart').innerHTML=days.map(function(x){return '<div class="bbar"><i style="height:'+Math.round(x[1]/max*100)+'%"></i><b>'+(x[1]||'')+'</b><span>'+(x[0].getMonth()+1)+'/'+x[0].getDate()+'</span></div>'}).join('')}
function all(){drawTabs();drawStatus();drawForm();drawLog();drawSet()}
function drawSet(){
 $('bgap').value=String(D.gap);$('bal').checked=!!D.alarm;
 $('bnames').innerHTML=D.babies.map(function(b){return '<div class="nm"><input data-n="'+b.id+'" value="'+esc(b.name)+'" maxlength="12" aria-label="아기 이름"><button type="button" class="sec" data-rm="'+b.id+'">삭제</button></div>'}).join('')}
// 이벤트
$('btabs').addEventListener('click',function(e){var b=e.target.closest('[data-b]');if(b){cur=b.getAttribute('data-b');all();return}
 if(e.target.id==='badd'){var n=prompt('아기 이름(애칭)을 입력하세요');if(n&&n.trim()){var id='b'+Date.now().toString(36);D.babies.push({id:id,name:n.trim().slice(0,12),_u:Date.now()});cur=id;save();all()}}});
function pick(e){var b=e.target.closest('[data-t]');if(!b)return;var t=b.getAttribute('data-t');if(t==='sleep'){toggleSleep();return}type=t;flash='';drawForm()}
$('btypes').addEventListener('click',pick);$('bmore').addEventListener('click',pick);
$('bfields').addEventListener('click',function(e){ var d=e.target.closest('[data-d]');if(d){rec(d.getAttribute('data-d'));return}
 if(e.target.id==='brec')rec()});
function rec(dv){
 var det=$('bdet'),t=det&&det.open?new Date($('bt').value).getTime():Date.now();if(isNaN(t))t=Date.now();
 var l={id:'l'+Date.now().toString(36)+Math.floor(Math.random()*1e4),b:cur,t:t,k:type},nt=$('bnote');
 if(type==='diaper')l.v=dv;
 else if(type==='med'||type==='note'){l.n=nt.value.trim();if(!l.n){nt.focus();return}}
 else{var v=parseFloat(($('bv').value||'').replace(',','.'));if(!(v>0)){$('bv').focus();return}
  if(type==='temp'&&(v<30||v>43)){alert('체온 값을 확인해 주세요 (예: 36.5)');return}l.v=v;if(nt&&nt.value.trim())l.n=nt.value.trim()}
 D.logs.push(l);day=new Date(t);
 if(type==='temp'&&l.v>=38)S.notify('🌡️ 체온 '+l.v+'℃','38℃ 이상이에요. 아기가 3개월 미만이거나 상태가 좋지 않으면 병원에 문의하세요.');
 flash=hm(t)+' '+TY[type][1]+' '+(l.v!==undefined?l.v+TY[type][2]:l.n||'')+' 기록했어요';
 save();all();flash=''}
function toggleSleep(){
 var s=D.sleep[cur],now=Date.now();
 if(s){D.logs.push({id:'l'+now.toString(36),b:cur,t:s,e:now,k:'sleep'});delete D.sleep[cur];day=new Date(s)}
 else D.sleep[cur]=now;
 save();all()}
$('blog').addEventListener('click',function(e){var x=e.target.closest('[data-x]');if(x&&confirm('이 기록을 삭제할까요?')){D.logs=D.logs.filter(function(l){return l.id!==x.getAttribute('data-x')});save();all()}});
$('bprev').onclick=function(){day=new Date(day.getFullYear(),day.getMonth(),day.getDate()-1);drawLog()};
$('bnext').onclick=function(){day=new Date(day.getFullYear(),day.getMonth(),day.getDate()+1);drawLog()};
$('bgap').onchange=function(){D.gap=+this.value;save();drawStatus()};
$('bal').onchange=function(){D.alarm=this.checked;save();if(this.checked)S.ask(function(p){$('bmsg').textContent=p==='granted'?'알림 허용됨. 이 페이지가 열려 있을 때 수유 시간에 알려줘요.':'브라우저 알림은 허용되지 않았어요. 화면 안 알림만 표시됩니다.'})};
$('bnames').addEventListener('change',function(e){var n=e.target.getAttribute('data-n');if(n){var b=D.babies.filter(function(x){return x.id===n})[0];b.name=(e.target.value.trim()||'아기').slice(0,12);b._u=Date.now();save();all()}});
$('bnames').addEventListener('click',function(e){var r=e.target.closest('[data-rm]');if(!r)return;
 if(D.babies.length<2){alert('아기는 최소 1명이 필요해요. 이름을 바꿔서 사용하세요.');return}
 var id=r.getAttribute('data-rm');if(confirm(bname(id)+'의 모든 기록을 삭제할까요?')){D.babies=D.babies.filter(function(b){return b.id!==id});D.logs=D.logs.filter(function(l){return l.b!==id});delete D.sleep[id];if(cur===id)cur=D.babies[0].id;save();all()}});
$('bcopy').onclick=function(){
 var s0=dayStart(day),L=mine(cur).filter(function(l){return l.t>=s0&&l.t<s0+864e5}).sort(function(a,b){return a.t-b.t});
 var t=bname(cur)+' '+(day.getMonth()+1)+'/'+day.getDate()+' 기록\n'+L.map(function(l){var y=TY[l.k];return hm(l.t)+' '+y[1]+' '+(l.k==='diaper'?l.v:l.k==='sleep'?(l.e?dur(l.e-l.t):'자는 중'):l.k==='med'||l.k==='note'?(l.n||''):l.v+y[2])}).join('\n');
 if(navigator.share&&/Mobi|Android/i.test(navigator.userAgent)){navigator.share({text:t}).catch(function(){})}
 else if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){S.notify('복사했어요','오늘 기록을 메신저에 붙여넣어 보내세요')},function(){alert(t)})}else alert(t)};
$('bexp').onclick=function(){if(!S.download('육아기록-백업.json',JSON.stringify(D),'application/json'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('bcsv').onclick=function(){var rows=['아기,날짜,시간,종류,값,메모'];D.logs.slice().sort(function(a,b){return a.t-b.t}).forEach(function(l){var d=new Date(l.t);rows.push([bname(l.b),ymd(d),hm(l.t),TY[l.k][1],l.k==='sleep'?(l.e?Math.round((l.e-l.t)/6e4)+'분':''):(l.v||''),(l.n||'').replace(/,/g,' ')].join(','))});
 if(!S.download('육아기록.csv','﻿'+rows.join('\n'),'text/csv'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('bimp').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||!Array.isArray(o.babies)||!o.babies.length)throw 0;
 if(confirm('백업 파일로 현재 육아 기록을 덮어쓸까요?')){D=o;D.logs=D.logs||[];D.sleep=D.sleep||{};D.gap=D.gap||180;cur=D.babies[0].id;save();all()}}catch(_){S.notify('불러오기 실패','육아 기록 백업 파일이 아닙니다.')}};r.readAsText(f);this.value=''};
// 수유 알림
function check(){
 if(!D.alarm)return;var F=S.get('lc_baby_fired',{}),now=Date.now(),ch=false;
 D.babies.forEach(function(b){var lf=mine(b.id).filter(function(l){return l.k==='formula'||l.k==='breast'})[0];
  if(lf&&now>=lf.t+D.gap*6e4&&now<lf.t+D.gap*6e4+3*36e5&&!F[lf.id]){F[lf.id]=now;ch=true;S.notify('🍼 '+b.name+' 수유 시간이에요','마지막 수유 '+hm(lf.t)+' · '+dur(now-lf.t)+' 지났어요')}});
 if(ch){var k={};Object.keys(F).forEach(function(x){if(now-F[x]<3*864e5)k[x]=F[x]});S.set('lc_baby_fired',k)}}
$('bshare').onclick=function(){var lim=Date.now()-30*864e5;S.share('baby','우리 아기 육아 기록',{babies:D.babies,logs:D.logs.filter(function(l){return l.t>=lim}),sleep:D.sleep})};
S.incoming('baby').then(function(o){if(!o||!o.babies)return;S.clearHash();
 var n=(o.logs||[]).filter(function(l){return !D.logs.some(function(x){return x.id===l.id})});
 if(confirm('공유받은 육아 기록을 합칠까요?\n(새 기록 '+n.length+'개 추가, 내 기록은 그대로 유지)')){
  o.babies.forEach(function(b){if(!D.babies.some(function(x){return x.id===b.id}))D.babies.push(b)});
  D.logs=D.logs.concat(n);save();all();S.notify('합치기 완료','기록 '+n.length+'개를 추가했어요')}});

if(window.LCSync&&$('bsync'))LCSync.mount($('bsync'),'baby',{
 get:function(){var lg={},bb={},sl={};D.logs.forEach(function(l){lg[l.id]=l});D.babies.forEach(function(x){bb[x.id]=x});Object.keys(D.sleep).forEach(function(k){sl[k]={t:D.sleep[k],_u:D.sleep[k]}});return {logs:lg,babies:bb,sleep:sl}},
 set:function(c,m){var ks=Object.keys(m);
  if(c==='logs')D.logs=ks.map(function(k){return m[k]});
  else if(c==='babies'){if(ks.length)D.babies=ks.map(function(k){return m[k]});if(!D.babies.some(function(x){return x.id===cur}))cur=D.babies[0].id}
  else if(c==='sleep'){D.sleep={};ks.forEach(function(k){D.sleep[k]=m[k].t})}},
 done:function(){S.set(KEY,D);all()}});
if(!S.persistent())$('bwarn').hidden=false;
all();check();setInterval(function(){drawStatus();check()},20000);
document.addEventListener('visibilitychange',function(){if(!document.hidden){drawStatus();check()}});
})();
