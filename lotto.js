(function(){
var $=function(i){return document.getElementById(i)},res=$('lres'),sh=$('lshare'),txt='';
function rnd(n){var a=new Uint32Array(1),lim=Math.floor(4294967296/n)*n,x;do{crypto.getRandomValues(a);x=a[0]}while(x>=lim);return x%n}
function parse(s){var o=[];(s.match(/\d+/g)||[]).forEach(function(t){var n=parseInt(t,10);if(o.indexOf(n)<0)o.push(n)});return o}
function cls(n){return n<=10?1:n<=20?2:n<=30?3:n<=40?4:5}
function pick(inc,exc){var pool=[];for(var i=1;i<=45;i++)if(inc.indexOf(i)<0&&exc.indexOf(i)<0)pool.push(i);
 var out=inc.slice();while(out.length<6){out.push(pool.splice(rnd(pool.length),1)[0])}return out.sort(function(a,b){return a-b})}
function err(m){res.innerHTML='<p class="note">'+m+'</p>';sh.hidden=true}
$('go').onclick=function(){
 var inc=parse($('lin').value),exc=parse($('lex').value),n=parseInt($('lg').value,10);
 if(inc.concat(exc).some(function(x){return x<1||x>45}))return err('번호는 1부터 45 사이로 입력해 주세요.');
 if(inc.length>5)return err('꼭 넣을 번호는 최대 5개까지 정할 수 있습니다.');
 if(inc.some(function(x){return exc.indexOf(x)>=0}))return err('넣을 번호와 뺄 번호에 같은 숫자가 있습니다.');
 if(45-exc.length-inc.length<6-inc.length)return err('뺄 번호가 너무 많아 6개를 뽑을 수 없습니다.');
 var games=[],seen={},tries=0;
 while(games.length<n&&tries<300){var g=pick(inc,exc),k=g.join(',');tries++;if(!seen[k]){seen[k]=1;games.push(g)}}
 var L='ABCDE',h='',t=[];
 games.forEach(function(g,gi){h+='<div class="game"><span class="tag">'+L[gi]+'</span>'+g.map(function(x,bi){return'<span class="ball b'+cls(x)+'" style="animation-delay:'+(gi*0.18+bi*0.09).toFixed(2)+'s">'+x+'</span>'}).join('')+'</div>';t.push(L[gi]+': '+g.join(' '))});
 res.innerHTML=h;txt='로또 번호 (재미용)\n'+t.join('\n');sh.hidden=false};
sh.onclick=function(){if(window.shareText)window.shareText(txt,sh)};
})();
