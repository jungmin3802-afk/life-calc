
var MIN=10320; // 최저임금(시급). 매년 최신 값으로 수정하세요
var won=function(n){return Math.round(n).toLocaleString('ko-KR')+'원'};
var P=function(n){return(n<10?'0':'')+n};
var TD=function(){var t=new Date();return new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()))};
var AD=function(d,n){return new Date(d.getTime()+n*864e5)};
var FD=function(d){return d.getUTCFullYear()+'.'+P(d.getUTCMonth()+1)+'.'+P(d.getUTCDate())+' ('+'일월화수목금토'[d.getUTCDay()]+')'};
var Z=['원숭이','닭','개','돼지','쥐','소','호랑이','토끼','용','뱀','말','양'];
var C=[
{k:'calc',n:'숫자 계산기',nt:'+ - * / ( ) % 를 사용할 수 있습니다. (예: 12500*3+400/2)',
 f:[['e','계산식','txt','예: (1200+3400)*2/5']],
 run:function(v){var s=(v.e||'').replace(/×/g,'*').replace(/÷/g,'/').replace(/,/g,'');
  if(!s||!/^[\d+\-*\/().%\s]+$/.test(s))return null;var x;
  try{x=Function('"use strict";return('+s+')')()}catch(e){return null}
  if(typeof x!='number'||!isFinite(x))return[['안내','계산할 수 없는 식입니다']];
  return[['계산 결과',x.toLocaleString('ko-KR',{maximumFractionDigits:10}),1]]}},
{k:'sev',n:'퇴직금',nt:'평균임금 방식의 간이 계산입니다. 상여금·연차수당 등이 있으면 결과가 달라질 수 있습니다.',
 f:[['s','입사일','date'],['e','퇴사일','date'],['p','최근 3개월 급여 합계 (세전, 원)','num'],['d','최근 3개월 총 일수','num',92]],
 run:function(v){if(!v.s||!v.e||!v.p||!v.d)return null;var days=Math.round((v.e-v.s)/864e5)+1;
  if(days<365)return[['안내','재직 1년 미만은 퇴직금 대상이 아닙니다']];
  var a=v.p/v.d;return[['재직일수',days+'일'],['1일 평균임금',won(a)],['예상 퇴직금',won(a*30*days/365),1]]}},
{k:'wage',n:'시급·월급',nt:'주 15시간 이상 근무 시 주휴수당이 발생하며 세전 금액입니다. 기본 시급은 코드 상단 최저임금 값입니다.',
 f:[['w','시급 (원)','num',MIN],['h','주 근무시간','num',40]],
 run:function(v){if(!v.w||!v.h)return null;var ho=v.h>=15?Math.min(v.h,40)/40*8:0,m=(v.h+ho)*365/7/12;
  return[['주휴수당 (주)',won(v.w*ho)],['월 환산 근로시간',m.toFixed(1)+'시간'],['월급 (세전)',won(v.w*m),1],['연봉 환산',won(v.w*m*12)]]}},
{k:'loan',n:'대출이자',nt:'고정금리 기준 간이 계산입니다. 거치기간은 "거치 후" 방식에서만 적용되며 총 대출기간에 포함됩니다.',
 f:[['a','대출금 (원)','num'],['r','연 이자율 (%)','num',4.5],['m','총 대출기간 (개월)','num',360],
  ['t','상환 방식','sel',['원리금균등상환','원금균등상환','만기일시상환','거치 후 원리금균등상환']],['g','거치기간 (개월)','num',12]],
 run:function(v){if(!v.a||!v.m)return null;var r=(v.r||0)/1200,n=v.m,A=v.a,pm=function(P,k){return r?P*r/(1-Math.pow(1+r,-k)):P/k};
  if(v.t==0){var p=pm(A,n);return[['월 상환액',won(p),1],['총 상환액',won(p*n)],['총 이자',won(p*n-A)]]}
  if(v.t==1){var ti=A*r*(n+1)/2;return[['첫 달 상환액',won(A/n+A*r),1],['마지막 달 상환액',won(A/n*(1+r))],['총 상환액',won(A+ti)],['총 이자',won(ti)]]}
  if(v.t==2){var mi=A*r;return[['월 이자',won(mi),1],['만기 원금 상환',won(A)],['총 이자',won(mi*n)],['총 상환액',won(A+mi*n)]]}
  var g=v.g||0;if(g>=n)return[['안내','거치기간은 총 대출기간보다 짧아야 합니다']];
  var p2=pm(A,n-g),t2=A*r*g+p2*(n-g)-A;
  return[['거치기간 월 이자',won(A*r)],['거치 이후 월 상환액',won(p2),1],['총 이자',won(t2)],['총 상환액',won(A+t2)]]}},
{k:'save',n:'예금·적금이자',nt:'일반과세 이자소득세 15.4%를 적용한 간이 계산입니다. 적금은 매월 납입액 기준입니다.',
 f:[['a','예치금 또는 월 납입액 (원)','num'],['r','연 이자율 (%)','num',3],['m','기간 (개월)','num',12],
  ['t','방식','sel',['예금 단리','예금 월복리','적금 단리 (매월 납입)']]],
 run:function(v){if(!v.a||!v.m)return null;var r=(v.r||0)/100,pr=v.a,i;
  if(v.t==0)i=v.a*r*v.m/12;else if(v.t==1)i=v.a*(Math.pow(1+r/12,v.m)-1);else{pr=v.a*v.m;i=v.a*(r/12)*v.m*(v.m+1)/2}
  return[['납입 원금',won(pr)],['세전 이자',won(i)],['이자세 (15.4%)',won(i*0.154)],['세후 이자',won(i*0.846)],['만기 수령액 (세후)',won(pr+i*0.846),1]]}},
{k:'vat',n:'부가세',nt:'부가가치세율 10% 기준입니다.',
 f:[['a','금액 (원)','num'],['t','금액 기준','sel',['공급가액 (부가세 별도)','합계금액 (부가세 포함)']]],
 run:function(v){if(!v.a)return null;var s=v.t==0?v.a:v.a/1.1;
  return[['공급가액',won(s)],['부가세',won(s*0.1)],['합계금액',won(s*1.1),1]]}},
{k:'age',n:'만나이·띠',nt:'띠는 입춘(2월 4일) 기준 간이 계산입니다. 1~2월생은 음력 설 기준과 다를 수 있습니다. 기준일은 오늘입니다.',
 f:[['b','생년월일','date']],
 run:function(v){if(!v.b)return null;var b=v.b,t=TD(),y=t.getUTCFullYear()-b.getUTCFullYear(),a=y,
  z=b.getUTCFullYear();if((t.getUTCMonth()-b.getUTCMonth()||t.getUTCDate()-b.getUTCDate())<0)a--;
  if(b.getUTCMonth()<1||(b.getUTCMonth()==1&&b.getUTCDate()<4))z--;
  var zz=Z[((z%12)+12)%12]+'띠';
  return[['생년월일',b.getUTCFullYear()+'.'+P(b.getUTCMonth()+1)+'.'+P(b.getUTCDate())+' ('+zz+')',1],['만 나이',a+'세'],['연 나이',y+'세'],['세는 나이',(y+1)+'세']]}},
{k:'met',n:'만난날',nt:'만난 날을 1일째로 계산합니다. 기념일 날짜 옆의 "지남"은 이미 지난 날짜입니다.',
 f:[['s','처음 만난 날','date']],
 run:function(v){if(!v.s)return null;var t=TD(),n=Math.round((t-v.s)/864e5)+1,r=[];
  r.push(n>0?['오늘은',n+'일째',1]:['안내','아직 만나기 전 날짜입니다',1]);
  [100,200,300,500,1000,2000,3000].forEach(function(k){var d=AD(v.s,k-1);r.push([k+'일',FD(d)+(d<t?' 지남':'')])});
  for(var k=1;k<=5;k++){var d=new Date(Date.UTC(v.s.getUTCFullYear()+k,v.s.getUTCMonth(),v.s.getUTCDate()));r.push([k+'주년',FD(d)+(d<t?' 지남':'')])}
  return r}},
{k:'dday',n:'디데이',nt:'기준일을 비우면 오늘 기준으로 계산합니다.',
 f:[['t','목표일','date'],['b','기준일 (선택)','date']],
 run:function(v){if(!v.t)return null;var b=v.b||TD(),d=Math.round((v.t-b)/864e5),a=Math.abs(d);
  return[['디데이',d>0?'D-'+d:d<0?'D+'+a:'D-Day',1],['목표일',FD(v.t)],['기준일',FD(b)],['주 단위',Math.floor(a/7)+'주 '+a%7+'일']]}},
{k:'bmi',n:'BMI',nt:'대한비만학회 기준(아시아-태평양)입니다. 참고용이며 건강 상태 판단은 전문가와 상담하세요.',
 f:[['h','키 (cm)','num',170],['w','몸무게 (kg)','num']],
 run:function(v){if(!v.h||!v.w)return null;var h=v.h/100,b=v.w/(h*h),
  l=b<18.5?'저체중':b<23?'정상':b<25?'과체중':b<30?'비만 1단계':b<35?'비만 2단계':'비만 3단계';
  return[['BMI',b.toFixed(1),1],['판정',l],['BMI 22 기준 체중',(22*h*h).toFixed(1)+'kg']]}},
{k:'area',n:'평수 환산',nt:'1평 = 3.3058㎡ 기준입니다.',
 f:[['a','면적','num'],['t','변환 방향','sel',['평 → ㎡','㎡ → 평']]],
 run:function(v){if(!v.a)return null;var k=3.305785;
  return v.t==0?[['㎡',(v.a*k).toFixed(2)+'㎡',1]]:[['평',(v.a/k).toFixed(2)+'평',1]]}},
{k:'rent',n:'전월세 전환',nt:'법정 전환율 상한은 한국은행 기준금리에 2%p를 더한 값입니다. 최신 기준금리를 확인해 전환율을 입력하세요.',
 f:[['t','전환 방향','sel',['전세 → 월세','월세 → 전세']],['a','전세금 (전세→월세일 때, 원)','num'],['d','월세 보증금 (원)','num'],['w','월세 (월세→전세일 때, 원)','num'],['r','전월세 전환율 (연 %)','num',5]],
 run:function(v){var r=(v.r||0)/100;if(!r)return null;var d=v.d||0;
  if(v.t==0){if(!v.a)return null;if(d>=v.a)return[['안내','월세 보증금은 전세금보다 작아야 합니다']];
   return[['월세',won((v.a-d)*r/12),1],['월세 보증금',won(d)]]}
  if(!v.w)return null;return[['환산 전세금',won(d+v.w*12/r),1],['월세 보증금',won(d)]]}}
];

