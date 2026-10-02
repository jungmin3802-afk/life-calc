(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},pad=S.pad,ymd=S.ymd,KEY='lc_diet';
var D=S.get(KEY,null);if(!D||!D.logs)D={goal:1800,logs:[],w:{}};D.goal=D.goal||1800;D.w=D.w||{};
var MEAL=[['아침','🌅'],['점심','☀️'],['저녁','🌙'],['간식','🍪']];
var P={
'밥·면':[['공기밥 1공기',300],['현미밥 1공기',290],['잡곡밥 1공기',290],['죽 1그릇',200],['김치볶음밥',650],['비빔밥',600],['김밥 1줄',400],['라면 1봉',500],['잔치국수',450],['우동',450],['물냉면',450],['비빔냉면',550],['칼국수',500],['토마토 파스타',600],['식빵 1장',100],['토스트 1개',300],['베이글 1개',280],['시리얼 1컵',150],['오트밀 1컵',150],['군고구마 1개',190],['계란볶음밥',600],['제육덮밥',700],['불고기덮밥',650],['낙지덮밥',600],['회덮밥',600],['주먹밥 1개',180],['쌈밥 정식',650],['콩나물국밥',550],['돼지국밥',700],['순대국밥',750],['비빔국수',550],['쫄면',600],['막국수',500],['냉모밀',450],['카레라이스',700],['오므라이스',750],['짜장밥',700],['곤드레밥',400],['충무김밥',350],['참치김밥',450],['누룽지 1그릇',250],['귀리밥 1공기',280],['곤약밥 1공기',150],['수제비',450],['메밀국수',400],['잡곡 죽 1그릇',220],['호박죽 1그릇',200],['전복죽 1그릇',300]],
'국·찌개':[['미역국',90],['된장찌개',120],['김치찌개',200],['순두부찌개',200],['콩나물국',40],['북엇국',80],['육개장',350],['떡국',450],['삼계탕 1마리',900],['부대찌개',700],['감자탕',800],['갈비탕',600],['설렁탕',500],['곰탕',450],['해장국',550],['어묵탕',250],['동태탕',300],['대구탕',250],['매운탕',350],['만둣국',500],['닭곰탕',550],['청국장',200],['계란국',80],['감자국',120],['오징어국',100],['소고기무국',150],['시래기국',120],['꽃게탕',300],['알탕',280],['닭볶음탕',600],['추어탕',400],['황태해장국',250]],
'반찬':[['김치 1접시',15],['깍두기 1접시',25],['시금치나물',35],['콩나물무침',30],['무생채',25],['멸치볶음',60],['어묵볶음',90],['감자조림',90],['진미채볶음',90],['장조림',90],['두부조림',120],['계란말이 1인분',150],['계란찜',100],['잡채 1접시',150],['불고기 1인분',300],['제육볶음 1인분',400],['조미김 1봉',25],['김치전 1장',300],['해물파전 1인분',500],['감자전 1장',250],['부추전 1장',280],['호박전 4장',100],['동그랑땡 5개',200],['오이무침',25],['가지나물',40],['고사리나물',45],['도라지무침',60],['연근조림',90],['우엉조림',90],['깻잎장아찌',25],['마늘장아찌',40],['젓갈',30],['김치찜',200],['오징어볶음',250],['낙지볶음',250],['달걀장조림',100],['취나물',40],['고구마줄기볶음',60],['애호박볶음',50],['숙주나물',30],['미역줄기볶음',60],['떡갈비 1개',200],['소시지야채볶음',300],['감자채볶음',90],['버섯볶음',70],['멸치 주먹밥',200],['파김치',20],['총각김치',25],['열무김치',15],['나박김치',10],['오이소박이',25],['겉절이',25]],
'단백질':[['삶은 달걀 1개',75],['계란후라이 1개',90],['닭가슴살 100g',120],['두부 반 모',120],['고등어구이 1토막',200],['연어 100g',200],['참치캔 반 개',100],['소고기 구이 100g',250],['삼겹살 150g',500],['우유 1컵',130],['그릭요거트 100g',100],['프로틴 쉐이크',150],['프로틴바 1개',200],['닭가슴살 샐러드',250],['훈제오리 100g',230],['돼지 목살 150g',400],['돼지 수육 150g',300],['닭다리 1개',200],['소고기 안심 100g',160],['새우 100g',90],['오징어 100g',90],['갈치구이 1토막',150],['삼치구이 1토막',180],['꽁치구이 1마리',200],['낫토 1팩',90],['연두부 1팩',90],['순두부 1팩',100],['병아리콩 100g',160],['슬라이스 치즈 1장',70],['모짜렐라 100g',280],['요거트 1개',90],['달걀흰자 3개',50],['훈제 닭가슴살 100g',110],['참치회 100g',130],['연어회 100g',200],['광어회 100g',110],['닭안심 100g',110],['돼지 안심 100g',120],['소고기 우둔 100g',140],['두유 무가당 1팩',80],['콩자반 1접시',80],['검은콩 한 줌',100],['땅콩버터 1스푼',95]],
'과일·채소':[['사과 1개',100],['바나나 1개',100],['귤 1개',40],['딸기 10개',45],['키위 1개',50],['오렌지 1개',60],['방울토마토 10개',30],['샐러드 1접시',150],['오이 1개',25],['브로콜리 100g',35],['아보카도 반 개',160],['포도 100g',60],['수박 1조각',80],['참외 1개',60],['복숭아 1개',80],['배 반 개',100],['감 1개',80],['멜론 4분의 1',100],['블루베리 한 줌',40],['자두 1개',30],['망고 1개',150],['파인애플 100g',50],['체리 10개',50],['토마토 1개',35],['당근 1개',40],['양배추 100g',25],['파프리카 1개',30],['삶은 옥수수 1개',150],['삶은 감자 1개',130],['양상추 100g',15],['시금치 100g',25],['버섯 100g',25],['건포도 한 줌',90],['대추 3개',30],['곶감 1개',70],['자몽 반 개',50],['레몬 1개',20],['석류 1개',100],['단호박 100g',90],['고구마 삶은 것 1개',150],['무 100g',20]],
'분식·편의점':[['떡볶이 1인분',450],['순대 1인분',300],['김말이 1개',90],['어묵 1꼬치',50],['핫도그 1개',300],['컵라면 1개',400],['삼각김밥 1개',180],['샌드위치 1개',300],['편의점 도시락',650],['샐러드 팩',200],['닭가슴살 소시지',110],['라볶이',600],['튀김 1개',100],['오징어튀김 1개',100],['고구마튀김 1개',100],['야채튀김 1개',90],['치즈스틱 1개',150],['떡꼬치 1개',250],['닭꼬치 1개',200],['순대볶음 1인분',600],['만두 5개',250],['군만두 5개',350],['찐만두 5개',230],['컵밥',400],['도시락',700],['불닭볶음면',530],['짜파게티',600],['신라면',505],['육개장 사발면',300],['소떡소떡 1개',300],['델리 핫바',200],['계란 샌드위치',350],['참치마요 삼각김밥',220],['전주비빔 삼각김밥',200],['컵라면 소',300],['즉석밥 1개',300],['단백질 도시락',400],['편의점 샐러드',200],['견과 요거트',200],['바나나우유 1개',200],['딸기우유 1개',200],['초코우유 1개',200]],
'빵·베이커리':[['피자빵 1개',350],['소보로빵 1개',380],['단팥빵 1개',300],['크림빵 1개',320],['슈크림빵 1개',280],['소시지빵 1개',350],['야채빵 1개',320],['마늘빵 1조각',250],['식빵 1장',150],['식빵 토스트 2장',350],['바게트 3조각',180],['치아바타 1개',250],['크로와상 1개',260],['페이스트리 1개',350],['베이글 1개',280],['크림치즈 베이글',400],['모닝빵 1개',90],['곡물빵 1장',130],['시나몬롤 1개',420],['꽈배기 1개',300],['도넛 1개',250],['글레이즈드 도넛',260],['츄러스 1개',200],['머핀 1개',380],['스콘 1개',330],['와플 1개',350],['팬케이크 2장',350],['호두과자 5개',250],['붕어빵 1개',130],['계란빵 1개',200],['호떡 1개',230],['소금빵 1개',250],['카스테라 1조각',180],['케이크 1조각',350],['샌드위치빵 햄치즈',320],['단호박빵 1개',280],['밤식빵 1개',350],['생크림빵 1개',330],['앙버터 1개',450],['크림치즈 빵 1개',350],['쿠키 1개',100],['마카롱 1개',100],['에그타르트 1개',220],['버터 크로와상 1개',300],['초코 크로와상 1개',350],['프레첼 1개',350],['브리오슈 1개',300],['피자 토스트 1개',400],['옥수수빵 1개',300],['우유식빵 2장',260],['통밀빵 2장',200],['파운드케이크 1조각',300],['롤케이크 1조각',250],['티라미수 1조각',350],['치즈케이크 1조각',400],['크레페 1개',350],['크림 도넛 1개',330],['꽈배기 도넛 1개',320]],
'간식·음료':[['아메리카노',5],['카페라떼',180],['믹스커피 1잔',50],['오렌지주스 1컵',100],['두유 1팩',100],['초콜릿바 1개',250],['아이스크림 1개',200],['아몬드 한 줌',150],['케이크 1조각',350],['콜라 1캔',100],['맥주 1캔',150],['소주 1병',400],['와인 1잔',120],['카페모카',250],['바닐라라떼',250],['카푸치노',120],['카라멜마키아토',280],['아이스티',100],['녹차라떼',250],['초코라떼',350],['과일 스무디',250],['에이드',150],['사이다 1캔',100],['제로콜라 1캔',0],['주스 1팩',120],['요구르트 1병',65],['막걸리 1병',220],['맥주 500cc',200],['하이볼 1잔',150],['위스키 1잔',100],['감자칩 1봉',300],['새우깡 1봉',450],['초코파이 1개',150],['과자 1봉',300],['젤리 1봉',150],['사탕 1개',20],['견과류 한 줌',170],['팥빙수 1인분',500],['요거트 아이스크림',200],['푸딩 1개',150],['에너지바 1개',180],['꿀물 1잔',80],['식혜 1컵',120],['수정과 1컵',80],['보리차',0],['녹차',0],['콤부차 1병',30],['프로틴 음료 1병',150],['이온음료 1병',100],['에너지드링크 1캔',110],['우유 200ml',130],['저지방우유 200ml',90],['오트밀크 1컵',120]],
'중·일·양식':[['짜장면',800],['짬뽕',700],['탕수육 1인분',900],['깐풍기 1인분',800],['마파두부 덮밥',750],['짬뽕밥',700],['볶음밥',900],['군만두 5개',350],['마라탕 1인분',900],['마라샹궈 1인분',1000],['양장피 1인분',700],['꿔바로우 1인분',900],['초밥 10개',450],['연어초밥 8개',400],['라멘 1그릇',600],['규동',700],['텐동',800],['우동',450],['소바',400],['가츠동',850],['오코노미야키 1장',600],['타코야끼 6개',300],['샤브샤브 1인분',600],['스테이크 200g',500],['토마토 파스타',700],['크림 파스타',900],['까르보나라',950],['알리오올리오',650],['리조또',700],['라자냐 1인분',600],['피자 1조각',280],['샐러드 파스타',450],['쌀국수 1그릇',450],['팟타이 1인분',700],['나시고렝 1인분',750],['반미 1개',450],['분짜 1인분',550],['똠얌꿍 1인분',250],['타코 3개',600],['부리토 1개',700],['케밥 1개',600],['커리와 난 1인분',800],['딤섬 4개',300]],
'외식·배달':[['치킨 4분의 1마리',500],['피자 1조각',280],['햄버거 1개',500],['짜장면',800],['짬뽕',700],['후라이드 치킨 1마리',1800],['양념 치킨 1마리',2200],['닭강정 1인분',700],['족발 1인분',600],['보쌈 1인분',600],['곱창 1인분',700],['닭발 1인분',400],['돈까스 1인분',800],['치즈돈까스 1인분',1000],['피자 한 판',2200],['햄버거 세트',1000],['빅맥',550],['와퍼',650],['치즈버거',300],['감자튀김 M',380],['치킨너겟 5개',250],['서브웨이 15cm',350],['포케 1그릇',500],['샐러드 도시락',350],['삼겹살 1인분',600],['갈비 1인분',700],['냉면 1그릇',550],['칼국수 1그릇',600],['불고기 정식',800],['생선구이 정식',650],['찜닭 1인분',800],['쭈꾸미볶음 1인분',450],['낙곱새 1인분',900],['감자탕 1인분',800],['뼈해장국 1인분',600]]};
var tab='밥·면',meal=0,cur=new Date(),base=0,mult=1;cur=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate());
function save(){S.set(KEY,D)}
function won(n){return Math.round(n).toLocaleString('ko-KR')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function day(){return ymd(cur)}
function today(){return ymd(new Date())}
function dayLogs(d){return D.logs.filter(function(l){return l.d===d})}
function sum(d){return dayLogs(d).reduce(function(a,l){return a+l.k},0)}
var WD='일월화수목금토';
function lastW(d){var ks=Object.keys(D.w).filter(function(k){return k<=d}).sort();return ks.length?[ks[ks.length-1],D.w[ks[ks.length-1]]]:null}
function draw(){
 var d=day(),t=sum(d),g=D.goal;
 $('dm').textContent=(cur.getMonth()+1)+'월 '+cur.getDate()+'일 ('+WD[cur.getDay()]+')'+(d===today()?' · 오늘':'');
 $('dtot').textContent=won(t);$('dgl').textContent=won(g)+'kcal';
 var pc=Math.min(100,Math.round(t/g*100));$('dbar').style.width=pc+'%';$('dbar').className=t>g?'ov':pc>=90?'wr':'';
 $('dleft').innerHTML=t<=g?'목표까지 <b>'+won(g-t)+'kcal</b> 남음 ('+pc+'%)':'목표보다 <b>'+won(t-g)+'kcal</b> 초과';
 var w=D.w[d];$('dwt').textContent=w?w+'kg':'-';
 // 끼니 버튼
 $('dmeal').innerHTML=MEAL.map(function(m,i){return '<button type="button" data-m="'+i+'"'+(i===meal?' class="on"':'')+'><span>'+m[1]+'</span>'+m[0]+'</button>'}).join('');
 // 탭·칩
 var recent=[],seen={};D.logs.slice().sort(function(a,b){return b._u-a._u}).forEach(function(l){if(!seen[l.n]&&recent.length<12){seen[l.n]=1;recent.push([l.n,l.k])}});
 var tabs=(recent.length?['최근']:[]).concat(Object.keys(P));if(tabs.indexOf(tab)<0)tab=tabs[0];
 $('dtabs').innerHTML=tabs.map(function(k){return '<button type="button" data-t="'+k+'"'+(k===tab?' class="on"':'')+'>'+k+'</button>'}).join('');
 var L=tab==='최근'?recent:P[tab];
 $('dchips').innerHTML=L.map(function(x,i){return '<button type="button" data-i="'+i+'">'+esc(x[0])+'<small>'+x[1]+'</small></button>'}).join('');
 // 목록
 var ls=dayLogs(d),h='';
 MEAL.forEach(function(m,i){var A=ls.filter(function(l){return l.m===i});if(!A.length)return;
  h+='<div class="dml"><b>'+m[1]+' '+m[0]+'</b><span>'+won(A.reduce(function(a,l){return a+l.k},0))+'kcal</span></div>'+A.sort(function(a,b){return a._u-b._u}).map(function(l){return '<div class="tr"><span class="tn"><b>'+esc(l.n)+'</b></span><span class="ta ex">'+won(l.k)+'</span><button type="button" class="x" data-x="'+l.id+'" aria-label="삭제">×</button></div>'}).join('')});
 $('dlist').innerHTML=h||'<p class="note">이 날 기록이 없어요. 위에서 먹은 음식을 골라 보세요.</p>';
 // 7일 막대
 var days=[],mx=g;for(var i=6;i>=0;i--){var dd=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()-i),k=ymd(dd),v=sum(k);days.push([dd,k,v]);mx=Math.max(mx,v)}
 $('dchart').innerHTML=days.map(function(x){return '<div class="bbar"><i style="height:'+Math.round(x[2]/mx*100)+'%;'+(x[2]>g?'background:#E5484D':'')+'"></i><b>'+(x[2]?won(x[2]):'')+'</b><span>'+(x[0].getMonth()+1)+'/'+x[0].getDate()+'</span></div>'}).join('');
 // 체중 그래프 (최근 30일 기록)
 var ws=Object.keys(D.w).sort().slice(-14);
 if(ws.length>=2){var vs=ws.map(function(k){return D.w[k]}),lo=Math.min.apply(null,vs),hi=Math.max.apply(null,vs),rg=Math.max(0.5,hi-lo),W=300,H=90,pts=ws.map(function(k,i){return [10+i*(W-20)/(ws.length-1),10+(1-(D.w[k]-lo)/rg)*(H-20)]});
  var ch=(vs[vs.length-1]-vs[0]);
  $('dwchart').innerHTML='<svg viewBox="0 0 '+W+' '+H+'" class="dws"><polyline fill="none" stroke="#EA580C" stroke-width="2.5" stroke-linejoin="round" points="'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' ')+'"/>'+pts.map(function(p){return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3.5" fill="#EA580C"/>'}).join('')+'</svg><p class="note">최근 '+ws.length+'번 기록 기준 '+(ch>0?'+':'')+ch.toFixed(1)+'kg ('+vs[0]+' → '+vs[vs.length-1]+'kg)</p>'}
 else $('dwchart').innerHTML='<p class="note">체중을 이틀 이상 기록하면 변화 그래프가 나와요.</p>';
 $('dgoal').value=won(D.goal);
 var lw=lastW(d);$('dw').placeholder=lw?'최근 '+lw[1]+'kg':'예: 62.5'}
function setK(v){$('dk').value=v>0?won(v):''}
function readK(){return parseInt(($('dk').value||'0').replace(/\D/g,''),10)||0}
$('dmeal').addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(!b)return;meal=+b.getAttribute('data-m');draw()});
$('dtabs').addEventListener('click',function(e){var b=e.target.closest('[data-t]');if(!b)return;tab=b.getAttribute('data-t');draw()});
$('dchips').addEventListener('click',function(e){var b=e.target.closest('[data-i]');if(!b)return;
 var recent=[],seen={};D.logs.slice().sort(function(a,b){return b._u-a._u}).forEach(function(l){if(!seen[l.n]&&recent.length<12){seen[l.n]=1;recent.push([l.n,l.k])}});
 var x=(tab==='최근'?recent:P[tab])[+b.getAttribute('data-i')];if(!x)return;base=x[1];mult=1;$('dn').value=x[0];setK(base);
 $('dmul').hidden=false;[].forEach.call($('dmul').querySelectorAll('button'),function(q){q.className=q.getAttribute('data-m')==='1'?'on':''})});
