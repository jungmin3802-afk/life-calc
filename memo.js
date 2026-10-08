(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},KEY='lc_memo';
var D=S.get(KEY,null);if(!D||!Array.isArray(D.notes))D={notes:[]};
var COL=['','#F5A524','#EF5B5B','#34C77B','#3B9BFF','#9B6BFF'],cur=null,tm=null,delT=null,q='';
function save(){S.set(KEY,D)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function id(){return 'm'+Date.now().toString(36)+Math.floor(Math.random()*1e4)}
function get(i){for(var k=0;k<D.notes.length;k++)if(D.notes[k].id===i)return D.notes[k];return null}
function lines(t){return String(t||'').split('\n').map(function(x){return x.trim()}).filter(Boolean)}
function title(n){var l=lines(n.t);return l.length?l[0]:'새 메모'}
function prev(n){var l=lines(n.t);return l.length>1?l[1]:'추가 텍스트 없음'}
function fd(ts){var d=new Date(ts),t=new Date(),p=S.pad;
 if(d.toDateString()===t.toDateString())return p(d.getHours())+':'+p(d.getMinutes());
 var y=new Date(t);y.setDate(t.getDate()-1);if(d.toDateString()===y.toDateString())return '어제';
 return d.getFullYear()===t.getFullYear()?(d.getMonth()+1)+'월 '+d.getDate()+'일':d.getFullYear()+'.'+p(d.getMonth()+1)+'.'+p(d.getDate())}
function row(n){return '<button type="button" class="mmrow" data-i="'+n.id+'" style="--mc:'+(COL[n.c||0]||'transparent')+'"><b>'+esc(title(n))+'</b><small><span>'+fd(n.u)+'</span><span>'+esc(prev(n))+'</span></small></button>'}
function draw(){
 var a=D.notes.slice().sort(function(x,y){return (y.p?1:0)-(x.p?1:0)||y.u-x.u});
 if(q){var s=q.toLowerCase();a=a.filter(function(n){return String(n.t).toLowerCase().indexOf(s)>=0})}
 var pin=a.filter(function(n){return n.p}),rest=a.filter(function(n){return!n.p}),h='';
 if(pin.length)h+='<div class="mmh">📌 고정됨</div>'+pin.map(row).join('');
 if(rest.length)h+=(pin.length?'<div class="mmh">메모</div>':'')+rest.map(row).join('');
 if(!a.length)h='<p class="mmem">'+(q?'검색 결과가 없어요.':'아직 메모가 없어요.<br>위의 “새 메모”를 눌러 시작해 보세요.')+'</p>';
 $('mmlist').innerHTML=h;
 $('mmcnt').textContent=D.notes.length?D.notes.length+'개의 메모':''}
function view(e){$('mlv').hidden=e;$('mev').hidden=!e;window.scrollTo(0,0)}
function paint(){var n=get(cur);if(!n)return;
 $('mmpin').classList.toggle('on',!!n.p);
 $('mmcol').querySelectorAll('button').forEach(function(b,i){b.classList.toggle('on',i===(n.c||0))});
 var t=n.t||'';$('mmft').textContent=t.replace(/\s/g,'').length+'자 · '+fd(n.u)+' 수정'}
function openE(i){cur=i;var n=get(i);$('mmta').value=n.t||'';view(true);paint();
 try{history.pushState({mm:1},'')}catch(_){}
 if(!n.t)$('mmta').focus()}
function closeE(){if(tm){clearTimeout(tm);tm=null}
 var n=get(cur);if(n){n.t=$('mmta').value;if(!n.t.trim()){D.notes=D.notes.filter(function(x){return x.id!==cur})}}
 save();cur=null;view(false);draw()}
function touch(){var n=get(cur);if(!n)return;n.t=$('mmta').value;n.u=Date.now();paint();
 if(tm)clearTimeout(tm);tm=setTimeout(function(){save();tm=null},300)}
$('mmta').addEventListener('input',touch);
$('mmnew').onclick=function(){var n={id:id(),t:'',c:0,p:0,k:Date.now(),u:Date.now()};D.notes.push(n);openE(n.id)};
$('mmlist').addEventListener('click',function(e){var b=e.target.closest('[data-i]');if(b)openE(b.getAttribute('data-i'))});
$('mmq').addEventListener('input',function(){q=this.value.trim();draw()});
$('mmback').onclick=function(){if(history.state&&history.state.mm)history.back();else closeE()};
window.addEventListener('popstate',function(){if(!$('mev').hidden)closeE()});
window.addEventListener('pagehide',function(){if(cur){var n=get(cur);if(n){n.t=$('mmta').value;save()}}});
$('mmpin').onclick=function(){var n=get(cur);if(!n)return;n.p=n.p?0:1;save();paint()};
$('mmcol').innerHTML=COL.map(function(c,i){return '<button type="button" aria-label="색 '+(i+1)+'" style="--mc:'+(c||'transparent')+'" class="'+(c?'':'none')+'"></button>'}).join('');
$('mmcol').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var n=get(cur);if(!n)return;
 n.c=[].indexOf.call(this.children,b);save();paint()});
$('mmshare').onclick=function(){var n=get(cur);if(!n||!n.t.trim())return;if(window.shareText)window.shareText(n.t,this)};
$('mmdel').onclick=function(){var b=this;
 if(b.getAttribute('data-arm')){clearTimeout(delT);b.removeAttribute('data-arm');b.textContent='🗑';
  D.notes=D.notes.filter(function(x){return x.id!==cur});save();cur=null;view(false);draw();
  if(history.state&&history.state.mm)history.back();return}
 b.setAttribute('data-arm','1');b.textContent='한 번 더 누르면 삭제';delT=setTimeout(function(){b.removeAttribute('data-arm');b.textContent='🗑'},3000)};
$('mmexp').onclick=function(){if(!S.download('메모-백업.json',JSON.stringify(D),'application/json'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('mmimp').onchange=function(){var f=this.files[0],inp=this;if(!f)return;var r=new FileReader();
 r.onload=function(){try{var o=JSON.parse(r.result);if(!o||!Array.isArray(o.notes))throw 0;
  if(confirm('백업 파일로 현재 메모를 덮어쓸까요?')){D=o;save();draw();S.notify('불러오기 완료',D.notes.length+'개의 메모를 불러왔어요.')}}
  catch(_){S.notify('불러오기 실패','메모장 백업 파일이 아닙니다.')}inp.value=''};r.readAsText(f)};
if(!S.persistent())$('mwarn').hidden=false;
draw();
})();
