(function(){
var W='일월화수목금토',pad=function(n){return n<10?'0'+n:''+n};
var css='.dpb{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;margin:0;min-height:48px;padding:10px 14px;border:1px solid var(--line);border-radius:14px;background:var(--bg);color:var(--ink);font-size:1.05rem;font-weight:600;text-align:left;cursor:pointer;font-family:inherit}.dpb i{font-style:normal;opacity:.55}.dpb.emp{color:var(--sub);font-weight:400}.dpb:active{transform:scale(.985)}'
+'.dpx{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}'
+'#dpo{position:fixed;inset:0;z-index:120;background:rgba(0,0,0,.42);display:flex;align-items:flex-end;justify-content:center;animation:dpf .15s}@keyframes dpf{from{opacity:0}}'
+'#dps{width:100%;max-width:440px;background:var(--card);color:var(--ink);border-radius:28px 28px 0 0;padding:0 0 calc(14px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.3);animation:dpu .22s cubic-bezier(.2,.9,.3,1);max-height:94vh;overflow-y:auto}@keyframes dpu{from{transform:translateY(40px);opacity:.4}}'
+'.hd{background:linear-gradient(135deg,#FF9A9E,#FBC2EB 60%,#C4B5FD);color:#fff;padding:20px 22px 16px;border-radius:28px 28px 0 0}.hd small{display:block;opacity:.92;font-size:.9rem;font-weight:600}.hd b{display:block;font-size:1.9rem;font-weight:800;line-height:1.25;text-shadow:0 1px 8px rgba(0,0,0,.12)}'
+'.qc{display:flex;gap:6px;overflow-x:auto;padding:12px 16px 4px}.qc button{margin:0;flex-shrink:0;padding:8px 14px;border:0;border-radius:20px;background:color-mix(in srgb,#F43F5E 10%,var(--bg));color:#E11D48;font-size:.88rem;font-weight:700;cursor:pointer}.qc button:active{transform:scale(.94)}'
+'.whs{position:relative;display:flex;gap:6px;padding:8px 12px 0;margin-top:6px}.whs:after{content:"";position:absolute;left:12px;right:12px;top:8px;bottom:0;pointer-events:none;background:linear-gradient(var(--card) 0,transparent 32%,transparent 68%,var(--card) 100%)}'
+'.whs .band{position:absolute;left:14px;right:14px;top:calc(8px + 88px);height:44px;border-radius:14px;background:color-mix(in srgb,#F43F5E 11%,var(--bg));pointer-events:none}'
+'.wcol{flex:1;position:relative;z-index:1}.wcol small{display:block;text-align:center;color:var(--sub);font-size:.72rem;font-weight:700;margin-bottom:2px;position:absolute;top:-2px;width:100%;opacity:0}'
+'.wh{height:220px;overflow-y:scroll;scroll-snap-type:y mandatory;padding:88px 0;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;position:relative;z-index:1}.wh::-webkit-scrollbar{display:none}'
+'.wi{height:44px;line-height:44px;text-align:center;scroll-snap-align:center;font-size:1.25rem;font-weight:600;color:var(--sub);font-variant-numeric:tabular-nums;cursor:pointer;user-select:none;-webkit-user-select:none}.wi.on{color:var(--ink);font-weight:800;font-size:1.45rem}.wi.n1{color:color-mix(in srgb,var(--ink) 55%,var(--sub))}'
+'.wl{display:flex;gap:6px;padding:0 12px;color:var(--sub);font-size:.8rem;font-weight:700;text-align:center}.wl span{flex:1}'
+'.hint{text-align:center;margin:8px 0 0;font-size:.8rem;color:var(--sub)}'
+'.dft{display:flex;gap:8px;padding:10px 16px 0}.dft button{margin:0;min-height:50px;border:0;border-radius:16px;background:var(--bg);color:var(--sub);font-size:1rem;font-weight:600;cursor:pointer;padding:0 18px}.dft .ok{flex:1;background:linear-gradient(135deg,#FB7185,#F43F5E);color:#fff;font-weight:800;box-shadow:0 6px 16px rgba(244,63,94,.35)}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function p2(s){var m=/^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d):(\d\d))?$/.exec(s||'');return m?{y:+m[1],m:+m[2]-1,d:+m[3],h:m[4]?+m[4]:null,i:m[5]?+m[5]:null}:null}
function label(inp){var v=inp.value,t=inp.type;
 if(!v)return null;
 if(t==='time'){var m=/^(\d\d):(\d\d)/.exec(v);if(!m)return v;var h=+m[1];return (h<12?'오전 ':'오후 ')+(h%12||12)+':'+m[2]}
 var q=p2(v);if(!q)return v;var w=W[new Date(q.y,q.m,q.d).getDay()];
 var s=q.y+'년 '+(q.m+1)+'월 '+q.d+'일 ('+w+')';
 if(t==='datetime-local'&&q.h!==null){s+=' '+(q.h<12?'오전 ':'오후 ')+(q.h%12||12)+':'+pad(q.i)}
 return s}
function fire(inp){['input','change'].forEach(function(n){inp.dispatchEvent(new Event(n,{bubbles:true}))})}
function upgrade(inp){
 if(inp.__dp||!/^(date|time|datetime-local)$/.test(inp.type))return;
 inp.__dp=1;var b=document.createElement('button');b.type='button';b.className='dpb';
 var lab=document.querySelector('label[for="'+inp.id+'"]');
 inp.classList.add('dpx');inp.tabIndex=-1;inp.parentNode.insertBefore(b,inp);
 b.__inp=inp;refresh(b);b.onclick=function(){open(inp,b)}}
function refresh(b){var inp=b.__inp,l=label(inp),ic=inp.type==='time'?'🕒':'📅';
 var txt=l||(inp.type==='time'?'시간 선택':'날짜 선택');
 var h='<span>'+txt+'</span><i>'+ic+'</i>';if(b.__h!==h){b.__h=h;b.innerHTML=h}
 b.classList.toggle('emp',!l)}
function open(inp,btn){
 var t=inp.type,q=p2(inp.value),now=new Date(),hasD=t!=='time',hasT=t!=='date';
 var Y=q?q.y:now.getFullYear(),Mo=q?q.m:now.getMonth(),D=q?q.d:now.getDate();
 var H=t==='time'?(/^(\d\d)/.test(inp.value)?+inp.value.slice(0,2):now.getHours()):(q&&q.h!==null?q.h:now.getHours());
 var Mi=t==='time'?(/:(\d\d)/.test(inp.value)?+inp.value.slice(3,5):0):(q&&q.i!==null?q.i:0);
 Mi=Math.round(Mi/5)*5%60;
 var Y0=Math.min(1940,Y-1),Y1=Math.max(2070,Y+1);
 var o=document.createElement('div');o.id='dpo';var s=document.createElement('div');s.id='dps';o.appendChild(s);document.body.appendChild(o);
 var prevOv=document.body.style.overflow;document.body.style.overflow='hidden';
 function close(){o.remove();document.body.style.overflow=prevOv}
 function dim(y,m){return new Date(y,m+1,0).getDate()}
 function commit(){var v=hasD?Y+'-'+pad(Mo+1)+'-'+pad(D):'';if(hasT)v=(hasD?v+'T':'')+pad(H)+':'+pad(Mi);inp.value=v;fire(inp);refresh(btn);close()}
 function head(){var h='';if(hasD){h='<small>'+Y+'년</small><b>'+(Mo+1)+'월 '+D+'일 '+W[new Date(Y,Mo,D).getDay()]+'요일'+(hasT?' · '+(H<12?'오전 ':'오후 ')+(H%12||12)+':'+pad(Mi):'')+'</b>'}else h='<small>시간 선택</small><b>'+(H<12?'오전 ':'오후 ')+(H%12||12)+':'+pad(Mi)+'</b>';return '<div class="hd">'+h+'</div>'}
 function items(k){var a=[],i;
  if(k==='y'){for(i=Y0;i<=Y1;i++)a.push([i,i+'년'])}
  else if(k==='m'){for(i=0;i<12;i++)a.push([i,(i+1)+'월'])}
  else if(k==='d'){for(i=1;i<=dim(Y,Mo);i++)a.push([i,i+'일'])}
  else if(k==='H'){for(i=0;i<24;i++)a.push([i,pad(i)+'시'])}
  else{for(i=0;i<60;i+=5)a.push([i,pad(i)+'분'])}
  return a}
 function cur(k){return {y:Y,m:Mo,d:D,H:H,i:Mi}[k]}
 function wheel(k){var a=items(k),c=cur(k);return '<div class="wcol"><div class="wh" data-w="'+k+'">'+a.map(function(x,i){return '<div class="wi'+(x[0]===c?' on':'')+'" data-v="'+x[0]+'">'+x[1]+'</div>'}).join('')+'</div></div>'}
 function place(k,smooth){var el=s.querySelector('.wh[data-w="'+k+'"]');if(!el)return;var a=items(k),c=cur(k),idx=0;a.forEach(function(x,i){if(x[0]===c)idx=i});el.__lock=1;el.scrollTop=idx*44;setTimeout(function(){el.__lock=0},60)}
 function draw(){var h=head();
  if(hasD)h+='<div class="qc"><button type="button" data-q="0">오늘</button><button type="button" data-q="-1">어제</button><button type="button" data-q="-7">일주일 전</button><button type="button" data-q="-30">30일 전</button><button type="button" data-q="-100">100일 전</button><button type="button" data-q="-365">1년 전</button><button type="button" data-q="1">내일</button></div>';
  h+='<div class="whs"><div class="band"></div>'+(hasD?wheel('y')+wheel('m')+wheel('d'):'')+(hasT?wheel('H')+wheel('i'):'')+'</div>';
  h+='<p class="hint">위아래로 돌려서 고르세요</p>';
  h+='<div class="dft"><button type="button" data-a="x">닫기</button>'+(hasD&&t==='date'&&inp.value?'<button type="button" data-a="clr">지우기</button>':'')+'<button type="button" class="ok" data-a="ok">완료</button></div>';
  s.innerHTML=h;['y','m','d','H','i'].forEach(function(k){place(k)});bind()}
 function live(){var hd=s.querySelector('.hd');if(hd)hd.outerHTML=head()}
 function setVal(k,v){
  if(k==='y')Y=v;else if(k==='m')Mo=v;else if(k==='d')D=v;else if(k==='H')H=v;else Mi=v;
  if(k==='y'||k==='m'){var n=dim(Y,Mo);if(D>n){D=n;place('d')}
   var dc=s.querySelector('.wh[data-w="d"]');if(dc&&dc.children.length!==n){var top=dc.scrollTop;dc.innerHTML=items('d').map(function(x){return '<div class="wi'+(x[0]===D?' on':'')+'" data-v="'+x[0]+'">'+x[1]+'</div>'}).join('');place('d')}}
  live()}
 function bind(){[].forEach.call(s.querySelectorAll('.wh'),function(el){
  var k=el.getAttribute('data-w'),tm=null,down=null;
  function paint(){var idx=Math.max(0,Math.min(el.children.length-1,Math.round(el.scrollTop/44)));
   [].forEach.call(el.children,function(c,i){c.className='wi'+(i===idx?' on':Math.abs(i-idx)===1?' n1':'')});return el.children[idx]}
  el.addEventListener('scroll',function(){var c=paint();clearTimeout(tm);tm=setTimeout(function(){if(el.__lock||!c)return;var v=+c.getAttribute('data-v');if(v!==cur(k))setVal(k,v)},70)});
  el.addEventListener('click',function(e){var c=e.target.closest('.wi');if(c&&!el.__moved){el.scrollTo({top:[].indexOf.call(el.children,c)*44,behavior:'smooth'})}});
  el.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'){down={y:e.clientY,t:el.scrollTop};el.__moved=false;el.style.scrollSnapType='none';try{el.setPointerCapture(e.pointerId)}catch(_){}}});
  el.addEventListener('pointermove',function(e){if(down){var dy=e.clientY-down.y;if(Math.abs(dy)>4)el.__moved=true;el.scrollTop=down.t-dy}});
  function up(){if(down){down=null;el.style.scrollSnapType='';el.scrollTo({top:Math.round(el.scrollTop/44)*44,behavior:'smooth'});setTimeout(function(){el.__moved=false},50)}}
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);paint()})}
 s.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-q')){var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+(+b.getAttribute('data-q')));Y=d.getFullYear();Mo=d.getMonth();D=d.getDate();if(Y<Y0)Y0=Y-1;if(Y>Y1)Y1=Y+1;draw();return}
  var a=b.getAttribute('data-a');
  if(a==='ok')commit();else if(a==='x')close();
  else if(a==='clr'){inp.value='';fire(inp);refresh(btn);close()}});
 o.addEventListener('click',function(e){if(e.target===o)close()});
 document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc)}});
 draw()}
function scan(root){(root||document).querySelectorAll('input[type=date],input[type=time],input[type=datetime-local]').forEach(upgrade)}
scan();
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.matches&&n.matches('input'))upgrade(n);else scan(n)}})})}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(function(){document.querySelectorAll('.dpb').forEach(refresh)},400);
})();
