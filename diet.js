(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},pad=S.pad,ymd=S.ymd,KEY='lc_diet';
var D=S.get(KEY,null);if(!D||!D.logs)D={goal:1800,logs:[],w:{}};D.goal=D.goal||1800;D.w=D.w||{};
var MEAL=[['아침','🌅'],['점심','☀️'],['저녁','🌙'],['간식','🍪']];
var P={
'밥·면':[['공기밥 1공기',300],['현미밥 1공기',290],['잡곡밥 1공기',290],['죽 1그릇',200],['김치볶음밥',650],['비빔밥',600],['김밥 1줄',400],['라면 1봉',500],['잔치국수',450],['우동',450],['물냉면',450],['비빔냉면',550],['칼국수',500],['토마토 파스타',600],['식빵 1장',100],['토스트 1개',300],['베이글 1개',280],['시리얼 1컵',150],['오트밀 1컵',150],['군고구마 1개',190]],
'국·찌개':[['미역국',90],['된장찌개',120],['김치찌개',200],['순두부찌개',200],['콩나물국',40],['북엇국',80],['육개장',350],['떡국',450],['삼계탕 1마리',900]],
'반찬':[['김치 1접시',15],['깍두기 1접시',25],['시금치나물',35],['콩나물무침',30],['무생채',25],['멸치볶음',60],['어묵볶음',90],['감자조림',90],['진미채볶음',90],['장조림',90],['두부조림',120],['계란말이 1인분',150],['계란찜',100],['잡채 1접시',150],['불고기 1인분',300],['제육볶음 1인분',400],['조미김 1봉',25]],
'단백질':[['삶은 달걀 1개',75],['계란후라이 1개',90],['닭가슴살 100g',120],['두부 반 모',120],['고등어구이 1토막',200],['연어 100g',200],['참치캔 반 개',100],['소고기 구이 100g',250],['삼겹살 150g',500],['우유 1컵',130],['그릭요거트 100g',100],['프로틴 쉐이크',150],['프로틴바 1개',200]],
'과일·채소':[['사과 1개',100],['바나나 1개',100],['귤 1개',40],['딸기 10개',45],['키위 1개',50],['오렌지 1개',60],['방울토마토 10개',30],['샐러드 1접시',150],['오이 1개',25],['브로콜리 100g',35],['아보카도 반 개',160]],
'분식·편의점':[['떡볶이 1인분',450],['순대 1인분',300],['김말이 1개',90],['어묵 1꼬치',50],['핫도그 1개',300],['컵라면 1개',400],['삼각김밥 1개',180],['샌드위치 1개',300],['편의점 도시락',650],['샐러드 팩',200],['닭가슴살 소시지',110]],
'간식·음료':[['아메리카노',5],['카페라떼',180],['믹스커피 1잔',50],['오렌지주스 1컵',100],['두유 1팩',100],['초콜릿바 1개',250],['아이스크림 1개',200],['아몬드 한 줌',150],['케이크 1조각',350],['콜라 1캔',100],['맥주 1캔',150],['소주 1병',400],['와인 1잔',120]],
'외식·배달':[['치킨 4분의 1마리',500],['피자 1조각',280],['햄버거 1개',500],['짜장면',800],['짬뽕',700]]};
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
