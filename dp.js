(function(){
var W='일월화수목금토',pad=function(n){return n<10?'0'+n:''+n};
var css='.dpb{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;margin:0;min-height:48px;padding:10px 14px;border:1px solid var(--line);border-radius:14px;background:var(--bg);color:var(--ink);font-size:1.05rem;font-weight:600;text-align:left;cursor:pointer;font-family:inherit}.dpb i{font-style:normal;opacity:.55}.dpb.emp{color:var(--sub);font-weight:400}.dpb:active{transform:scale(.985)}'
+'.dpx{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}'
+'#dpo{position:fixed;inset:0;z-index:120;background:rgba(0,0,0,.42);display:flex;align-items:flex-end;justify-content:center;animation:dpf .15s}@keyframes dpf{from{opacity:0}}'
+'#dps{width:100%;max-width:440px;background:var(--card);color:var(--ink);border-radius:28px 28px 0 0;padding:0 0 calc(14px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.3);animation:dpu .22s cubic-bezier(.2,.9,.3,1);max-height:94vh;overflow-y:auto}@keyframes dpu{from{transform:translateY(40px);opacity:.4}}'
+'.hd{background:linear-gradient(135deg,#FF9A9E,#FBC2EB 60%,#C4B5FD);color:#fff;padding:20px 22px 16px;border-radius:28px 28px 0 0}.hd small{display:block;opacity:.92;font-size:.9rem;font-weight:600}.hd b{display:block;font-size:1.9rem;font-weight:800;line-height:1.25;text-shadow:0 1px 8px rgba(0,0,0,.12)}'
+'.qc{display:flex;gap:6px;overflow-x:auto;padding:12px 16px 4px}.qc button{margin:0;flex-shrink:0;padding:8px 14px;border:0;border-radius:20px;background:color-mix(in srgb,#F43F5E 10%,var(--bg));color:#E11D48;font-size:.88rem;font-weight:700;cursor:pointer}.qc button:active{transform:scale(.94)}'
+'.sps{display:grid;gap:10px;padding:12px 16px 4px}.sps.c3{grid-template-columns:repeat(3,1fr)}.sps.c2{grid-template-columns:repeat(2,1fr)}'
+'.sp{background:var(--bg);border-radius:20px;padding:6px 4px;text-align:center}.sp>small{display:block;color:var(--sub);font-size:.75rem;font-weight:600;margin-top:2px}'
+'.sp button{margin:0;width:100%;border:0;background:none;cursor:pointer;color:inherit;font-family:inherit}.sp .st2{height:38px;color:#F43F5E;font-size:1.3rem;font-weight:800}.sp .st2:active{transform:scale(.85)}.sp .nm2{touch-action:none;user-select:none;-webkit-user-select:none;cursor:ns-resize;font-size:1.75rem;font-weight:800;line-height:1.3;padding:2px 0;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.sp .nm2 em{font-size:.9rem;font-style:normal;color:var(--sub);font-weight:600;margin-left:1px}'
+'.pkh{display:flex;justify-content:space-between;align-items:center;padding:14px 18px 4px}.pkh b{font-size:1rem}.pkh button{margin:0;border:0;background:none;color:#E11D48;font-weight:700;font-size:.95rem;cursor:pointer}'
+'.pg{display:grid;gap:8px;padding:8px 16px}.pg button{margin:0;min-height:46px;padding:0;border:0;border-radius:14px;background:var(--bg);color:var(--ink);font-size:1rem;font-weight:700;cursor:pointer;font-family:inherit}.pg button.on{background:linear-gradient(135deg,#FB7185,#F43F5E);color:#fff;box-shadow:0 4px 12px rgba(244,63,94,.35)}.pg button:active{transform:scale(.94)}'
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
 var pk=null,yb=Y-9;
 var o=document.createElement('div');o.id='dpo';var s=document.createElement('div');s.id='dps';o.appendChild(s);document.body.appendChild(o);
 var prevOv=document.body.style.overflow;document.body.style.overflow='hidden';
 function close(){o.remove();document.body.style.overflow=prevOv}
 function dim(y,m){return new Date(y,m+1,0).getDate()}
 function fix(){D=Math.min(D,dim(Y,Mo))}
 function commit(){var v=hasD?Y+'-'+pad(Mo+1)+'-'+pad(D):'';if(hasT)v=(hasD?v+'T':'')+pad(H)+':'+pad(Mi);inp.value=v;fire(inp);refresh(btn);close()}
 function shift(days){var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+days);Y=d.getFullYear();Mo=d.getMonth();D=d.getDate()}
 function stp(k,label,val,unit){return '<div class="sp"><button type="button" class="st2" data-s="'+k+'" data-v="1" aria-label="'+label+' 올리기">▲</button><button type="button" class="nm2" data-p="'+k+'">'+val+'</button><button type="button" class="st2" data-s="'+k+'" data-v="-1" aria-label="'+label+' 내리기">▼</button><small>'+label+'</small></div>'}
 function head(){var h='';if(hasD){h='<small>'+Y+'년</small><b>'+(Mo+1)+'월 '+D+'일 '+W[new Date(Y,Mo,D).getDay()]+'요일'+(hasT?' · '+(H<12?'오전 ':'오후 ')+(H%12||12)+':'+pad(Mi):'')+'</b>'}else h='<small>시간 선택</small><b>'+(H<12?'오전 ':'오후 ')+(H%12||12)+':'+pad(Mi)+'</b>';return '<div class="hd">'+h+'</div>'}
 function draw(){var h=head();
  if(pk){var lab={y:'년도',m:'월',d:'일',H:'시',i:'분'}[pk],g='';
   h+='<div class="pkh"><b>'+lab+' 선택</b><button type="button" data-a="back">뒤로</button></div>';
   if(pk==='y'){h+='<div class="pg" style="grid-template-columns:repeat(4,1fr)">';for(var y=yb;y<yb+20;y++)h+='<button type="button" data-k="'+y+'"'+(y===Y?' class="on"':'')+'>'+y+'</button>';
    h+='</div><div class="dft"><button type="button" data-a="yp">◀ 이전 20년</button><button type="button" data-a="yn" style="flex:1">다음 20년 ▶</button></div>'}
   else if(pk==='m'){h+='<div class="pg" style="grid-template-columns:repeat(4,1fr)">';for(var m=0;m<12;m++)h+='<button type="button" data-k="'+m+'"'+(m===Mo?' class="on"':'')+'>'+(m+1)+'월</button>';h+='</div>'}
   else if(pk==='d'){h+='<div class="pg" style="grid-template-columns:repeat(7,1fr)">';for(var d=1;d<=dim(Y,Mo);d++)h+='<button type="button" data-k="'+d+'"'+(d===D?' class="on"':'')+'>'+d+'</button>';h+='</div>'}
   else if(pk==='H'){h+='<div class="pg" style="grid-template-columns:repeat(6,1fr)">';for(var k=0;k<24;k++)h+='<button type="button" data-k="'+k+'"'+(k===H?' class="on"':'')+'>'+k+'</button>';h+='</div>'}
   else{h+='<div class="pg" style="grid-template-columns:repeat(6,1fr)">';for(var j=0;j<60;j+=5)h+='<button type="button" data-k="'+j+'"'+(j===Mi?' class="on"':'')+'>'+pad(j)+'</button>';h+='</div>'}
  }else{
   if(hasD)h+='<div class="qc"><button type="button" data-q="0">오늘</button><button type="button" data-q="-1">어제</button><button type="button" data-q="-7">일주일 전</button><button type="button" data-q="-30">30일 전</button><button type="button" data-q="-100">100일 전</button><button type="button" data-q="-365">1년 전</button><button type="button" data-q="1">내일</button></div>';
   h+='<p style="text-align:center;margin:10px 0 0;font-size:.8rem;color:var(--sub)">숫자를 위아래로 밀거나 ▲▼를 누르세요 · 숫자를 톡 누르면 목록이 나와요</p>';if(hasD)h+='<div class="sps c3">'+stp('y','년',Y,'')+stp('m','월',Mo+1,'')+stp('d','일',D,'')+'</div>';
   if(hasT)h+='<div class="sps c2">'+stp('H','시',pad(H),'')+stp('i','분',pad(Mi),'')+'</div>';
   h+='<div class="dft"><button type="button" data-a="x">닫기</button>'+(hasD&&t==='date'&&inp.value?'<button type="button" data-a="clr">지우기</button>':'')+'<button type="button" class="ok" data-a="ok">완료</button></div>'}
  s.innerHTML=h}
 function step(k,v){
  if(k==='y')Y+=v;else if(k==='m'){Mo+=v;while(Mo>11){Mo-=12;Y++}while(Mo<0){Mo+=12;Y--}}else if(k==='d'){var n=dim(Y,Mo);D=((D-1+v)%n+n)%n+1}
  else if(k==='H')H=((H+v)%24+24)%24;else Mi=((Mi+v*5)%60+60)%60;fix()}
 function live(){var hd=s.querySelector('.hd');if(hd)hd.outerHTML=head();
  var V={y:Y,m:Mo+1,d:D,H:pad(H),i:pad(Mi)};[].forEach.call(s.querySelectorAll('.nm2'),function(el){el.firstChild.nodeValue=V[el.getAttribute('data-p')]})}
 var drag=null,moved=false;
 s.addEventListener('pointerdown',function(e){var n=e.target.closest('.nm2');if(!n)return;drag={k:n.getAttribute('data-p'),y:e.clientY,acc:0};moved=false;try{n.setPointerCapture(e.pointerId)}catch(_){}});
 s.addEventListener('pointermove',function(e){if(!drag)return;var dy=e.clientY-drag.y;if(Math.abs(dy)>6)moved=true;if(!moved)return;
  var st=Math.trunc(-dy/26)-drag.acc;if(st){step(drag.k,st);drag.acc+=st;live()}});
 function endDrag(){drag=null;setTimeout(function(){moved=false},0)}
 s.addEventListener('pointerup',endDrag);s.addEventListener('pointercancel',endDrag);
 s.addEventListener('wheel',function(e){var n=e.target.closest('.nm2');if(!n)return;e.preventDefault();step(n.getAttribute('data-p'),e.deltaY<0?1:-1);live()},{passive:false});
 s.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(moved&&b.classList.contains('nm2')){return}
  if(b.hasAttribute('data-s')){step(b.getAttribute('data-s'),+b.getAttribute('data-v'));draw();return}
  if(b.hasAttribute('data-p')){pk=b.getAttribute('data-p');if(pk==='y')yb=Y-9;draw();return}
  if(b.hasAttribute('data-k')){var x=+b.getAttribute('data-k');if(pk==='y')Y=x;else if(pk==='m')Mo=x;else if(pk==='d')D=x;else if(pk==='H')H=x;else Mi=x;fix();pk=null;draw();return}
  if(b.hasAttribute('data-q')){shift(+b.getAttribute('data-q'));draw();return}
  var a=b.getAttribute('data-a');
  if(a==='back'){pk=null;draw()}else if(a==='yp'){yb-=20;draw()}else if(a==='yn'){yb+=20;draw()}
  else if(a==='ok')commit();else if(a==='x')close();
  else if(a==='clr'){inp.value='';fire(inp);refresh(btn);close()}});
 o.addEventListener('click',function(e){if(e.target===o)close()});
 document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc)}});
 draw()}
function scan(root){(root||document).querySelectorAll('input[type=date],input[type=time],input[type=datetime-local]').forEach(upgrade)}
scan();
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.matches&&n.matches('input'))upgrade(n);else scan(n)}})})}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(function(){document.querySelectorAll('.dpb').forEach(refresh)},400);
})();