function itax(b){var t=[[14e6,.06,0],[50e6,.15,1.26e6],[88e6,.24,5.76e6],[150e6,.35,15.44e6],[300e6,.38,19.94e6],[500e6,.4,25.94e6],[1e9,.42,35.94e6],[Infinity,.45,65.94e6]];for(var i=0;i<t.length;i++)if(b<=t[i][0])return Math.max(0,b*t[i][1]-t[i][2]);return 0}
var pct=function(x,d){return x.toLocaleString('ko-KR',{maximumFractionDigits:d===undefined?2:d})};
C.push(
{k:'broker',n:'중개수수료',nt:'서울시 주택 중개보수 상한요율표 기준입니다. 상한요율 안에서 협의해 정하며 지역 조례에 따라 다를 수 있습니다.',
 f:[['t','거래 종류','sel',['매매·교환','전세·월세 (임대차)']],['a','거래금액 (매매가 또는 보증금, 원)','num'],['m','월세 (월세 계약일 때, 원)','num',0]],
 run:function(v){if(!v.a)return null;var m=v.m||0,base=v.a;
  if(v.t==1&&m>0){var x=v.a+m*100;base=x<5e7?v.a+m*70:x}
  var T=v.t==0?[[5e7,.006,25e4],[2e8,.005,8e5],[9e8,.004,0],[12e8,.005,0],[15e8,.006,0],[Infinity,.007,0]]:[[5e7,.005,2e5],[1e8,.004,3e5],[6e8,.003,0],[12e8,.004,0],[15e8,.005,0],[Infinity,.006,0]];
  var r=T.find(function(x){return base<x[0]}),fee=base*r[1];if(r[2])fee=Math.min(fee,r[2]);
  return[['적용 거래금액',won(base)],['상한요율',pct(r[1]*100,1)+'%'],['한도액',r[2]?won(r[2]):'없음'],['중개보수 상한',won(fee),1],['부가세 10% 포함',won(fee*1.1)]]}},
{k:'unemp',n:'실업급여',nt:'2026년 기준 상한 68,100원, 하한 66,048원(최저임금 80%×8시간)을 적용한 간이 계산입니다. 수급 자격은 고용센터에서 확인하세요.',
 f:[['p','퇴직 전 3개월 임금 총액 (세전, 원)','num'],['d','3개월 총 일수','num',92],['g','연령·장애','sel',['50세 미만','50세 이상 또는 장애인']],['y','고용보험 가입기간','sel',['1년 미만','1~3년 미만','3~5년 미만','5~10년 미만','10년 이상']]],
 run:function(v){if(!v.p||!v.d)return null;var avg=v.p/v.d,lo=MIN*0.8*8,hi=68100,d=avg*0.6,ap=Math.min(Math.max(d,lo),hi);
  var T=[[120,120],[150,180],[180,210],[210,240],[240,270]],days=T[v.y][v.g];
  return[['1일 평균임금',won(avg)],['평균임금의 60%',won(d)],['적용 1일 구직급여',won(ap),1],['소정급여일수',days+'일'],['예상 총 수령액',won(ap*days)],['월 환산 (30일)',won(ap*30)]]}},
{k:'leave',n:'연차',nt:'입사일로 발생 연차를 계산하고, 내가 쓴 연차일수를 빼서 미사용 연차를 자동으로 보여줍니다. 근로기준법 기준 간이 계산입니다. 1년 미만은 매월 개근, 1년 이상은 80% 이상 출근을 가정하고 5인 미만 사업장은 적용되지 않을 수 있습니다.',
 f:[['s','입사일','date'],['e','기준일 (비우면 오늘)','date'],['u','내가 쓴 연차일수','num',0],['w','월 통상임금 (원, 선택)','num']],
 run:function(v){if(!v.s)return null;var e=v.e||TD();if(e<v.s)return[['안내','기준일이 입사일보다 앞섭니다']];
  var y=e.getUTCFullYear()-v.s.getUTCFullYear(),mo=e.getUTCMonth()-v.s.getUTCMonth(),dd=e.getUTCDate()-v.s.getUTCDate();
  var months=y*12+mo-(dd<0?1:0),yrs=Math.floor(months/12),rm=months%12,r=[],n,lbl;
  r.push(['근속기간',yrs+'년 '+rm+'개월']);
  if(months<12){n=Math.min(11,Math.max(0,months));lbl='1년 미만 (매월 개근 시 1일씩)'}else{n=Math.min(25,15+Math.floor((yrs-1)/2));lbl='1년 이상 (80% 이상 출근 시)'}
  r.push(['적용 기준',lbl]);r.push(['발생 연차',n+'일']);
  var us=Math.max(0,v.u||0),left=Math.max(0,n-us);r.push(['사용한 연차',pct(us,1)+'일']);r.push(['미사용 연차',pct(left,1)+'일',1]);if(v.w){var day=v.w/209*8;r.push(['1일 통상임금 (월 209시간 기준)',won(day)]);r.push(['연차수당 (미사용분)',won(day*left),1])}
  return r}},
{k:'inctax',n:'종합소득세',nt:'필요경비를 뺀 소득금액 기준의 간이 계산입니다. 기장세액공제, 자녀세액공제 등은 공제액 칸에 직접 넣어 주세요.',
 f:[['i','종합소득금액 (연, 원)','num'],['d','소득공제 합계 (원, 본인 기본공제 150만원 포함)','num',1500000],['c','세액공제·감면 합계 (원)','num',0]],
 run:function(v){if(!v.i)return null;var base=Math.max(0,v.i-(v.d||0)),cal=itax(base),fin=Math.max(0,cal-(v.c||0)),loc=fin*0.1;
  return[['과세표준',won(base)],['산출세액',won(cal)],['결정세액 (소득세)',won(fin)],['지방소득세 (10%)',won(loc)],['총 납부 세액',won(fin+loc),1],['실효세율',pct((fin+loc)/v.i*100,2)+'%']]}},
{k:'acq',n:'취득세',nt:'주택 매매 취득 기준 간이 계산입니다. 생애최초 감면, 일시적 2주택 등 감면·예외는 반영하지 않으며 조정대상지역은 수시로 바뀝니다.',
 f:[['a','취득가액 (원)','num'],['t','주택 수','sel',['1주택 (기본세율)','조정대상지역 2주택 (8%)','3주택 이상 (12%)']],['s','전용면적','sel',['85㎡ 이하','85㎡ 초과']]],
 run:function(v){if(!v.a)return null;var r,e,f;
  if(v.t==0){r=v.a<=6e8?1:v.a>=9e8?3:(v.a/1e8*2/3-3);e=r*0.1;f=0.2}else if(v.t==1){r=8;e=0.4;f=0.6}else{r=12;e=0.4;f=1.0}
  if(v.s==0)f=0;
  var a=v.a*r/100,b=v.a*e/100,c=v.a*f/100;
  return[['취득세율',pct(r,3)+'%'],['취득세',won(a)],['지방교육세 ('+pct(e,3)+'%)',won(b)],['농어촌특별세 ('+pct(f,1)+'%)',won(c)],['세금 합계',won(a+b+c),1],['실효세율',pct((a+b+c)/v.a*100,3)+'%']]}},
{k:'cgt',n:'양도세',nt:'간이 계산입니다. 다주택 중과, 일시적 2주택, 비과세 특례, 보유기간 통산 등은 반영하지 않습니다. 실제 신고 전 세무 전문가와 확인하세요.',
 f:[['sa','양도가액 (원)','num'],['bu','취득가액 (원)','num'],['ex','필요경비 (원)','num',0],['h','보유기간 (년)','num'],['rs','거주기간 (년)','num',0],['t','구분','sel',['1세대 1주택','그 외 (기본세율)']]],
 run:function(v){if(!v.sa||!v.bu||!v.h)return null;var ex=v.ex||0,gain=v.sa-v.bu-ex,r=[];
  if(gain<=0)return[['양도차익',won(gain)],['예상 세금','0원',1]];
  var hy=Math.floor(v.h),ry=Math.floor(v.rs||0),tg=gain,pd=0,one=(v.t==0);
  r.push(['양도차익',won(gain)]);
  if(one&&v.h>=2){if(v.sa<=12e8){r.push(['비과세 판정','양도가액 12억 이하: 비과세']);r.push(['예상 세금','0원',1]);return r}
   tg=gain*(v.sa-12e8)/v.sa;r.push(['과세 대상 차익 (12억 초과분)',won(tg)])}
  if(one&&v.h>=3&&ry>=2)pd=Math.min(40,hy*4)+Math.min(40,ry*4);else if(v.h>=3)pd=Math.min(30,6+(hy-3)*2);
  var ded=tg*pd/100,inc=tg-ded;
  r.push(['장기보유특별공제 ('+pct(pd,0)+'%)',won(ded)]);r.push(['양도소득금액',won(inc)]);
  var base=Math.max(0,inc-2.5e6);r.push(['기본공제','2,500,000원']);r.push(['과세표준',won(base)]);
  var tax,rl;if(v.h<1){tax=base*0.7;rl='보유 1년 미만 70%'}else if(v.h<2){tax=base*0.6;rl='보유 2년 미만 60%'}else{tax=itax(base);rl='기본세율 6~45%'}
  var lt=tax*0.1;r.push(['적용 세율',rl]);r.push(['산출세액',won(tax)]);r.push(['지방소득세 (10%)',won(lt)]);
  r.push(['예상 총 세금',won(tax+lt),1]);r.push(['세후 차익',won(gain-tax-lt)]);return r}},
{k:'percent',n:'퍼센트',nt:'소수점 입력도 가능합니다.',
 f:[['m','계산 종류','sel',['A의 B%는 얼마?','A는 B의 몇 %?','A에서 B% 증가','A에서 B% 감소','A에서 B로 변화율']],['a','A','num'],['b','B','num']],
 run:function(v){if(isNaN(v.a)||isNaN(v.b))return null;var a=v.a,b=v.b;
  if(v.m==0)return[[pct(a,6)+'의 '+pct(b,6)+'%',pct(a*b/100,6),1]];
  if(v.m==1){if(!b)return[['안내','B는 0일 수 없습니다']];return[['A는 B의',pct(a/b*100,6)+'%',1]]}
  if(v.m==2)return[['증가 후 값',pct(a*(1+b/100),6),1],['증가분',pct(a*b/100,6)]];
  if(v.m==3)return[['감소 후 값',pct(a*(1-b/100),6),1],['감소분',pct(a*b/100,6)]];
  if(!a)return[['안내','A는 0일 수 없습니다']];return[['변화율',pct((b-a)/Math.abs(a)*100,4)+'%',1],['변화량',pct(b-a,6)]]}},
{k:'datecalc',n:'날짜 계산',nt:'영업일은 토·일요일만 제외하며 공휴일은 반영하지 않습니다.',
 f:[['m','계산 종류','sel',['기준일에서 N일 후·전','두 날짜 사이 간격','영업일(주말 제외) N일 후·전']],['d1','기준일 (시작일)','date'],['n','N일','num',100],['g','방향','sel',['이후','이전']],['d2','끝나는 날 (두 날짜 간격 계산용)','date']],
 run:function(v){if(!v.d1)return null;var s=v.d1,r=[];
  if(v.m==0||v.m==2){if(!(v.n>=0)||v.n>100000)return null;var n=Math.floor(v.n),sg=v.g==1?-1:1,d;
   if(v.m==0)d=AD(s,sg*n);else{d=s;var c=0;while(c<n){d=AD(d,sg);var w=d.getUTCDay();if(w!=0&&w!=6)c++}}
   var diff=Math.round((d-TD())/864e5);
   return[['계산 결과',FD(d),1],['기준일',FD(s)],['오늘 기준',diff>0?'D-'+diff:diff<0?'D+'+(-diff):'D-Day']]}
  if(!v.d2)return null;var a=s,b=v.d2;if(b<a){var t=a;a=b;b=t}
  var days=Math.round((b-a)/864e5),y=b.getUTCFullYear()-a.getUTCFullYear(),mo=b.getUTCMonth()-a.getUTCMonth(),dd=b.getUTCDate()-a.getUTCDate();
  if(dd<0){mo--;dd+=new Date(Date.UTC(b.getUTCFullYear(),b.getUTCMonth(),0)).getUTCDate()}
  if(mo<0){y--;mo+=12}
  return[['일수',days+'일',1],['시작일 포함 일수',(days+1)+'일'],['주 단위',Math.floor(days/7)+'주 '+days%7+'일'],['년·월·일',y+'년 '+mo+'개월 '+dd+'일']]}}
);

