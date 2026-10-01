(function(){
var K='lc_tm',$=function(i){return document.getElementById(i)};
var S={run:false,end:0,left:0,tot:300};
try{var o=JSON.parse(localStorage.getItem(K)||'null');if(o&&typeof o.tot==='number')S=o}catch(_){}
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(_){}}
function p2(n){return n<10?'0'+n:''+n}
var H=44,cols={h:$('twh'),m:$('twm'),s:$('tws')},max={h:23,m:59,s:59};
Object.keys(cols).forEach(function(k){var h='';for(var i=0;i<=max[k];i++)h+='<div data-v="'+i+'">'+p2(i)+'</div>';cols[k].innerHTML=h;
 cols[k].addEventListener('scroll',function(){var i=Math.max(0,Math.min(max[k],Math.round(cols[k].scrollTop/H)));hl(k,i);S.tot=get();save()})});
function hl(k,i){var c=cols[k].children;for(var q=0;q<c.length;q++)c[q].className=q===i?'on':''}
function get(){return ['h','m','s'].reduce(function(a,k){var i=Math.round(cols[k].scrollTop/H);return a*(k==='h'?1:1)+(k==='h'?i*3600:k==='m'?i*60:i)},0)}
function set(t){t=Math.max(0,Math.min(86399,t|0));var v={h:Math.floor(t/3600),m:Math.floor(t/60)%60,s:t%60};Object.keys(v).forEach(function(k){cols[k].scrollTop=v[k]*H;hl(k,v[k])})}
function fmt(ms){var s=Math.ceil(ms/1000),h=Math.floor(s/3600),m=Math.floor(s/60)%60;return (h?h+':'+p2(m):p2(m))+':'+p2(s%60)}
var raf=0,wl=null,ac=null,fin=false;
function lock(on){try{if(on&&navigator.wakeLock)navigator.wakeLock.request('screen').then(function(l){wl=l}).catch(function(){});else if(wl){wl.release();wl=null}}catch(_){}}
function beep(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();var t=ac.currentTime;for(var i=0;i<6;i++){var o=ac.createOscillator(),g=ac.createGain();o.frequency.value=i%2?880:1040;o.connect(g);g.connect(ac.destination);g.gain.setValueAtTime(.0001,t+i*.5);g.gain.exponentialRampToValueAtTime(.4,t+i*.5+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*.5+.4);o.start(t+i*.5);o.stop(t+i*.5+.45)}}catch(_){}}
var rep=0;
function done(){fin=true;S.run=false;S.left=0;save();lock(false);$('tmo').hidden=false;beep();if(navigator.vibrate)try{navigator.vibrate([400,200,400,200,400])}catch(_){}
 clearInterval(rep);rep=setInterval(function(){if($('tmo').hidden){clearInterval(rep);return}beep();if(navigator.vibrate)try{navigator.vibrate([400,200,400])}catch(_){}},4000);
 try{document.title='⏰ 시간이 다 됐어요'}catch(_){}ui()}
function remain(){return S.run?S.end-Date.now():S.left}
function tick(){var r=remain();if(S.run&&r<=0){done();return}$('tmd').textContent=fmt(Math.max(0,r));if(S.run)raf=requestAnimationFrame(tick)}
function ui(){var run=S.run,paused=!run&&S.left>0;$('tmd').hidden=!(run||paused);$('twr').hidden=run||paused;$('tq').hidden=run||paused;
 $('tms').textContent=run?'정지':paused?'계속':'시작';$('tms').className='swy'+(run?' on':'');$('tmr').disabled=!run&&!paused}
$('tms').onclick=function(){
 try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume()}catch(_){}
 if(S.run){S.left=S.end-Date.now();S.run=false;cancelAnimationFrame(raf);lock(false)}
 else{var t=S.left>0?S.left:get()*1000;if(t<=0)return;S.end=Date.now()+t;S.run=true;S.left=0;lock(true);try{document.title='타이머'}catch(_){}}
 save();ui();tick()};
$('tmr').onclick=function(){S.run=false;S.left=0;cancelAnimationFrame(raf);lock(false);save();ui();set(S.tot)};
$('tq').addEventListener('click',function(e){var b=e.target.closest('[data-s]');if(!b)return;set(+b.getAttribute('data-s'));S.tot=get();save()});
$('tmok').onclick=function(){$('tmo').hidden=true;clearInterval(rep);fin=false;try{document.title='타이머'}catch(_){}ui();set(S.tot)};
set(S.tot);ui();tick();
if(S.run){if(S.end<=Date.now()){done()}else lock(true)}
document.addEventListener('visibilitychange',function(){if(!document.hidden&&S.run){lock(true);tick()}});
})();
