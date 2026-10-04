(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},ymd=S.ymd,KEY='lc_steps';
var D=S.get(KEY,null);if(!D||!D.days)D={days:{},goal:8000,h:170,w:65};
var T=ymd(new Date()),run=false,wl=null,cnt=0;
function save(){S.set(KEY,D)}
function today(){return D.days[T]||0}
function nn(x){return Math.round(x).toLocaleString('ko-KR')}
function draw(){
 var n=today(),g=D.goal,p=Math.min(1,n/g),C=2*Math.PI*86;
 $('sring').setAttribute('stroke-dasharray',(C*p)+' '+C);
 $('snum').textContent=nn(n);$('sgoal').textContent='목표 '+nn(g)+'보 · '+Math.round(p*100)+'%';
 var stride=D.h*0.415/100,km=n*stride/1000,kcal=n*0.04*(D.w/70),min=n/100;
 $('skm').textContent=km.toFixed(2);$('skc').textContent=nn(kcal);$('smin').textContent=nn(min);
 $('sgs').querySelectorAll('button').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-g')===g)});
 $('sh').value=D.h;$('sw').value=D.w;
 var h='',mx=g;for(var i=6;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);var k=ymd(d);mx=Math.max(mx,D.days[k]||0)}
 for(i=6;i>=0;i--){d=new Date();d.setDate(d.getDate()-i);k=ymd(d);var v=D.days[k]||0;
  h+='<div class="sb"><b>'+(v?nn(v):'')+'</b><div class="sbi"><i class="'+(v>=g?'ok':'')+'" style="height:'+(v/mx*100)+'%"></i></div><span class="'+(i===0?'on':'')+'">'+'일월화수목금토'[d.getDay()]+'</span></div>'}
 $('sweek').innerHTML=h;
 $('sstart').textContent=run?'⏸ 측정 멈추기':'▶ 걸음 측정 시작';$('sstart').classList.toggle('on',run)}
function add(k){D.days[T]=Math.max(0,today()+k);save();draw()}
// 걸음 감지
var s=null,base=null,last=0,above=false,thr=1.6,buf=0,flush=0;
function onMotion(e){var a=e.accelerationIncludingGravity;if(!a||a.x==null)return;
 var m=Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z);
 if(s===null){s=m;base=m;return}
 s=s*0.7+m*0.3;base=base*0.98+s*0.02;var d=s-base,now=Date.now();
 if(!above&&d>thr&&now-last>300){above=true;last=now;buf++;D.days[T]=today()+1;
  if(now-flush>1000){flush=now;save();draw()}else $('snum').textContent=nn(today())}
 else if(above&&d<thr*0.4)above=false}
function start(){
 var go=function(){window.addEventListener('devicemotion',onMotion);run=true;s=null;
  if(navigator.wakeLock){navigator.wakeLock.request('screen').then(function(l){wl=l}).catch(function(){})}
  $('smsg').textContent='측정 중이에요. 화면을 켠 채로 걸어 보세요. 폰은 주머니나 손에 들고 걸으면 돼요.';draw()};
 if(typeof DeviceMotionEvent==='undefined'){$('smsg').textContent='이 기기·브라우저는 움직임 센서를 지원하지 않아요. 아래 직접 입력을 이용해 주세요.';return}
 if(typeof DeviceMotionEvent.requestPermission==='function'){DeviceMotionEvent.requestPermission().then(function(r){if(r==='granted')go();else $('smsg').textContent='움직임 센서 권한이 필요해요. 설정에서 허용해 주세요.'}).catch(function(){$('smsg').textContent='센서를 켜지 못했어요.'})}
 else go()}
function stop(){window.removeEventListener('devicemotion',onMotion);run=false;save();if(wl){try{wl.release()}catch(_){}wl=null}$('smsg').textContent='측정을 멈췄어요.';draw()}
$('sstart').onclick=function(){run?stop():start()};
document.addEventListener('visibilitychange',function(){if(document.hidden&&run){$('smsg').textContent='화면이 꺼지거나 다른 앱으로 가면 측정이 멈춰요.'}else if(!document.hidden&&run&&navigator.wakeLock){navigator.wakeLock.request('screen').then(function(l){wl=l}).catch(function(){})}});
$('sgs').addEventListener('click',function(e){var b=e.target.closest('[data-g]');if(b){D.goal=+b.getAttribute('data-g');save();draw()}});
$('sadd').addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(b)add(+b.getAttribute('data-a'))});
$('sset').onclick=function(){var v=parseInt($('sman').value.replace(/\D/g,''),10);if(isNaN(v))return;D.days[T]=v;save();draw();$('sman').value=''};
$('sh').onchange=function(){var v=parseFloat($('sh').value);if(v>100&&v<230){D.h=v;save();draw()}};
$('sw').onchange=function(){var v=parseFloat($('sw').value);if(v>20&&v<250){D.w=v;save();draw()}};
$('sreset').onclick=function(){if(confirm('오늘 걸음수를 0으로 되돌릴까요?')){D.days[T]=0;save();draw()}};
window.addEventListener('pagehide',save);
draw()})();