(function(){
var i=C.findIndex(function(c){return c.k==='sev'});
C[i]={k:'sev',n:'퇴직금',nt:'평균임금 방식의 간이 계산입니다. 세후는 퇴직소득세(근속연수공제·환산급여공제 적용)와 지방소득세를 뺀 금액이며, IRP로 이체해 과세를 미루면 당장 세금을 내지 않을 수 있습니다.',
 f:[['x','결과 기준','sel',['세전 퇴직금','세후 실수령액']],['s','입사일','date'],['e','퇴사일','date'],['p','최근 3개월 급여 합계 (세전, 원)','num'],['d','최근 3개월 총 일수','num',92]],
 run:function(v){if(!v.s||!v.e||!v.p||!v.d)return null;var days=Math.round((v.e-v.s)/864e5)+1;
  if(days<365)return[['안내','재직 1년 미만은 퇴직금 대상이 아닙니다']];
  var a=v.p/v.d,pay=a*30*days/365,N=(function(){var s=v.s,e1=new Date(v.e.getTime()+864e5),y=e1.getUTCFullYear()-s.getUTCFullYear();var an=new Date(Date.UTC(s.getUTCFullYear()+y,s.getUTCMonth(),s.getUTCDate()));if(an>e1){y--;an=new Date(Date.UTC(s.getUTCFullYear()+y,s.getUTCMonth(),s.getUTCDate()))}return Math.max(1,y+(e1>an?1:0))})();
  var cd=N<=5?1e6*N:N<=10?5e6+2e6*(N-5):N<=20?15e6+2.5e6*(N-10):40e6+3e6*(N-20);
  var conv=Math.max(0,(pay-cd)*12/N);
  var cv=conv<=8e6?conv:conv<=7e7?8e6+(conv-8e6)*0.6:conv<=1e8?45.2e6+(conv-7e7)*0.55:conv<=3e8?61.7e6+(conv-1e8)*0.45:151.7e6+(conv-3e8)*0.35;
  var base=Math.max(0,conv-Math.min(cv,conv)),tx=itax(base)*N/12,lt=tx*0.1,net=pay-tx-lt;
  var r=[['재직일수',days+'일'],['1일 평균임금',won(a)]];
  if(v.x==0){r.push(['세전 퇴직금',won(pay),1]);r.push(['예상 퇴직소득세+지방소득세',won(tx+lt)]);r.push(['세후 실수령액',won(net)])}
  else{r.push(['세전 퇴직금',won(pay)]);r.push(['근속연수공제 ('+N+'년)',won(cd)]);r.push(['환산급여',won(conv)]);r.push(['환산급여공제',won(Math.min(cv,conv))]);r.push(['퇴직소득세',won(tx)]);r.push(['지방소득세 (10%)',won(lt)]);r.push(['세후 실수령액',won(net),1])}
  return r}};

function nedD(g){var d=g<=5e6?g*0.7:g<=15e6?3.5e6+(g-5e6)*0.4:g<=45e6?7.5e6+(g-15e6)*0.15:g<=1e8?12e6+(g-45e6)*0.05:14.75e6+(g-1e8)*0.02;return Math.min(d,2e7)}
function netM(sal){var mo=sal/12,pB=Math.min(Math.max(mo,410000),6590000),pen=pB*0.0475,hea=mo*0.03595,car=hea*0.1314,emp=mo*0.009,ins=(pen+hea+car+emp)*12;
 var base=Math.max(0,sal-nedD(sal)-1.5e6-ins),ct=itax(base),cr=ct<=1.3e6?ct*0.55:715000+(ct-1.3e6)*0.3;
 var lim=sal<=33e6?74e4:sal<=70e6?Math.max(66e4,74e4-(sal-33e6)*0.008):sal<=120e6?Math.max(5e5,66e4-(sal-70e6)*0.5):Math.max(2e5,5e5-(sal-120e6)*0.5);
 cr=Math.min(cr,lim)+130000;var it=Math.max(0,ct-cr)/12,lt=it*0.1;return {ins:pen+hea+car+emp,tax:it+lt,net:mo-pen-hea-car-emp-it-lt}}
var wi=C.findIndex(function(c){return c.k==='wage'});
C[wi]={k:'wage',n:'시급·월급',nt:'주 15시간 이상 근무 시 주휴수당이 발생합니다. 세후는 4대보험·소득세를 뺀 간이 계산(부양가족 본인 1명, 비과세 식대 없음), 세후 3.3%는 프리랜서 원천징수 기준이며 실제 급여명세서와 다를 수 있습니다.',
 f:[['x','결과 기준','sel',['세전','세후','세후 3.3%']],['w','시급 (원)','num',MIN],['h','주 근무시간','num',40]],
 run:function(v){if(!v.w||!v.h)return null;var ho=v.h>=15?Math.min(v.h,40)/40*8:0,m=(v.h+ho)*365/7/12,g=v.w*m;
  var h=[['주휴수당 (주)',won(v.w*ho)],['월 환산 근로시간',m.toFixed(1)+'시간']];
  if(v.x==0)return h.concat([['월급 (세전)',won(g),1],['연봉 환산 (세전)',won(g*12)]]);
  if(v.x==2)return h.concat([['월급 (세전)',won(g)],['공제 3.3%',"-"+won(g*0.033)],['월 실수령액 (세후)',won(g*0.967),1],['연 실수령액 (세후)',won(g*0.967*12)]]);
  var n=netM(g*12);return h.concat([['월급 (세전)',won(g)],['4대보험','-'+won(n.ins)],['소득세·지방세','-'+won(n.tax)],['월 실수령액 (세후)',won(n.net),1],['연 실수령액 (세후)',won(n.net*12)],['실수령 비율',pct(n.net/g*100,1)+'%']])}};
function s(k,fn){var c=C.find(function(x){return x.k===k});if(c)c.vis=fn}
s('loan',function(v){return v.t==3?[]:['g']});
s('rent',function(v){return v.t==0?['w']:['a']});
s('datecalc',function(v){return v.m==1?['n','g']:['d2']});
s('broker',function(v){return v.t==1?[]:['m']});
})();