$('dmul').addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(!b)return;mult=+b.getAttribute('data-m');[].forEach.call($('dmul').querySelectorAll('button'),function(q){q.className=q===b?'on':''});setK(Math.round(base*mult))});
$('dk').addEventListener('input',function(){var d=this.value.replace(/\D/g,'');this.value=d?Number(d).toLocaleString('ko-KR'):'';$('dmul').hidden=true});
$('dq').addEventListener('click',function(e){var b=e.target.closest('[data-p]');if(!b)return;var v=readK(),p=+b.getAttribute('data-p');setK(p===0?0:v+p);$('dmul').hidden=true});
$('dsave').onclick=function(){var k=readK(),n=$('dn').value.trim();if(!n){$('dn').focus();return}if(!k&&k!==0)return;if(!k){var okc=confirm('칼로리가 0으로 기록돼요. 계속할까요?');if(!okc)return}
 D.logs.push({id:'d'+Date.now().toString(36)+Math.floor(Math.random()*1e4),d:day(),m:meal,n:n.slice(0,30),k:k,_u:Date.now()});
 $('dn').value='';setK(0);$('dmul').hidden=true;save();draw();
 var f=$('dok');f.textContent='✓ '+MEAL[meal][0]+' '+n+' '+won(k)+'kcal 기록했어요';f.hidden=false;clearTimeout(f._t);f._t=setTimeout(function(){f.hidden=true},2500)};
