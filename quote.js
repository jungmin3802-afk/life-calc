(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},KEY='lc_quote';
var Q=[
['공자','배우고 때때로 익히면 또한 기쁘지 아니한가.'],
['공자','세 사람이 길을 가면 반드시 그중에 나의 스승이 있다.'],
['공자','허물이 있거든 고치기를 꺼리지 마라.'],
['공자','아는 것을 안다 하고 모르는 것을 모른다 하는 것, 그것이 아는 것이다.'],
['공자','멀리 내다보고 생각하지 않으면 반드시 가까운 곳에 근심이 생긴다.'],
['노자','천 리 길도 한 걸음부터 시작된다.'],
['노자','남을 아는 사람은 지혜롭고, 자신을 아는 사람은 현명하다.'],
['순자','푸른색은 쪽에서 나왔지만 쪽보다 더 푸르다.'],
['손자','적을 알고 나를 알면 백 번 싸워도 위태롭지 않다.'],
['루쉰','원래 땅 위에는 길이 없었다. 걸어가는 사람이 많아지면 그것이 길이 된다.'],
['소크라테스','검증되지 않은 삶은 살 가치가 없다.'],
['세네카','어려워서 감히 하지 못하는 것이 아니라, 감히 하지 않기 때문에 어려워지는 것이다.'],
['마르쿠스 아우렐리우스','아침에 일어나기 싫을 때 이렇게 생각하라. 나는 사람으로서 일하기 위해 일어나는 것이다.'],
['에픽테토스','우리를 괴롭히는 것은 사건 그 자체가 아니라 사건에 대한 우리의 생각이다.'],
['호라티우스','오늘을 붙잡아라. 내일에는 되도록 기대하지 마라.'],
['호라티우스','감히 알려고 하라.'],
['파스칼','인간은 생각하는 갈대다.'],
['괴테','인간은 노력하는 한 방황한다.'],
['니체','나를 죽이지 못하는 것은 나를 더 강하게 만든다.'],
['에머슨','열정 없이 이루어진 위대한 일은 없다.'],
['소로','꿈을 향해 자신 있게 나아가고 상상해 온 삶을 살려고 노력하면, 평소에 기대하지 못한 성공을 만나게 된다.'],
['벤저민 프랭클린','오늘 할 수 있는 일을 내일로 미루지 마라.'],
['토머스 에디슨','천재는 1%의 영감과 99%의 땀으로 이루어진다.'],
['알베르트 아인슈타인','상상력은 지식보다 중요하다.'],
['알베르트 아인슈타인','인생은 자전거를 타는 것과 같다. 균형을 잡으려면 계속 움직여야 한다.'],
['헬렌 켈러','세상에서 가장 좋고 아름다운 것은 보이지도 만져지지도 않는다. 오직 가슴으로 느낄 수 있다.'],
['헬렌 켈러','혼자서는 작은 일밖에 못 하지만, 함께하면 많은 일을 할 수 있다.'],
['스티브 잡스','늘 갈망하고, 늘 우직하게 나아가라.'],
['스티브 잡스','당신의 시간은 한정되어 있다. 다른 사람의 삶을 사느라 낭비하지 마라.'],
['넬슨 만델라','해내기 전까지는 언제나 불가능해 보인다.'],
['생텍쥐페리','정말 중요한 것은 눈에 보이지 않는단다.'],
['생텍쥐페리','네 장미를 그토록 소중하게 만든 건 네가 장미에게 쏟은 시간이야.'],
['톨스토이','가장 중요한 때는 바로 지금이고, 가장 중요한 사람은 지금 함께 있는 사람이다.'],
['윌리엄 제임스','인생이 살 가치가 있는지는 그것을 살아가는 사람에게 달려 있다.'],
['이순신','죽고자 하면 살고, 살고자 하면 죽는다.'],
['안중근','하루라도 글을 읽지 않으면 입안에 가시가 돋는다.'],
['김구','나는 우리나라가 세계에서 가장 아름다운 나라가 되기를 원한다.'],
['속담','천 리 길도 한 걸음부터.'],
['속담','티끌 모아 태산.'],
['속담','가는 말이 고와야 오는 말이 곱다.'],
['속담','시작이 반이다.'],
['속담','우물을 파도 한 우물을 파라.'],
['속담','고생 끝에 낙이 온다.'],
['속담','백지장도 맞들면 낫다.'],
['속담','세 살 버릇 여든까지 간다.'],
['속담','아는 길도 물어 가라.'],
['속담','급할수록 돌아가라.'],
['속담','말 한마디에 천 냥 빚도 갚는다.'],
['속담','호랑이에게 물려 가도 정신만 차리면 산다.'],
['속담','쇠뿔도 단김에 빼라.'],
['속담','공든 탑이 무너지랴.'],
['속담','지성이면 감천이다.'],
['속담','하늘이 무너져도 솟아날 구멍이 있다.'],
['격언','뜻이 있는 곳에 길이 있다.'],
['격언','고난을 거쳐 별에 이른다.']
];
var D=S.get(KEY,null);if(!D||!D.fav)D={fav:[]};
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
var d=new Date(),ds=d.getFullYear()+'-'+S.pad(d.getMonth()+1)+'-'+S.pad(d.getDate());
var todayI=hash(ds)%Q.length,cur=todayI,shown=[todayI];
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function draw(){var q=Q[cur];
 $('qtxt').textContent=q[1];$('qwho').textContent=q[0]==='속담'||q[0]==='격언'?q[0]:'— '+q[0];
 $('qdate').textContent=cur===todayI&&shown.length===1?(d.getMonth()+1)+'월 '+d.getDate()+'일 오늘의 명언':'다른 명언';
 var on=D.fav.indexOf(cur)>=0;$('qfav').textContent=on?'♥ 저장됨':'♡ 저장';$('qfav').classList.toggle('on',on);
 $('qlist').innerHTML=D.fav.length?D.fav.map(function(i){return'<div class="qi"><p>'+esc(Q[i][1])+'</p><small>'+esc(Q[i][0]==='속담'||Q[i][0]==='격언'?Q[i][0]:'— '+Q[i][0])+'</small><button type="button" class="x" data-x="'+i+'" aria-label="삭제">×</button></div>'}).join(''):'<p class="note" style="margin:0">마음에 드는 명언을 ♡로 저장해 보세요.</p>'}
$('qnext').onclick=function(){var n,t=0;do{n=Math.floor(Math.random()*Q.length);t++}while(shown.indexOf(n)>=0&&t<50);shown.push(n);if(shown.length>=Q.length)shown=[n];cur=n;draw();var c=$('qcard');c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')};
$('qfav').onclick=function(){var i=D.fav.indexOf(cur);if(i>=0)D.fav.splice(i,1);else D.fav.unshift(cur);S.set(KEY,D);draw()};
$('qlist').addEventListener('click',function(e){var b=e.target.closest('[data-x]');if(b){D.fav=D.fav.filter(function(x){return x!==+b.getAttribute('data-x')});S.set(KEY,D);draw()}});
$('qsh').onclick=function(){var q=Q[cur];if(window.shareText)window.shareText('"'+q[1]+'"\n'+(q[0]==='속담'||q[0]==='격언'?'('+q[0]+')':'- '+q[0])+'\n'+location.href,this)};
draw()})();