C.push(
{k:'compound',n:'복리·목표금액 적금',nt:'매월 말에 저축하고 수익이 매월 복리로 붙는다고 가정한 참고용 계산입니다. 실제 금융상품의 이자 방식과 세금은 다를 수 있습니다.',
 f:[['t','계산 종류','sel',['만기 금액 구하기','목표 금액 달성 월 저축액']],['m','월 저축액 (원)','num'],['g','목표 금액 (원)','num'],['p','처음 넣는 금액 (원)','num',0],['r','연 수익률 (%)','num',5],['y','기간 (년)','num',10]],
 run:function(v){var y=v.y,r=(v.r||0)/1200,n=Math.round(y*12),p=v.p||0;if(!(n>0))return null;
  var g=r?Math.pow(1+r,n):1,pf=p*g,ann=r?(g-1)/r:n;
  if(v.t==0){if(!v.m&&!p)return null;var m=v.m||0,fv=pf+m*ann,pr=p+m*n,gain=fv-pr;
   return[['납입 원금',won(pr)],['예상 수익 (세전)',won(gain)],['만기 금액 (세전)',won(fv),1],['만기 금액 (세후, 이자세 15.4% 가정)',won(pr+gain*0.846)]]}
  if(!v.g)return null;var need=(v.g-pf)/ann;if(need<=0)return[['안내','처음 넣는 금액만으로 이미 목표에 도달합니다'],['목표 도달 예상 금액',won(pf),1]];
  return[['필요한 월 저축액',won(need),1],['총 납입 원금',won(p+need*n)],['예상 수익 (세전)',won(v.g-p-need*n)]]}},
{k:'dsr',n:'DSR 대출 가능 금액',nt:'연소득 대비 원리금 상환 비율(DSR) 한도 안에서 원리금균등상환 대출을 받을 수 있는 금액의 간이 계산입니다. 실제 심사 결과와 다릅니다.',
 f:[['a','연소득 (원)','num'],['e','기존 대출 연간 원리금 상환액 (원)','num',0],['l','DSR 한도','sel',['은행권 40%','비은행권 50%']],['r','신규 대출 금리 (연 %)','num',4.5],['s','스트레스 가산금리 (%p)','num',0],['y','대출 기간 (년)','num',30]],
 run:function(v){if(!v.a||!v.y)return null;var lim=v.l==1?0.5:0.4,cap=v.a*lim-(v.e||0);
  if(cap<=0)return[['DSR 한도 여유','없음'],['안내','기존 상환액이 한도를 넘어 신규 대출이 어려울 수 있습니다',1]];
  var i=((v.r||0)+(v.s||0))/1200,n=Math.round(v.y*12),pm=cap/12,pr=i?pm*(1-Math.pow(1+i,-n))/i:pm*n;
  return[['DSR 한도 ('+Math.round(lim*100)+'%) 연 상환액',won(v.a*lim)],['신규 대출에 쓸 수 있는 연 상환액',won(cap)],['월 상환 가능액',won(pm)],['대출 가능 금액 (참고)',won(pr),1]]}},
{k:'cartax',n:'자동차세',nt:'비영업용 승용차 기준의 간이 계산입니다. 전기차, 경차 혜택, 연납 공제 등은 반영하지 않았습니다. 정확한 금액은 위택스에서 확인하세요.',
 f:[['c','배기량 (cc)','num'],['a','차령 (등록 후 경과 연수)','num',1]],
 run:function(v){if(!v.c)return null;var rate=v.c<=1000?80:v.c<=1600?140:200,base=v.c*rate,a=v.a||0,red=a>=3?Math.min(50,(a-2)*5):0,tax=base*(1-red/100),edu=tax*0.3,tot=tax+edu;
  return[['cc당 세율',rate+'원'],['기본 자동차세 (연)',won(base)],['차령 감면',red+'%'],['자동차세 (연)',won(tax)],['지방교육세 (30%)',won(edu)],['연간 합계',won(tot),1],['6월·12월 각 납부액',won(tot/2)]]}}
);
(function(){var c=C.find(function(x){return x.k==='compound'});c.vis=function(v){return v.t==0?['g']:['m']}})();

