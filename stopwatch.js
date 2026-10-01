(function(){
var K='lc_sw',$=function(i){return document.getElementById(i)};
var S={run:false,t0:0,acc:0,laps:[]};
try{var o=JSON.parse(localStorage.getItem(K)||'null');if(o&&Array.isArray(o.laps))S=o}catch(_){}
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(_){}}
function el(){return S.acc+(S.run?Date.now()-S.t0:0)}
function p2(n){return n<10?'0'+n:''+n}
function fmt(ms){var c=Math.floor(ms/10)%100,s=Math.floor(ms/1000)%60,m=Math.floor(ms/6e4)%60,h=Math.floor(ms/36e5);return{a:(h?h+':'+p2(m):p2(m))+':'+p2(s),c:p2(c)}}
function txt(ms){var f=fmt(ms);return f.a+'.'+f.c}
var wl=null;
function lock(on){try{if(on&&navigator.wakeLock){navigator.wakeLock.request('screen').then(function(l){wl=l}).catch(function(){})}else if(wl){wl.release();wl=null}}catch(_){}}
document.addEventListener('visibilitychange',function(){if(!document.hidden&&S.run)lock(true)});
var raf=0;
function tick(){var f=fmt(el());$('swd').innerHTML=f.a+'<small>.'+f.c+'</small>';if(S.run)raf=requestAnimationFrame(tick)}
function drawLaps(){var L=S.laps,box=$('swlist');$('swcp').hidden=!L.length;
 if(!L.length){box.innerHTML='';return}
 var sp=L.map(function(t,i){return t-(i?L[i-1]:0)}),mn=Math.min.apply(null,sp),mx=Math.max.apply(null,sp);
 box.innerHTML=L.map(function(t,i){var k=i;return '<div class="swlr'+(L.length>1&&sp[k]===mn?' bs':L.length>1&&sp[k]===mx?' ws':'')+'"><b>'+(k+1)+'</b><span>+'+txt(sp[k])+'</span><span>'+txt(t)+'</span></div>'}).reverse().join('')}
function ui(){var b=$('sws');b.textContent=S.run?'정지':'시작';b.className='swy'+(S.run?' on':'');
 var l=$('swl');l.textContent=S.run?'랩':'초기화';l.disabled=!S.run&&!S.acc&&!S.laps.length}
$('sws').onclick=function(){if(S.run){S.acc+=Date.now()-S.t0;S.run=false;cancelAnimationFrame(raf);lock(false)}else{S.t0=Date.now();S.run=true;lock(true);tick()}save();ui();tick()};
$('swl').onclick=function(){if(S.run){S.laps.push(el())}else{S={run:false,t0:0,acc:0,laps:[]}}save();ui();drawLaps();tick()};
$('swcp').onclick=function(){var L=S.laps,t='스톱워치 기록\\n'+L.map(function(x,i){return (i+1)+'. +'+txt(x-(i?L[i-1]:0))+' / '+txt(x)}).join('\\n')+'\\n총 '+txt(el());
 if(window.shareText)window.shareText(t,this);else if(navigator.clipboard)navigator.clipboard.writeText(t)};
ui();drawLaps();tick();if(S.run){lock(true);tick()}
})();
