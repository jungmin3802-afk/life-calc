(function(){
var $=function(i){return document.getElementById(i)},ex=$('ex'),rs=$('rs'),hist=$('hist');
var expr='',done=false,H=[];
var OPS='+−×÷';
function num(n){return n.replace(/\d+(\.\d*)?/g,function(m){var p=m.split('.'),i=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');return p.length>1?i+'.'+p[1]:i})}
function ev(e){
 var s=e.replace(/[+−×÷.]+$/,'');if(!s)return null;
 var t=s.match(/^−?[\d.]+|[+−×÷]|[\d.]+/g);if(!t||t.join('')!==s)return null;
 var x=parseFloat(t[0].replace('−','-'));if(isNaN(x))return null;
 for(var i=1;i<t.length;i+=2){var o=t[i],y=parseFloat(t[i+1]);if(isNaN(y))return null;
  x=o==='+'?x+y:o==='−'?x-y:o==='×'?x*y:x/y}
 return typeof x==='number'&&!isNaN(x)?x:null}
function out(x){if(x===null)return'';if(!isFinite(x))return'0으로 나눌 수 없습니다';
 x=parseFloat(x.toPrecision(12));return x.toLocaleString('ko-KR',{maximumFractionDigits:10})}
function show(){
 ex.textContent=num(expr)+(done?' =':'');
 var v=ev(expr);
 if(v===null&&!expr){rs.textContent='0';return}
 if(v!==null)rs.textContent=out(v)}
function lastNum(){var m=expr.match(/[\d.]*$/);return m?m[0]:''}
function press(k){
 if(k==='AC'){expr='';done=false;show();rs.textContent='0';return}
 if(k==='BS'){if(done){expr='';done=false;rs.textContent='0';show();return}expr=expr.slice(0,-1);show();if(!expr)rs.textContent='0';return}
 if(k==='='){var v=ev(expr);if(v===null)return;var t=out(v);
  if(isFinite(v)){H.unshift([num(expr),t,String(parseFloat(v.toPrecision(12)))]);H=H.slice(0,6);renderHist()}
  ex.textContent=num(expr)+' =';rs.textContent=t;
  expr=isFinite(v)?String(parseFloat(v.toPrecision(12))):'';done=true;return}
 if(OPS.indexOf(k)>=0){
  if(!expr){if(k==='−'){expr='−';show()}return}
  if(expr==='−')return;
  done=false;
  if(OPS.indexOf(expr.slice(-1))>=0)expr=expr.slice(0,-1);
  expr+=k;show();return}
 if(k==='%'){
  var m=expr.match(/^(.*?)([+−×÷]?)(\d*\.?\d+)$/);if(!m)return;
  var pre=m[1],op=m[2],n=parseFloat(m[3]),v;
  if((op==='+'||op==='−')&&pre){var base=ev(pre);if(base===null||!isFinite(base))return;v=base*n/100}else v=n/100;
  done=false;expr=pre+op+String(parseFloat(v.toPrecision(12)));show();return}
 if(done){expr='';done=false}
 if(k==='.'){var n=lastNum();if(n.indexOf('.')>=0)return;if(!n)expr+='0'}
 if(lastNum().replace('.','').length>=15)return;
 expr+=k;show()}
function renderHist(){
 if(!H.length){hist.innerHTML='<p class="note">아직 계산 기록이 없습니다.</p>';return}
 hist.innerHTML='';
 H.forEach(function(h){var b=document.createElement('button');b.type='button';
  b.innerHTML='<span></span><span></span>';b.children[0].textContent=h[0]+' =';b.children[1].textContent=h[1];
  b.onclick=function(){expr=h[2];done=false;show()};hist.appendChild(b)})}
$('keys').addEventListener('click',function(e){var b=e.target.closest('button');if(b)press(b.getAttribute('data-k'))});
document.addEventListener('keydown',function(e){
 if(e.ctrlKey||e.metaKey||e.altKey)return;var k=e.key,m={'*':'×','/':'÷','-':'−','Enter':'=','Backspace':'BS','Escape':'AC','x':'×'};
 if(/^[0-9.+%]$/.test(k)||m[k]){if(k==='/'||k==='Enter')e.preventDefault();press(m[k]||k)}});
show();
})();