(function(){
var ci=C.findIndex(function(c){return c.k==='compound'}),old=C[ci];
C[ci]={k:'compound',n:old.n,nt:old.nt,
 f:[['x','결과 기준','sel',['세전','세후 (이자세 15.4%)']]].concat(old.f),
 run:function(v){var y=v.y,r=(v.r||0)/1200,n=Math.round(y*12),p=v.p||0,k=v.x==1?0.846:1;if(!(n>0))return null;
  var g=r?Math.pow(1+r,n):1,pf=p*g,ann=r?(g-1)/r:n,tg=v.x==1?'세후':'세전';
  if(v.t==0){if(!v.m&&!p)return null;var m=v.m||0,fv=pf+m*ann,pr=p+m*n,gain=fv-pr;
   return[['납입 원금',won(pr)],['예상 수익 (세전)',won(gain)],['이자세',v.x==1?'-'+won(gain*0.154):'미반영'],['만기 금액 (세전)',won(fv),v.x==1?0:1],['만기 금액 (세후)',won(pr+gain*0.846),v.x==1?1:0]]}
  if(!v.g)return null;var den=n+k*(ann-n),need=(v.g-p-k*(pf-p))/den;
  if(need<=0)return[['안내','처음 넣는 금액만으로 이미 목표('+tg+')에 도달합니다']];
  var pr2=p+need*n,gn=pf+need*ann-pr2;
  return[['필요한 월 저축액',won(need),1],['총 납입 원금',won(pr2)],['예상 수익 (세전)',won(gn)],['목표 금액 ('+tg+')',won(pr2+gn*k)]]}};
})();


