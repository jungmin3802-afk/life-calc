(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},pad=S.pad,ymd=S.ymd;
var KEY='lc_baby';
var D=S.get(KEY,null);
if(!D||!D.babies||!D.babies.length)D={babies:[{id:'b1',name:'아기'}],logs:[],gap:180,alarm:false,sleep:{}};
D.logs=D.logs||[];D.sleep=D.sleep||{};D.gap=D.gap||180;
function save(){S.set(KEY,D)}
var cur=D.babies[0].id,type='formula',day=new Date();
var TY={formula:['🍼','분유','ml'],breast:['🤱','모유','분'],food:['🥣','이유식','g'],diaper:['🧷','기저귀',''],sleep:['😴','수면',''],temp:['🌡️','체온','℃'],med:['💊','투약',''],note:['📝','메모','']};
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
  h+='<div class="st"><span>마지막 수유</span><b>'+dur(now-lf.t)+' 전</b><small>'+hm(lf.t)+' · '+TY[lf.k][1]+' '+lf.v+TY[lf.k][2]+'</small></div>';
  h+='<div class="st"><span>다음 수유 예정</span><b>'+hm(next)+'</b><small>'+(left>0?dur(left)+' 남음':'<em>'+dur(-left)+' 지났어요</em>')+'</small></div>'}
 else h+='<div class="st"><span>수유 기록</span><b>아직 없어요</b><small>아래에서 첫 기록을 남겨보세요</small></div>';
 var sl=D.sleep[cur];
 if(sl)h+='<div class="st sl"><span>😴 자는 중</span><b>'+dur(now-sl)+'</b><small>'+hm(sl)+' 시작</small></div>';
 $('bstat').innerHTML=h;
 $('bsleepbtn').textContent=sl?'☀️ 깼어요 (수면 종료)':'😴 잠들었어요 (수면 시작)'}
// 입력폼
function drawForm(){
 $('btypes').innerHTML=Object.keys(TY).map(function(k){return '<button type="button" class="tp'+(k===type?' on':'')+'" data-t="'+k+'"><span>'+TY[k][0]+'</span>'+TY[k][1]+'</button>'}).join('');
 var h='',u=TY[type][2];
 $('bsleepbox').hidden=type!=='sleep';$('bfields').hidden=type==='sleep';
 if(type==='diaper'){h+='<label>종류</label><div class="seg" id="bdi"><button type="button" data-v="소변" class="on">💧 소변</button><button type="button" data-v="대변">💩 대변</button><button type="button" data-v="소변+대변">둘 다</button></div>'}
 else if(type==='med'||type==='note'){h+='<label for="bnote">'+(type==='med'?'약 이름·용량':'내용')+'</label><input id="bnote" maxlength="80" autocomplete="off">'}
 else if(type!=='sleep'){
  var last=mine(cur).filter(function(l){return l.k===type})[0],dv=type==='temp'?'36.5':last?last.v:'';
  h+='<label for="bv">'+TY[type][1]+' ('+u+')</label><input id="bv" inputmode="decimal" value="'+dv+'" autocomplete="off">';
  if(CHIPS[type])h+='<div class="chips">'+CHIPS[type].map(function(c){return '<button type="button" class="chip" data-c="'+c+'">'+c+'</button>'}).join('')+'</div>';
  if(type==='formula')h+='<label for="bnote">메모 (선택)</label><input id="bnote" maxlength="40" placeholder="예: 다 먹음, 반 남김" autocomplete="off">'}
 if(type!=='sleep')h+='<label for="bt">시간</label><input id="bt" type="datetime-local" value="'+dtv(Date.now())+'"><button type="button" id="brec">'+TY[type][0]+' 기록하기</button>';
 $('bfields').innerHTML=h}
