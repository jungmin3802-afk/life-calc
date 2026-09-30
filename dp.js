(function(){
var W='일월화수목금토',pad=function(n){return n<10?'0'+n:''+n};
var css='.dpb{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;margin:0;min-height:48px;padding:10px 14px;border:1px solid var(--line);border-radius:14px;background:var(--bg);color:var(--ink);font-size:1.05rem;font-weight:600;text-align:left;cursor:pointer;font-family:inherit}.dpb i{font-style:normal;opacity:.55}.dpb.emp{color:var(--sub);font-weight:400}.dpb:active{transform:scale(.985)}'
+'.dpx{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}'
+'#dpo{position:fixed;inset:0;z-index:120;background:rgba(0,0,0,.42);display:flex;align-items:flex-end;justify-content:center;animation:dpf .15s}@keyframes dpf{from{opacity:0}}'
+'#dps{width:100%;max-width:440px;background:var(--card);color:var(--ink);border-radius:26px 26px 0 0;padding:10px 16px calc(16px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.3);animation:dpu .22s cubic-bezier(.2,.9,.3,1);max-height:92vh;overflow-y:auto}@keyframes dpu{from{transform:translateY(40px);opacity:.4}}'
+'#dps .gr{width:40px;height:5px;border-radius:3px;background:var(--line);margin:2px auto 10px}'
+'.dh2{display:flex;align-items:center;justify-content:space-between;margin:2px 0 6px}.dh2 b{font-size:1.2rem}'
+'.dh2 button{margin:0;width:40px;height:40px;padding:0;border:0;border-radius:50%;background:var(--bg);color:var(--ink);font-size:1.3rem;cursor:pointer}.dh2 .yy{width:auto;padding:0 12px;font-size:.85rem;font-weight:600;color:var(--sub);border-radius:20px}'
+'.dw,.dg{display:grid;grid-template-columns:repeat(7,1fr);text-align:center}.dw span{font-size:.8rem;color:var(--sub);padding:6px 0}.dw span:first-child,.dg .su{color:#E5484D}.dw span:last-child,.dg .sa{color:#3B82F6}'
+'.dg button{margin:2px auto;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:none;color:inherit;font-size:1.05rem;font-weight:500;cursor:pointer;font-family:inherit}.dg .su{color:#E5484D}.dg .sa{color:#3B82F6}.dg button.td{box-shadow:inset 0 0 0 2px var(--acc);font-weight:700}.dg button.sl{background:var(--acc);color:#fff!important;font-weight:700;box-shadow:0 3px 10px color-mix(in srgb,var(--acc) 40%,transparent)}.dg button:active{transform:scale(.9)}.dg i{display:block;height:48px}'
+'.dft{display:flex;gap:8px;margin-top:10px}.dft button{margin:0;flex:1;min-height:46px;border:0;border-radius:14px;background:var(--bg);color:var(--acc);font-size:1rem;font-weight:700;cursor:pointer}.dft .ok{background:var(--acc);color:#fff}.dft .gy{color:var(--sub);font-weight:500}'
+'.tm{margin-top:12px;border-top:1px solid var(--line);padding-top:10px}.tm h4{margin:0 0 6px;font-size:.85rem;color:var(--sub);font-weight:600}.tg{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:8px}.tg button{margin:0;min-height:40px;padding:0;border:1px solid var(--line);border-radius:12px;background:var(--bg);color:var(--ink);font-size:.95rem;font-weight:600;cursor:pointer}.tg button.on{background:var(--acc);border-color:var(--acc);color:#fff}';
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
 var t=inp.type,q=p2(inp.value),now=new Date();
 var sel=q?{y:q.y,m:q.m,d:q.d}:null,vy=q?q.y:now.getFullYear(),vm=q?q.m:now.getMonth();
 var H=t==='time'?(/^(\d\d)/.test(inp.value)?+inp.value.slice(0,2):now.getHours()):(q&&q.h!==null?q.h:now.getHours());
 var M=t==='time'?(/:(\d\d)/.test(inp.value)?+inp.value.slice(3,5):0):(q&&q.i!==null?q.i:0);
 var o=document.createElement('div');o.id='dpo';var s=document.createElement('div');s.id='dps';o.appendChild(s);document.body.appendChild(o);
 var prevOv=document.body.style.overflow;document.body.style.overflow='hidden';
 function close(){o.remove();document.body.style.overflow=prevOv}
 function commit(){var v='';
  if(t==='time')v=pad(H)+':'+pad(M);
  else if(sel){v=sel.y+'-'+pad(sel.m+1)+'-'+pad(sel.d);if(t==='datetime-local')v+='T'+pad(H)+':'+pad(M)}
  inp.value=v;fire(inp);refresh(btn);close()}
 function draw(){var h='<div class="gr"></div>';
  if(t!=='time'){
   h+='<div class="dh2"><button type="button" data-a="pm" aria-label="이전 달">‹</button><div style="text-align:center"><b>'+vy+'년 '+(vm+1)+'월</b><br><button type="button" class="yy" data-a="py">−1년</button> <button type="button" class="yy" data-a="ny">+1년</button></div><button type="button" data-a="nm" aria-label="다음 달">›</button></div>';
   h+='<div class="dw">'+[].map.call(W,function(c){return '<span>'+c+'</span>'}).join('')+'</div><div class="dg">';
   var f=new Date(vy,vm,1).getDay(),n=new Date(vy,vm+1,0).getDate();
   for(var i=0;i<f;i++)h+='<i></i>';
   for(var d=1;d<=n;d++){var dow=(f+d-1)%7,c=(dow===0?'su ':dow===6?'sa ':'')+(vy===now.getFullYear()&&vm===now.getMonth()&&d===now.getDate()?'td ':'')+(sel&&sel.y===vy&&sel.m===vm&&sel.d===d?'sl':'');
    h+='<button type="button" class="'+c+'" data-d="'+d+'">'+d+'</button>'}
   h+='</div>'}
  if(t!=='date'){h+='<div class="tm"><h4>시</h4><div class="tg">';for(var k=0;k<24;k++)h+='<button type="button" data-h="'+k+'"'+(k===H?' class="on"':'')+'>'+k+'</button>';
   h+='</div><h4>분</h4><div class="tg">';for(var j=0;j<60;j+=5)h+='<button type="button" data-i="'+j+'"'+(j===M?' class="on"':'')+'>'+pad(j)+'</button>';
   h+='</div></div>'}
  h+='<div class="dft">'+(t==='time'?'':'<button type="button" data-a="today">오늘</button>')+(inp.value&&t==='date'?'<button type="button" class="gy" data-a="clr">지우기</button>':'')+'<button type="button" class="gy" data-a="x">닫기</button>'+(t==='date'?'':'<button type="button" class="ok" data-a="ok">확인</button>')+'</div>';
  s.innerHTML=h}
 s.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  var a=b.getAttribute('data-a');
  if(b.hasAttribute('data-d')){sel={y:vy,m:vm,d:+b.getAttribute('data-d')};if(t==='date'){commit();return}draw();return}
  if(b.hasAttribute('data-h')){H=+b.getAttribute('data-h');draw();return}
  if(b.hasAttribute('data-i')){M=+b.getAttribute('data-i');draw();return}
  if(a==='pm'){vm--;if(vm<0){vm=11;vy--}draw()}else if(a==='nm'){vm++;if(vm>11){vm=0;vy++}draw()}
  else if(a==='py'){vy--;draw()}else if(a==='ny'){vy++;draw()}
  else if(a==='today'){var n2=new Date();sel={y:n2.getFullYear(),m:n2.getMonth(),d:n2.getDate()};vy=sel.y;vm=sel.m;if(t==='date'){commit();return}draw()}
  else if(a==='clr'){inp.value='';fire(inp);refresh(btn);close()}
  else if(a==='ok'){if(t!=='time'&&!sel){var n3=new Date();sel={y:n3.getFullYear(),m:n3.getMonth(),d:n3.getDate()}}commit()}
  else if(a==='x')close()});
 o.addEventListener('click',function(e){if(e.target===o)close()});
 document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc)}});
 draw()}
function scan(root){(root||document).querySelectorAll('input[type=date],input[type=time],input[type=datetime-local]').forEach(upgrade)}
scan();
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.matches&&n.matches('input'))upgrade(n);else scan(n)}})})}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(function(){document.querySelectorAll('.dpb').forEach(refresh)},400);
})();