C.push({k:'bmr',n:'기초대사량',nt:'미플린-세인트 지어 공식을 쓴 참고용 추정치입니다. 실제 소비량은 체성분·건강 상태에 따라 다릅니다. 감량 목표는 유지 칼로리에서 500kcal를 뺀 값이며 기초대사량 아래로는 내려가지 않게 했습니다. 건강 문제가 있거나 극단적인 감량을 계획한다면 전문가와 상담하세요.',
 f:[['x','성별','sel',['남성','여성']],['a','나이 (세)','num',30],['h','키 (cm)','num',170],['w','몸무게 (kg)','num'],
  ['c','활동량','sel',['거의 안 움직임','가벼운 활동 (주 1~3회)','보통 (주 3~5회)','활발 (주 6~7회)','매우 활발 (육체노동·선수)']],['g','목표','sel',['체중 감량','체중 유지','체중 증량']]],
 run:function(v){if(!v.a||!v.h||!v.w)return null;var b=10*v.w+6.25*v.h-5*v.a+(v.x==0?5:-161),f=[1.2,1.375,1.55,1.725,1.9][v.c],t=b*f,
  g=v.g==0?Math.max(t-500,b):v.g==2?t+300:t,lb=['체중 감량','체중 유지','체중 증량'][v.g];
  return[['기초대사량 (BMR)',won(b)+' kcal'],['활동량 반영 유지 칼로리',won(t)+' kcal'],['하루 목표 칼로리 ('+lb+')',won(g)+' kcal',1]]}});