// 오늘 기록
function drawLog(){
 var s0=dayStart(day),s1=s0+864e5,L=mine(cur).filter(function(l){return l.t>=s0&&l.t<s1}).sort(function(a,b){return a.t-b.t});
 var isToday=dayStart(new Date())===s0;
 $('bdate').textContent=(day.getMonth()+1)+'월 '+day.getDate()+'일 ('+'일월화수목금토'[day.getDay()]+')'+(isToday?' · 오늘':'');
 var f=0,fc=0,bm=0,fd=0,pe=0,po=0,sl=0,mx=0;
 L.forEach(function(l){if(l.k==='formula'){f+=+l.v||0;fc++}if(l.k==='breast')bm+=+l.v||0;if(l.k==='food')fd+=+l.v||0;
  if(l.k==='diaper'){if(/소변/.test(l.v))pe++;if(/대변/.test(l.v))po++}if(l.k==='sleep')sl+=(+l.e||0)-l.t;if(l.k==='temp')mx=Math.max(mx,+l.v||0)});
 var sum=[['🍼 분유',f+'ml ('+fc+'회)'],['🤱 모유',bm+'분'],['🥣 이유식',fd+'g'],['💧 소변 / 💩 대변',pe+'회 / '+po+'회'],['😴 수면',dur(sl)]];
 if(mx)sum.push(['🌡️ 최고 체온',mx+'℃']);
 $('bsum').innerHTML=sum.map(function(x){return '<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>'}).join('');
 $('blog').innerHTML=L.length?L.map(function(l){var t=TY[l.k];
  var d=l.k==='sleep'?(l.e?hm(l.t)+' → '+hm(l.e)+' ('+dur(l.e-l.t)+')':hm(l.t)+' → 자는 중'):l.k==='diaper'?l.v:l.k==='med'||l.k==='note'?esc(l.n||''):l.v+t[2]+(l.n?' · '+esc(l.n):'');
  return '<div class="lg"><span class="lt">'+(l.k==='sleep'?hm(l.t):hm(l.t))+'</span><span class="li">'+t[0]+'</span><span class="ld"><b>'+t[1]+'</b> '+d+'</span><button type="button" class="x" data-x="'+l.id+'" aria-label="삭제">×</button></div>'}).join(''):'<p class="note">이 날의 기록이 없습니다.</p>';
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
 if(e.target.id==='badd'){var n=prompt('아기 이름(애칭)을 입력하세요');if(n&&n.trim()){var id='b'+Date.now().toString(36);D.babies.push({id:id,name:n.trim().slice(0,12)});cur=id;save();all()}}});
$('btypes').addEventListener('click',function(e){var b=e.target.closest('[data-t]');if(b){type=b.getAttribute('data-t');drawForm()}});
$('bfields').addEventListener('click',function(e){var c=e.target.closest('[data-c]');if(c){$('bv').value=c.getAttribute('data-c');return}
 var sg=e.target.closest('#bdi button');if(sg){[].forEach.call(sg.parentNode.children,function(x){x.classList.remove('on')});sg.classList.add('on');return}
 if(e.target.id==='brec')rec()});
function rec(){
 var t=new Date($('bt').value).getTime();if(isNaN(t))t=Date.now();
 var l={id:'l'+Date.now().toString(36)+Math.floor(Math.random()*1e4),b:cur,t:t,k:type},nt=$('bnote');
 if(type==='diaper')l.v=document.querySelector('#bdi .on').getAttribute('data-v');
 else if(type==='med'||type==='note'){l.n=nt.value.trim();if(!l.n){nt.focus();return}}
 else{var v=parseFloat(($('bv').value||'').replace(',','.'));if(!(v>0)){$('bv').focus();return}
  if(type==='temp'&&(v<30||v>43)){alert('체온 값을 확인해 주세요 (예: 36.5)');return}l.v=v;if(nt&&nt.value.trim())l.n=nt.value.trim()}
 D.logs.push(l);day=new Date(t);
 if(type==='temp'&&l.v>=38)S.notify('🌡️ 체온 '+l.v+'℃','38℃ 이상이에요. 아기가 3개월 미만이거나 상태가 좋지 않으면 병원에 문의하세요.');
 save();all()}
$('bsleepbtn').onclick=function(){
 var s=D.sleep[cur],now=Date.now();
 if(s){D.logs.push({id:'l'+now.toString(36),b:cur,t:s,e:now,k:'sleep'});delete D.sleep[cur];day=new Date(s)}
 else D.sleep[cur]=now;
 save();all()};
$('blog').addEventListener('click',function(e){var x=e.target.closest('[data-x]');if(x&&confirm('이 기록을 삭제할까요?')){D.logs=D.logs.filter(function(l){return l.id!==x.getAttribute('data-x')});save();all()}});
$('bprev').onclick=function(){day=new Date(day.getFullYear(),day.getMonth(),day.getDate()-1);drawLog()};
$('bnext').onclick=function(){day=new Date(day.getFullYear(),day.getMonth(),day.getDate()+1);drawLog()};
$('bgap').onchange=function(){D.gap=+this.value;save();drawStatus()};
$('bal').onchange=function(){D.alarm=this.checked;save();if(this.checked)S.ask(function(p){$('bmsg').textContent=p==='granted'?'알림 허용됨. 이 페이지가 열려 있을 때 수유 시간에 알려줘요.':'브라우저 알림은 허용되지 않았어요. 화면 안 알림만 표시됩니다.'})};
$('bnames').addEventListener('change',function(e){var n=e.target.getAttribute('data-n');if(n){var b=D.babies.filter(function(x){return x.id===n})[0];b.name=(e.target.value.trim()||'아기').slice(0,12);save();all()}});
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
if(!S.persistent())$('bwarn').hidden=false;
all();check();setInterval(function(){drawStatus();check()},20000);
document.addEventListener('visibilitychange',function(){if(!document.hidden){drawStatus();check()}});
})();
