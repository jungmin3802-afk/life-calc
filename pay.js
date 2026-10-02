(function(){
var $=function(i){return document.getElementById(i)},K='lc_pay';
var st={n:4,names:[],mode:'low'};try{var o=JSON.parse(localStorage.getItem(K)||'null');if(o&&o.names){st.n=o.n||4;st.names=o.names;st.mode=o.mode||'low'}}catch(_){}
function save(){try{localStorage.setItem(K,JSON.stringify(st))}catch(_){}}
function nm(i){return (st.names[i]||'').trim()||(i+1)+'번'}
function E(s){return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function R(n){return Math.floor(Math.random()*n)}
function vib(){if(navigator.vibrate)try{navigator.vibrate(60)}catch(_){}}
var game=0;
// ---- 공통: 인원/이름 ----
function drawPl(){var h='';for(var i=0;i<st.n;i++)h+='<input class="pyi" data-i="'+i+'" maxlength="8" placeholder="'+(i+1)+'번" value="'+(st.names[i]||'').replace(/"/g,'&quot;')+'" autocomplete="off">';
 $('pyl').innerHTML=h;$('pyn').querySelectorAll('button').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-n')===st.n)})}
$('pyn').innerHTML=[2,3,4,5,6,7,8].map(function(n){return '<button type="button" data-n="'+n+'">'+n+'명</button>'}).join('');
$('pyn').addEventListener('click',function(e){var b=e.target.closest('[data-n]');if(!b)return;st.n=+b.getAttribute('data-n');save();drawPl();resetGame()});
$('pyl').addEventListener('input',function(e){var i=e.target.getAttribute('data-i');if(i!==null){st.names[+i]=e.target.value;save();renderGame()}});
// ---- 메뉴 ----
function show(g){game=g;$('pmenu').hidden=!!g;$('pgame').hidden=!g;[1,2,3].forEach(function(k){$('g'+k).hidden=k!==g});resetGame();window.scrollTo(0,0)}
$('pmenu').addEventListener('click',function(e){var b=e.target.closest('[data-g]');if(b)show(+b.getAttribute('data-g'))});
$('pback').onclick=function(){show(0)};
function resetGame(){if(game===1){$('pyr').className='pyr';$('pyr').textContent='';$('pygo').textContent='🎯 결제할 사람 뽑기';$('pyl').querySelectorAll('input').forEach(function(x){x.classList.remove('hl','win')})}else if(game===2)dReset();else if(game===3)tReset()}
function renderGame(){if(game===2)dRender();else if(game===3)tRender()}
// ---- 1. 랜덤 뽑기 ----
var busy=false;
$('pygo').onclick=function(){if(busy)return;busy=true;var els=$('pyl').querySelectorAll('input'),n=st.n,step=0;
 $('pyr').className='pyr';$('pyr').textContent='';els.forEach(function(x){x.classList.remove('hl','win')});
 var seq=[],len=3*n+n,pos=R(n),k;for(k=0;k<len;k++)seq.push((pos+k)%n);var win=seq[seq.length-1];
 (function tick(){var i=seq[step];els.forEach(function(x,j){x.classList.toggle('hl',j===i)});step++;
  if(step>=seq.length){els.forEach(function(x){x.classList.remove('hl')});els[win].classList.add('win');$('pyr').className='pyr on';$('pyr').innerHTML='💳 <b>'+E(nm(win))+'</b> 님이 쏩니다!';$('pygo').textContent='🎯 다시 뽑기';busy=false;vib();return}
  setTimeout(tick,step<seq.length-8?70:70+(step-(seq.length-8))*45)})()};
// ---- 2. 주사위 ----
var PIP={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function die(v){var h='';for(var i=0;i<9;i++)h+='<i'+(v&&PIP[v].indexOf(i)>=0?' class="p"':'')+'></i>';return h}
var D={part:[],turn:0,sc:{},v:[0,0],rolled:[0,0],busy:false,done:false,loser:-1,msg:''};
function dReset(){D.part=[];for(var i=0;i<st.n;i++)D.part.push(i);D.turn=0;D.sc={};D.v=[0,0];D.rolled=[0,0];D.done=false;D.loser=-1;D.msg='';D.busy=false;dRender()}
function dRender(){
 $('pdm').querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-m')===st.mode)});
 var cur=D.part[D.turn],both=D.rolled[0]&&D.rolled[1];
 var head=D.done?'':'<b>'+E(nm(cur))+'</b> 차례 <small>'+(D.turn+1)+'/'+D.part.length+'</small>';
 $('pdh').innerHTML=D.msg&&!D.done?'<span class="pdw">'+E(D.msg)+'</span><br>'+head:head;
 [0,1].forEach(function(k){var b=$('pd'+k);b.innerHTML=die(D.v[k])+(D.v[k]?'':'<em>?</em>');b.className='die'+(D.rolled[k]?' set':'')+(D.v[k]?'':' emp');b.disabled=D.done});
 $('pdd').style.display=D.done?'none':'';
 var sum=D.v[0]+D.v[1];
 $('pdn').hidden=D.done||!both;$('pdn').textContent=(D.turn===D.part.length-1?'결과 보기':'다음 사람')+' ▶  (합 '+sum+')';
 $('pdt').hidden=D.done||both;$('pdt').textContent=D.rolled[0]||D.rolled[1]?'나머지 주사위도 눌러요':'주사위를 하나씩 눌러 던져요';
 var sb='';D.part.forEach(function(i){sb+='<span class="'+(D.done&&i===D.loser?'lose':'')+'">'+E(nm(i))+' <b>'+(D.sc[i]!==undefined?D.sc[i]:'-')+'</b></span>'});
 $('pds').innerHTML=sb;
 $('pdr').className='pyr'+(D.done?' on':'');$('pdr').innerHTML=D.done?'💳 <b>'+E(nm(D.loser))+'</b> 님이 쏩니다!':'';
 $('pdre').hidden=!D.done}
function roll(k){if(D.busy||D.done||D.rolled[k])return;D.busy=true;var b=$('pd'+k),n=0;b.classList.add('rolling');
 var t=setInterval(function(){n++;b.innerHTML=die(1+R(6));if(n>=9){clearInterval(t);b.classList.remove('rolling');D.v[k]=1+R(6);D.rolled[k]=1;D.busy=false;vib();dRender()}},70)}
$('pd0').onclick=function(){roll(0)};$('pd1').onclick=function(){roll(1)};
$('pdn').onclick=function(){var cur=D.part[D.turn];D.sc[cur]=D.v[0]+D.v[1];
 if(D.turn<D.part.length-1){D.turn++;D.v=[0,0];D.rolled=[0,0];dRender();return}
 var vals=D.part.map(function(i){return D.sc[i]}),t=st.mode==='low'?Math.min.apply(null,vals):Math.max.apply(null,vals),tied=D.part.filter(function(i){return D.sc[i]===t});
 if(tied.length>1){D.msg='동점! '+tied.map(nm).join(', ')+' 다시 던져요';D.part=tied;D.turn=0;D.sc={};D.v=[0,0];D.rolled=[0,0];dRender();return}
 D.done=true;D.loser=tied[0];D.msg='';dRender();vib()};
$('pdm').addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(!b)return;st.mode=b.getAttribute('data-m');save();dReset()});
$('pdre').onclick=dReset;
// ---- 3. 호랑이 이빨 ----
var T={bad:0,down:{},turn:0,over:false,N:12};
function tReset(){T.bad=R(T.N);T.down={};T.turn=0;T.over=false;tRender()}
function tRender(){var h1='',h2='',i;
 for(i=0;i<T.N;i++){var c='th'+(T.down[i]?' down':'')+(T.over&&i===T.bad?' bad':''),b='<button type="button" class="'+c+'" data-t="'+i+'" aria-label="이빨 '+(i+1)+'"'+(T.down[i]||T.over?' disabled':'')+'></button>';if(i<T.N/2)h1+=b;else h2+=b}
 $('ttop').innerHTML=h1;$('tbot').innerHTML=h2;$('tmouth').classList.toggle('chomp',T.over);
 var p=T.turn%st.n;
 $('tth').innerHTML=T.over?'':'<b>'+E(nm(p))+'</b> 차례 <small>이빨을 하나 눌러요</small>';
 $('ttr').className='pyr'+(T.over?' on':'');$('ttr').innerHTML=T.over?'🐯 앙! <b>'+E(nm(p))+'</b> 님이 물렸어요!<br>💳 <b>'+E(nm(p))+'</b> 님이 쏩니다!':'';
 $('ttre').hidden=!T.over}
function tTap(i){if(T.over||T.down[i])return;
 if(i===T.bad){T.over=true;vib();tRender();return}
 T.down[i]=1;T.turn=(T.turn+1)%st.n;tRender()}
$('tmouth').addEventListener('click',function(e){var b=e.target.closest('[data-t]');if(b)tTap(+b.getAttribute('data-t'))});
$('ttre').onclick=tReset;
drawPl();
})();