(function(){
function nn(x){return Math.round(x).toLocaleString('ko-KR')}
function dt(d){return d.getFullYear()+'년 '+(d.getMonth()+1)+'월 '+d.getDate()+'일'}
function ad(d,n){var x=new Date(d.getTime());x.setDate(x.getDate()+n);return x}
function tm(sec){sec=Math.round(sec);var h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return(h?h+'시간 ':'')+m+'분 '+(s<10?'0':'')+s+'초'}
function pc(sec){sec=Math.round(sec);return Math.floor(sec/60)+"'"+((sec%60)<10?'0':'')+(sec%60)+'"'}
C.push(
{k:'duedate',n:'출산예정일',nt:'네겔레 법칙(마지막 생리 시작일+280일)에 주기 보정을 한 참고용 날짜입니다. 실제 예정일은 초음파 검사 결과로 병원에서 정해집니다.',
 f:[['d','마지막 생리 시작일','date'],['c','생리 주기 (일)','num',28]],
 run:function(v){if(!v.d)return null;var c=v.c||28,due=ad(v.d,280+(c-28)),t=new Date();t.setHours(0,0,0,0);
  var el=Math.floor((t-v.d)/864e5)-(c-28),w=Math.floor(el/7),dd=el%7,left=Math.round((due-t)/864e5),
  tri=w<14?'1분기 (~13주)':w<28?'2분기 (14~27주)':'3분기 (28주~)';
  var r=[['출산예정일',dt(due),1]];
  if(el<0)return r.concat([['안내','시작일이 오늘 이후입니다']]);
  r.push(['현재 임신 주수',w+'주 '+dd+'일']);
  r.push([left>=0?'출산까지':'예정일 경과',(left>=0?'D-'+left:Math.abs(left)+'일')]);
  r.push(['현재 시기',tri]);
  r.push(['안정기 (12주 이후)',dt(ad(v.d,84+(c-28)))]);
  r.push(['만삭 (37주)',dt(ad(v.d,259+(c-28)))]);return r}},
{k:'pleave',n:'육아휴직 급여',nt:'고용보험 육아휴직급여의 간이 계산(통상임금 기준, 1~3개월 100% 상한 250만 원 / 4~6개월 100% 상한 200만 원 / 7개월~ 80% 상한 160만 원, 하한 70만 원)입니다. 제도는 해마다 바뀌고 특례가 있으니 고용보험 사이트에서 확인하세요.',
 f:[['w','월 통상임금 (원)','num'],['m','휴직 기간 (개월)','num',12]],
 run:function(v){if(!v.w||!v.m)return null;var m=Math.min(v.m,12),rows=[],tot=0,i,p,cap,lo=700000;
  for(i=1;i<=Math.ceil(m);i++){var f=Math.min(1,m-i+1);if(i<=3){p=v.w;cap=2500000}else if(i<=6){p=v.w;cap=2000000}else{p=v.w*0.8;cap=1600000}
   p=Math.max(Math.min(p,cap),lo);tot+=p*f}
  var a=Math.max(Math.min(v.w,2500000),lo),b=Math.max(Math.min(v.w,2000000),lo),c=Math.max(Math.min(v.w*0.8,1600000),lo);
  var r=[['1~3개월 월 급여',won(a)]];if(m>3)r.push(['4~6개월 월 급여',won(b)]);if(m>6)r.push(['7개월~ 월 급여',won(c)]);
  r.push(['총 예상 급여 ('+m+'개월)',won(tot),1]);r.push(['월 평균',won(tot/m)]);return r}},
{k:'pace',n:'러닝 페이스',nt:'리겔 공식으로 예상한 기록은 컨디션·코스에 따라 달라지는 참고용 값입니다.',
 f:[['d','거리 (km)','num',5],['m','시간 (분)','num',30],['s','시간 (초)','num',0]],
 run:function(v){var t=(v.m||0)*60+(v.s||0);if(!v.d||!t)return null;var pk=t/v.d;
  var r=[['페이스 (km당)',pc(pk)+' /km',1],['속도',(v.d/t*3600).toFixed(2)+' km/h']];
  [[5,'5km'],[10,'10km'],[21.0975,'하프'],[42.195,'풀코스']].forEach(function(x){r.push(['예상 '+x[1],tm(t*Math.pow(x[0]/v.d,1.06))])});return r}},
{k:'burn',n:'운동 소모 칼로리',nt:'MET 값으로 계산한 평균적인 추정치입니다. 강도와 체질에 따라 실제와 다를 수 있습니다.',
 f:[['a','운동 종류','sel',['걷기','빠르게 걷기','조깅','달리기','자전거','수영','등산','웨이트','줄넘기','요가','계단 오르기']],['w','몸무게 (kg)','num'],['m','운동 시간 (분)','num',30]],
 run:function(v){if(!v.w||!v.m)return null;var MET=[3.5,4.3,7,9.8,7.5,8,6.5,5,11,2.5,8.8][v.a],k=MET*v.w*(v.m/60)*1.05;
  return[['소모 칼로리',nn(k)+' kcal',1],['밥 한 공기(300kcal) 환산',(k/300).toFixed(1)+'공기'],['치킨 1조각(약 250kcal) 환산',(k/250).toFixed(1)+'조각'],['운동 강도 (MET)',MET+'']]}},
{k:'orm',n:'1RM 계산',nt:'엡리·브르지키 공식의 평균으로 추정한 값입니다. 10회 이하 세트일수록 정확하며 실제 최대 중량을 시도할 때는 보조자와 함께 안전하게 하세요.',
 f:[['w','들어올린 무게 (kg)','num'],['r','반복 횟수 (회)','num',5]],
 run:function(v){if(!v.w||!v.r||v.r>30)return null;var e=v.w*(1+v.r/30),b=v.r<37?v.w*36/(37-v.r):e,o=(e+b)/2;
  var r=[['예상 1RM',o.toFixed(1)+' kg',1]];[95,90,85,80,75,70,60].forEach(function(p){r.push([p+'% 무게',(o*p/100).toFixed(1)+' kg'])});return r}},
{k:'petage',n:'반려동물 나이 환산',nt:'널리 쓰이는 환산 방식(1살=15세, 2살=24세, 이후 크기별 연 4~6세 추가)입니다. 품종과 개체마다 다릅니다.',
 f:[['t','종류·크기','sel',['소형견 (10kg 미만)','중형견 (10~25kg)','대형견 (25kg 이상)','고양이']],['a','나이 (살, 6개월은 0.5)','num']],
 run:function(v){if(!v.a)return null;var a=v.a,add=[4,5,6,4][v.t],h=a<=1?a*15:a<=2?15+(a-1)*9:24+(a-2)*add,st=a<1?'아기':a<3?'청소년':a<7?'성년':a<11?'중년':'노년';
  return[['사람 나이로',Math.round(h)+'세',1],['생애 단계',st]]}},
{k:'petfood',n:'반려동물 사료량',nt:'휴식 에너지(RER) 공식으로 추정한 하루 권장량입니다. 개체의 건강 상태에 따라 다르므로 수의사와 상담하세요. 사료 포장지의 급여량도 함께 확인하세요.',
 f:[['t','종류','sel',['강아지·성견','고양이']],['w','몸무게 (kg)','num'],['s','상태','sel',['중성화 완료','중성화 전','체중 감량 중','성장기 (1살 미만)','노령']],['k','사료 열량 (kcal/kg)','num',3500]],
 run:function(v){if(!v.w||!v.k)return null;var f=v.t==0?[1.6,1.8,1.0,2.0,1.4][v.s]:[1.2,1.4,0.8,2.5,1.1][v.s],rer=70*Math.pow(v.w,0.75),k=rer*f,g=k/v.k*1000;
  return[['하루 권장 열량',nn(k)+' kcal'],['하루 사료량',nn(g)+' g',1],['2회 급여 시 1회',nn(g/2)+' g'],['기초 에너지 (RER)',nn(rer)+' kcal']]}}
);
})();