$('dlist').addEventListener('click',function(e){var x=e.target.closest('[data-x]');if(x&&confirm('이 기록을 삭제할까요?')){var id=x.getAttribute('data-x');D.logs=D.logs.filter(function(l){return l.id!==id});save();draw()}});
$('dprev').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()-1);draw()};
$('dnext').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()+1);draw()};
$('dwsave').onclick=function(){var v=parseFloat($('dw').value.replace(',','.'));if(!(v>=20&&v<=300)){S.notify('체중을 확인해 주세요','20~300kg 사이로 입력해 주세요.');return}D.w[day()]=Math.round(v*10)/10;$('dw').value='';save();draw()};
$('dgoal').addEventListener('input',function(){var d=this.value.replace(/\D/g,'');var v=parseInt(d||'0',10);if(v>0){D.goal=v;save()}this.value=d?Number(d).toLocaleString('ko-KR'):'';var t=sum(day()),g=D.goal;$('dgl').textContent=won(g)+'kcal';var pc=Math.min(100,Math.round(t/g*100));$('dbar').style.width=pc+'%';$('dleft').innerHTML=t<=g?'목표까지 <b>'+won(g-t)+'kcal</b> 남음 ('+pc+'%)':'목표보다 <b>'+won(t-g)+'kcal</b> 초과'});
$('dcsv').onclick=function(){var rows=['날짜,끼니,음식,칼로리'];D.logs.slice().sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:a.m-b.m}).forEach(function(l){rows.push([l.d,MEAL[l.m][0],(l.n||'').replace(/,/g,' '),l.k].join(','))});
 Object.keys(D.w).sort().forEach(function(k){rows.push([k,'체중','',D.w[k]+'kg'].join(','))});
 if(!S.download('식단기록.csv','﻿'+rows.join('\n'),'text/csv'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('dexp').onclick=function(){if(!S.download('식단기록-백업.json',JSON.stringify(D),'application/json'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('dimp').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||!Array.isArray(o.logs))throw 0;if(confirm('백업 파일로 현재 식단 기록을 덮어쓸까요?')){D=o;D.goal=D.goal||1800;D.w=D.w||{};save();draw();S.notify('불러오기 완료','기록 '+D.logs.length+'개')}}catch(_){S.notify('불러오기 실패','식단 기록 백업 파일이 아닙니다.')}};r.readAsText(f);this.value=''};
if(!S.persistent())$('dwarn').hidden=false;
draw();
})();
