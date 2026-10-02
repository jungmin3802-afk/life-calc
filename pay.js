(function(){
var $=function(i){return document.getElementById(i)},K='lc_pay',N=['A','B','C','D','E','F','G','H'];
var st={n:4,names:[]};try{var o=JSON.parse(localStorage.getItem(K)||'null');if(o&&o.names)st=o}catch(_){}
function save(){try{localStorage.setItem(K,JSON.stringify(st))}catch(_){}}
function nm(i){return (st.names[i]||'').trim()||(i+1)+'번'}
function draw(){var h='';for(var i=0;i<st.n;i++)h+='<input class="pyi" data-i="'+i+'" maxlength="8" placeholder="'+(i+1)+'번" value="'+(st.names[i]||'').replace(/"/g,'&quot;')+'" autocomplete="off">';
 $('pyl').innerHTML=h;$('pyn').querySelectorAll('button').forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-n')===st.n)})}
$('pyn').innerHTML=[2,3,4,5,6,7,8].map(function(n){return '<button type="button" data-n="'+n+'">'+n+'명</button>'}).join('');
$('pyn').addEventListener('click',function(e){var b=e.target.closest('[data-n]');if(!b)return;st.n=+b.getAttribute('data-n');save();draw()});
$('pyl').addEventListener('input',function(e){var i=e.target.getAttribute('data-i');if(i!==null){st.names[+i]=e.target.value;save()}});
var busy=false;
$('pygo').onclick=function(){if(busy)return;busy=true;var els=$('pyl').querySelectorAll('input'),n=st.n,cur=-1,step=0,total=18+Math.floor(Math.random()*n*2),win=Math.floor(Math.random()*n),t0=n*3;
 $('pyr').className='pyr';$('pyr').textContent='';
 els.forEach(function(x){x.classList.remove('hl','win')});
 var seq=[],k;for(k=0;k<t0+((win-0+n)%n);k++)seq.push(k%n);seq.push(win);
 // 마지막이 win이 되도록: 길이를 맞춰 win에서 끝나게 구성
 seq=[];var len=t0+n,pos=Math.floor(Math.random()*n);for(k=0;k<len;k++)seq.push((pos+k)%n);
 var last=seq[seq.length-1];win=last;
 (function tick(){var i=seq[step];els.forEach(function(x,j){x.classList.toggle('hl',j===i)});step++;
  if(step>=seq.length){els.forEach(function(x){x.classList.remove('hl')});els[win].classList.add('win');$('pyr').className='pyr on';$('pyr').innerHTML='💳 <b>'+nm(win).replace(/</g,'&lt;')+'</b> 님이 쏩니다!';$('pygo').textContent='🎯 다시 뽑기';busy=false;if(navigator.vibrate)try{navigator.vibrate(60)}catch(_){}return}
  setTimeout(tick,step<seq.length-8?70:70+(step-(seq.length-8))*45)})()};
draw();
})();