// ---- 만나이·띠: 양력/음력/음력(윤달) 선택 ----
(function(){
var LF=new Intl.DateTimeFormat('en-u-ca-chinese',{timeZone:'Asia/Seoul',year:'numeric',month:'numeric',day:'numeric'});
function pm(o){var t=String(o.month);return{n:parseInt(t,10),lp:/[^0-9]/.test(t)}}
function l2s(y,m,d,leap){var t0=Date.UTC(y,0,20,3);
 for(var i=0;i<430;i++){var dt=new Date(t0+i*864e5),o={};LF.formatToParts(dt).forEach(function(q){o[q.type]=q.value});
  var q2=pm(o);if(+o.relatedYear===y&&q2.n===m&&q2.lp===!!leap&&+o.day===d)return new Date(Date.UTC(dt.getUTCFullYear(),dt.getUTCMonth(),dt.getUTCDate()))}
 return null}
var Zn=['원숭이','닭','개','돼지','쥐','소','호랑이','토끼','용','뱀','말','양'];
var pad=function(n){return n<10?'0'+n:''+n};
for(var i=0;i<C.length;i++){if(C[i].k!=='age')continue;
 C[i].f=[['c','달력 기준','sel',['양력','음력','음력 (윤달)']],['b','생년월일 (음력이면 음력 날짜)','date']];
 C[i].nt='띠는 입춘(2월 4일) 기준 간이 계산입니다. 1~2월생은 음력 설 기준과 다를 수 있습니다. 음력은 양력으로 바꿔서 계산합니다. 기준일은 오늘입니다.';
 C[i].run=function(v){if(!v.b)return null;var raw=v.b,b=raw,lunarTxt=null;
  if(v.c>0){b=l2s(raw.getUTCFullYear(),raw.getUTCMonth()+1,raw.getUTCDate(),v.c===2);
   if(!b)return[['안내',v.c===2?'그 해에는 해당 윤달이 없어요. 달력 기준을 확인해 주세요':'없는 음력 날짜예요. 그 달이 29일까지인지 확인해 주세요',1]];
   lunarTxt='음력 '+raw.getUTCFullYear()+'.'+pad(raw.getUTCMonth()+1)+'.'+pad(raw.getUTCDate())+(v.c===2?' (윤달)':'')}
  var t=TD(),y=t.getUTCFullYear()-b.getUTCFullYear(),a=y,z=b.getUTCFullYear();
  if(b.getTime()>t.getTime())return null;
  if((t.getUTCMonth()-b.getUTCMonth()||t.getUTCDate()-b.getUTCDate())<0)a--;
  if(b.getUTCMonth()<1||(b.getUTCMonth()==1&&b.getUTCDate()<4))z--;
  var zz=Zn[((z%12)+12)%12]+'띠',sol=b.getUTCFullYear()+'.'+pad(b.getUTCMonth()+1)+'.'+pad(b.getUTCDate());
  var rows=[];
  if(lunarTxt){rows.push(['입력한 생일',lunarTxt]);rows.push(['양력 생년월일',sol+' ('+zz+')',1])}
  else rows.push(['생년월일',sol+' ('+zz+')',1]);
  rows.push(['만 나이',a+'세'],['연 나이',y+'세'],['세는 나이',(y+1)+'세']);return rows}}
})();

var cur=C.findIndex(function(c){return c.k===window.CALC_KEY});var c=C[cur];
function build(){var h='';
 document.getElementById('nt').textContent=c.nt;
 c.f.forEach(function(f){h+='<div class="fld" id="w_'+f[0]+'"><label for="f_'+f[0]+'">'+f[1]+'</label>';
  if(f[2]=='sel')h+='<select id="f_'+f[0]+'">'+f[3].map(function(o,k){return'<option value="'+k+'">'+o+'</option>'}).join('')+'</select>';
  else if(f[2]=='txt')h+='<input id="f_'+f[0]+'" autocomplete="off" placeholder="'+f[3]+'">';
  else if(f[2]=='date')h+='<input id="f_'+f[0]+'" type="date">';
  else h+='<input id="f_'+f[0]+'" inputmode="decimal" value="'+(f[3]!==undefined?Number(f[3]).toLocaleString('ko-KR'):'')+'">';
  h+='</div>'});
 document.getElementById('form').innerHTML=h;
 c.f.forEach(function(f){if(f[2]=='num'){var el=document.getElementById('f_'+f[0]);
  el.addEventListener('input',function(){var d=el.value.replace(/[^\d.]/g,''),p=d.split('.');el.value=p[0]?Number(p[0]).toLocaleString('ko-KR')+(p.length>1?'.'+p[1]:''):d})}})}
function vals(){var v={};
 c.f.forEach(function(f){var x=document.getElementById('f_'+f[0]).value;
  v[f[0]]=f[2]=='date'?(x?new Date(x):null):f[2]=='sel'?Number(x):f[2]=='txt'?x:parseFloat(x.replace(/,/g,''))});return v}
function vis(){if(!c.vis)return;var h=c.vis(vals())||[];c.f.forEach(function(f){document.getElementById('w_'+f[0]).hidden=h.indexOf(f[0])>=0})}
function go(){var v=vals();
 var r=c.run(v);if(!r){alert('입력값을 확인해 주세요');return}
 document.getElementById('tb').innerHTML=r.map(function(x){return'<tr'+(x[2]?' class="b"':'')+'><td>'+x[0]+'</td><td>'+x[1]+'</td></tr>'}).join('');
 var sb=document.getElementById('share');
 if(!sb){sb=document.createElement('button');sb.id='share';sb.type='button';sb.className='sh';sb.textContent='결과 공유·복사';document.getElementById('tb').insertAdjacentElement('afterend',sb);sb.onclick=function(){if(window.shareText)window.shareText(sb._t,sb)}}
 sb._t=c.n+' 계산 결과\n'+r.map(function(x){return x[0]+': '+x[1]}).join('\n')+'\n'+location.href;if(window.LCLink)LCLink.attach(c.k,v,r)}
build();vis();document.getElementById('form').addEventListener('input',vis);document.getElementById('form').addEventListener('change',vis);document.getElementById('go').onclick=go;
document.getElementById('form').addEventListener('keydown',function(e){if(e.key==='Enter')go()});
