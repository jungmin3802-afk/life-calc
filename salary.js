(function(){
var $=function(i){return document.getElementById(i)};
// 2026.7~2027.6 적용: 국민연금 4.75%(상한 659만·하한 41만), 건강 3.595%, 장기요양 13.14%, 고용 0.9%. 매년 확인 필요
var R={pension:0.0475,pensionMax:6590000,pensionMin:410000,health:0.03595,care:0.1314,emp:0.009};
var mode='y',fam=1,meal=200000,done=false;
var L={y:['연봉 (세전, 원)','예: 40,000,000',[10000000,1000000,100000]],m:['월급 (세전, 원)','예: 3,500,000',[1000000,100000,10000]],
 nm:['받고 싶은 월 실수령액 (세후, 원)','예: 3,000,000',[1000000,100000,10000]],ny:['받고 싶은 연 실수령액 (세후, 원)','예: 36,000,000',[10000000,1000000,100000]]};
function won(n){return Math.round(n).toLocaleString('ko-KR')+'원'}
function earnedDed(g){var d=g<=5e6?g*0.7:g<=15e6?3.5e6+(g-5e6)*0.4:g<=45e6?7.5e6+(g-15e6)*0.15:g<=1e8?12e6+(g-45e6)*0.05:14.75e6+(g-1e8)*0.02;return Math.min(d,2e7)}
function tax(b){var t=[[14e6,.06,0],[50e6,.15,1.26e6],[88e6,.24,5.76e6],[150e6,.35,15.44e6],[300e6,.38,19.94e6],[500e6,.4,25.94e6],[1e9,.42,35.94e6],[Infinity,.45,65.94e6]];
 for(var i=0;i<t.length;i++)if(b<=t[i][0])return Math.max(0,b*t[i][1]-t[i][2]);return 0}
function calc(sal,fam,mealM){
 var m12=Math.min(mealM*12,sal),monthly=sal/12,taxable=(sal-m12)/12;
 var pBase=Math.min(Math.max(taxable,R.pensionMin),R.pensionMax);
 var pen=pBase*R.pension,hea=taxable*R.health,car=hea*R.care,emp=taxable*R.emp;
 var g=sal-m12,ins=(pen+hea+car+emp)*12;
 var base=Math.max(0,g-earnedDed(g)-fam*1.5e6-ins),ct=tax(base),cr;
 cr=ct<=1.3e6?ct*0.55:715000+(ct-1.3e6)*0.3;
 var lim=g<=33e6?74e4:g<=70e6?Math.max(66e4,74e4-(g-33e6)*0.008):g<=120e6?Math.max(5e5,66e4-(g-70e6)*0.5):Math.max(2e5,5e5-(g-120e6)*0.5);
 cr=Math.min(cr,lim)+130000;
 var it=Math.max(0,ct-cr)/12,lt=it*0.1,ded=pen+hea+car+emp+it+lt;
 return {sal:sal,monthly:monthly,pen:pen,hea:hea,car:car,emp:emp,it:it,lt:lt,ded:ded,net:monthly-ded}}
function solve(targetMonthlyNet){var lo=0,hi=5e9;for(var i=0;i<80;i++){var mid=(lo+hi)/2;if(calc(mid,fam,meal).net<targetMonthlyNet)lo=mid;else hi=mid}return hi}
function val(){return Number($('sal').value.replace(/\D/g,''))||0}
function run(){
 var v=val(),out=$('out');if(!v){out.hidden=true;return}
 var sal,note='';
 if(mode==='y')sal=v;else if(mode==='m')sal=v*12;
 else{var t=mode==='nm'?v:v/12;sal=solve(t);
  if(sal>=4.99e9){out.hidden=true;return}
  sal=Math.ceil(sal/1000)*1000;note='세후 금액에 맞춰 세전 연봉을 거꾸로 계산한 값입니다(천원 단위 올림).'}
 var r=calc(sal,fam,meal),rows;
 if(mode==='nm'||mode==='ny'){$('nl').textContent='필요한 연봉 (세전)';$('net').textContent=won(sal);
  rows=[['월 급여 (세전)',won(r.monthly)],['월 실수령액',won(r.net),1]]}
 else{$('nl').textContent='월 실수령액';$('net').textContent=won(r.net);rows=[['연봉 (세전)',won(sal)],['월 급여 (세전)',won(r.monthly)]]}
 rows=rows.concat([['국민연금','-'+won(r.pen)],['건강보험','-'+won(r.hea)],['장기요양보험','-'+won(r.car)],['고용보험','-'+won(r.emp)],['소득세','-'+won(r.it)],['지방소득세','-'+won(r.lt)],['공제 합계','-'+won(r.ded),1]]);
 if(mode==='nm'||mode==='ny')rows.splice(2,0,['연 실수령액',won(r.net*12)]);
 else rows.push(['연 실수령액',won(r.net*12)]);
 $('tb').innerHTML=rows.map(function(x){return '<tr'+(x[2]?' class="b"':'')+'><td>'+x[0]+'</td><td>'+x[1]+'</td></tr>'}).join('');
 $('snote').textContent=note;$('snote').hidden=!note;
 out.hidden=false;
 $('sh').setAttribute('data-t','연봉 실수령액 계산 결과\n'+(mode==='nm'||mode==='ny'?'필요 연봉(세전): '+won(sal)+'\n':'')+'월 실수령액: '+won(r.net)+'\n공제 합계: '+won(r.ded)+'\n'+location.href)}
function setMode(m){mode=m;$('slab').textContent=L[m][0];$('sal').placeholder=L[m][1];
 [].forEach.call($('smode').children,function(b){b.setAttribute('aria-checked',b.getAttribute('data-m')===m?'true':'false')});
 var q=L[m][2];$('sqk').innerHTML=q.map(function(a){return '<button type="button" data-a="'+a+'">+'+(a>=10000?(a/10000).toLocaleString('ko-KR')+'만':a.toLocaleString('ko-KR'))+'</button>'}).join('')+'<button type="button" data-a="0" class="clr">지우기</button>';
 if(done)run()}
$('smode').addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(b)setMode(b.getAttribute('data-m'))});
$('sqk').addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;var a=+b.getAttribute('data-a');
 var n=a?val()+a:0;$('sal').value=n?n.toLocaleString('ko-KR'):'';done=done||!!n;run()});
$('sal').addEventListener('input',function(){var d=this.value.replace(/\D/g,'');this.value=d?Number(d).toLocaleString('ko-KR'):'';if(done)run()});
$('sal').addEventListener('keydown',function(e){if(e.key==='Enter'){done=true;run()}});
$('smeal').addEventListener('click',function(e){var b=e.target.closest('[data-v]');if(!b)return;meal=+b.getAttribute('data-v');
 [].forEach.call(this.children,function(x){x.setAttribute('aria-checked',x===b?'true':'false')});if(done)run()});
function setFam(n){fam=Math.max(1,Math.min(10,n));$('fv').textContent=fam+'명';if(done)run()}
$('fm').onclick=function(){setFam(fam-1)};$('fp').onclick=function(){setFam(fam+1)};
$('go').onclick=function(){done=true;if(!val()){$('sal').focus();return}run();$('out').scrollIntoView({behavior:'smooth',block:'start'})};
$('sh').onclick=function(){if(window.shareText)window.shareText(this.getAttribute('data-t'),this)};
setMode('y');
})();
