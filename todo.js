(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},ymd=S.ymd,KEY='lc_todo';
var D=S.get(KEY,null);if(!D||!D.todos)D={todos:[],habits:[]};D.habits=D.habits||[];
function save(){S.set(KEY,D)}
var T=ymd(new Date()),tab='t',due='',emo='⭐',WD='일월화수목금토';
function P(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2])}
function add(s,n){var d=P(s);d.setDate(d.getDate()+n);return ymd(d)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function id(){return 'k'+Date.now().toString(36)+Math.floor(Math.random()*1e4)}
function dl(s){if(!s)return '';var d=Math.round((P(s)-P(T))/864e5);return d===0?'오늘':d===1?'내일':d===-1?'어제':d<0?(-d)+'일 지남':(P(s).getMonth()+1)+'/'+P(s).getDate()+' ('+WD[P(s).getDay()]+')'}
function streak(h){var n=0,d=h.days[T]?T:add(T,-1);while(h.days[d]){n++;d=add(d,-1)}return n}
function draw(){
 var open=D.todos.filter(function(t){return!t.done}),done=D.todos.filter(function(t){return t.done});
 var hd=D.habits.filter(function(h){return h.days[T]}).length;
 $('tbig').textContent=open.length;$('tsub').textContent='남은 할 일';
 $('thb').textContent=D.habits.length?hd+' / '+D.habits.length:'-';
 $('tdn').textContent=done.length;
 document.querySelectorAll('#ttabs button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-t')===tab)});
 $('tpt').hidden=tab!=='t';$('tph').hidden=tab!=='h';
 open.sort(function(a,b){return (a.due||'9')<(b.due||'9')?-1:(a.due||'9')>(b.due||'9')?1:0});
 $('tlist').innerHTML=open.length?open.map(function(t){var late=t.due&&t.due<T;
  return '<div class="tk"><button type="button" class="ck" data-c="'+t.id+'" aria-label="완료"></button><span class="tt">'+esc(t.t)+(t.due?'<small'+(late?' class="late"':'')+'>'+dl(t.due)+'</small>':'')+'</span><button type="button" class="x" data-x="'+t.id+'" aria-label="삭제">×</button></div>'}).join(''):'<p class="note">할 일이 없어요. 위에서 추가해 보세요.</p>';
 $('tdwrap').hidden=!done.length;
 $('tdlist').innerHTML=done.map(function(t){return '<div class="tk dn"><button type="button" class="ck on" data-c="'+t.id+'" aria-label="완료 취소">✓</button><span class="tt">'+esc(t.t)+'</span><button type="button" class="x" data-x="'+t.id+'" aria-label="삭제">×</button></div>'}).join('');
 $('hlist').innerHTML=D.habits.length?D.habits.map(function(h){var dots='';
  for(var i=6;i>=0;i--){var d=add(T,-i);dots+='<i class="'+(h.days[d]?'on':'')+'" title="'+d+'"></i>'}
  var st=streak(h),tot=Object.keys(h.days).length;
  return '<div class="hb"><button type="button" class="hc'+(h.days[T]?' on':'')+'" data-h="'+h.id+'" aria-label="오늘 체크"><span>'+h.e+'</span></button><div class="hi"><b>'+esc(h.n)+'</b><small>'+(st?'🔥 '+st+'일 연속':'오늘 시작해 보세요')+' · 총 '+tot+'회</small><div class="hdd">'+dots+'</div></div><button type="button" class="x" data-hx="'+h.id+'" aria-label="삭제">×</button></div>'}).join(''):'<p class="note">습관을 추가하고 매일 체크해 보세요.</p>';
}
function addTodo(){var v=$('tin').value.trim();if(!v){$('tin').focus();return}
 D.todos.push({id:id(),t:v,done:0,due:due==='t'?T:due==='n'?add(T,1):due==='w'?add(T,7):'',_u:Date.now()});save();$('tin').value='';draw()}
$('tadd').onclick=addTodo;$('tin').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addTodo()}});
$('tdue').addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(!b)return;due=b.getAttribute('data-v');this.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)})});
$('ttabs').addEventListener('click',function(e){var b=e.target.closest('[data-t]');if(b){tab=b.getAttribute('data-t');draw()}});
$('tpt').addEventListener('click',function(e){var c=e.target.closest('[data-c]'),x=e.target.closest('[data-x]');
 if(c){var t=D.todos.filter(function(a){return a.id===c.getAttribute('data-c')})[0];if(t){t.done=t.done?0:1;save();draw()}}
 else if(x){var i=x.getAttribute('data-x');D.todos=D.todos.filter(function(a){return a.id!==i});save();draw()}});
$('tclr').onclick=function(){if(confirm('완료한 할 일을 모두 지울까요?')){D.todos=D.todos.filter(function(t){return!t.done});save();draw()}};
// 습관
var EM=['⭐','💧','🏃','📚','🧘','🥗','😴','💊','✍️','🧹','🚶','🦷'],SUG=['물 마시기','운동하기','독서','스트레칭','일찍 자기','영양제','일기 쓰기','산책'];
$('hem').innerHTML=EM.map(function(e,i){return '<button type="button" class="'+(i?'':'on')+'">'+e+'</button>'}).join('');
$('hem').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;emo=b.textContent;this.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)})});
$('hsg').innerHTML=SUG.map(function(s){return '<button type="button" class="chip">'+s+'</button>'}).join('');
$('hsg').addEventListener('click',function(e){var b=e.target.closest('.chip');if(b){$('hin').value=b.textContent;$('hin').focus()}});
function addHabit(){var v=$('hin').value.trim();if(!v){$('hin').focus();return}
 D.habits.push({id:id(),n:v,e:emo,days:{},_u:Date.now()});save();$('hin').value='';draw()}
$('hadd').onclick=addHabit;$('hin').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addHabit()}});
$('tph').addEventListener('click',function(e){var c=e.target.closest('[data-h]'),x=e.target.closest('[data-hx]');
 if(c){var h=D.habits.filter(function(a){return a.id===c.getAttribute('data-h')})[0];if(h){if(h.days[T])delete h.days[T];else h.days[T]=1;save();draw()}}
 else if(x&&confirm('이 습관과 기록을 삭제할까요?')){var i=x.getAttribute('data-hx');D.habits=D.habits.filter(function(a){return a.id!==i});save();draw()}});
$('texp').onclick=function(){if(!S.download('할일습관-백업.json',JSON.stringify(D),'application/json'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('timp').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||!Array.isArray(o.todos))throw 0;if(confirm('백업 파일로 현재 기록을 덮어쓸까요?')){D=o;D.habits=D.habits||[];save();draw();S.notify('불러오기 완료','')}}catch(_){S.notify('불러오기 실패','할 일 백업 파일이 아닙니다.')}};r.readAsText(f);this.value=''};
if(!S.persistent())$('twarn').hidden=false;
draw();
})();
