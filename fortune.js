(function(){
var $=function(i){return document.getElementById(i)},S=window.LCStore;
var Z=['원숭이','닭','개','돼지','쥐','소','호랑이','토끼','용','뱀','말','양'],ZE=['🐵','🐔','🐶','🐷','🐭','🐮','🐯','🐰','🐲','🐍','🐴','🐑'];
var STAR=[['염소자리',12,22],['물병자리',1,20],['물고기자리',2,19],['양자리',3,21],['황소자리',4,20],['쌍둥이자리',5,21],['게자리',6,22],['사자자리',7,23],['처녀자리',8,23],['천칭자리',9,23],['전갈자리',10,23],['사수자리',11,23],['염소자리',12,22]];
function star(m,d){var r='염소자리';for(var i=0;i<STAR.length;i++){var s=STAR[i];if(m>s[1]||(m===s[1]&&d>=s[2]))r=s[0]}return r}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){var a=seed;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
var TXT={
 total:{h:['오늘은 하는 일마다 술술 풀리는 날이에요. 미뤄둔 일에 도전해 보세요.','좋은 기운이 가득한 하루예요. 주변 사람들에게 먼저 다가가면 행운이 커져요.','뜻밖의 좋은 소식이 들릴 수 있어요. 자신감을 갖고 움직이세요.'],
  m:['무난하고 안정적인 하루예요. 평소 하던 대로만 해도 충분해요.','큰 굴곡 없이 차분히 흘러가는 날이에요. 작은 즐거움을 챙겨보세요.','한 걸음 느려도 괜찮아요. 꾸준함이 결국 힘이 됩니다.'],
  l:['서두르면 실수가 나올 수 있어요. 한 번 더 확인하고 천천히 움직이세요.','조금 지치는 날이에요. 무리하지 말고 일찍 쉬는 게 좋아요.','기대만큼 안 풀려도 자책은 금물이에요. 내일이 더 나을 거예요.']},
 money:{h:['뜻밖의 수입이나 좋은 거래가 기대돼요.','투자한 시간과 노력이 보상받는 날이에요.','작은 지출을 아끼면 큰 이득으로 돌아와요.'],m:['수입과 지출이 균형을 이루는 날이에요.','계획한 예산 안에서 지내면 무난해요.','필요한 것만 사는 알뜰함이 빛나요.'],l:['충동구매를 조심하세요. 결제 전에 한 번 더 생각해요.','돈 이야기가 얽힌 약속은 신중히 하세요.','새는 지출이 없는지 점검해 보세요.']},
 love:{h:['따뜻한 말 한마디가 마음을 크게 움직여요.','좋은 인연이나 설레는 연락이 올 수 있어요.','연인·가족과 함께하는 시간이 특히 행복해요.'],m:['평온한 관계가 이어지는 날이에요.','안부 메시지 하나가 관계를 더 단단하게 해줘요.','상대의 이야기를 끝까지 들어주면 좋아요.'],l:['사소한 말투가 오해를 만들 수 있어요. 한 박자 쉬고 말하세요.','감정이 앞서기 쉬운 날, 중요한 대화는 미루세요.','혼자만의 시간이 오히려 마음을 편하게 해요.']},
 health:{h:['컨디션이 좋아요. 가벼운 운동을 하기 딱 좋은 날이에요.','에너지가 넘쳐요. 산책이나 스트레칭을 추천해요.','몸도 마음도 가벼운 하루예요.'],m:['특별한 문제 없이 평범한 컨디션이에요.','물을 자주 마시면 더 개운해져요.','규칙적인 식사가 도움이 돼요.'],l:['피로가 쌓이기 쉬워요. 충분한 수면이 필요해요.','목·어깨가 뻐근할 수 있어요. 자주 스트레칭하세요.','찬 음식과 과식은 피하세요.']},
 work:{h:['집중력이 높아 성과가 잘 나는 날이에요.','좋은 아이디어가 떠올라요. 바로 메모하세요.','주변의 도움으로 일이 순조롭게 풀려요.'],m:['맡은 일을 차근차근 하면 무난해요.','계획표를 정리하면 효율이 올라요.','협업할 때 배려가 좋은 평가로 이어져요.'],l:['실수하기 쉬운 날이에요. 마감 전 확인은 필수예요.','의견 충돌이 있어도 감정적으로 대응하지 마세요.','욕심을 줄이고 우선순위 하나에 집중하세요.']}
};
var COLORS=[['빨강','#E5484D'],['주황','#F5862B'],['노랑','#F2C230'],['초록','#2FA66A'],['하늘','#3AA6F2'],['파랑','#3B5BDB'],['보라','#8B5CF6'],['분홍','#F06595'],['하양','#E9ECEF'],['검정','#343A40']];
var DIR=['동쪽','서쪽','남쪽','북쪽','남동쪽','북동쪽','남서쪽','북서쪽'];
var TIP=['물 한 잔 마시고 시작하세요.','오늘 하루 딱 한 번, 누군가에게 고맙다고 말해보세요.','휴대폰을 잠시 내려놓고 5분 걸어보세요.','중요한 결정은 점심 이후가 좋아요.','책상 위를 정리하면 마음도 정리돼요.','좋아하는 음악으로 하루를 열어보세요.','작은 목표 하나만 확실히 끝내세요.','저녁엔 일찍 쉬는 것이 최고의 보약이에요.','웃는 얼굴이 오늘의 행운 부적이에요.','미뤄둔 연락 하나를 해보세요.'];
var LV=function(s){return s>=80?'h':s>=60?'m':'l'};
var EMO={h:'😆',m:'🙂',l:'😌'};
function today(){var d=new Date();return d.getFullYear()+'-'+S.pad(d.getMonth()+1)+'-'+S.pad(d.getDate())}
function zodiac(y,m,d){var yy=y;if(m<2||(m===2&&d<4))yy--;return ((yy%12)+12)%12}
function make(b){
 var p=b.split('-').map(Number),t=today(),r=rng(hash(b+'|'+t));
 function sc(){return Math.round(45+r()*54)}
 var money=sc(),love=sc(),health=sc(),work=sc(),total=Math.round((money+love+health+work)/4+ (r()*8-4));
 total=Math.max(40,Math.min(99,total));
 function pick(a){return a[Math.floor(r()*a.length)]}
 var z=zodiac(p[0],p[1],p[2]),c=pick(COLORS),n=[];
 while(n.length<6){var x=1+Math.floor(r()*45);if(n.indexOf(x)<0)n.push(x)}n.sort(function(a,b){return a-b});
 return {z:z,star:star(p[1],p[2]),total:total,tt:pick(TXT.total[LV(total)]),
  cats:[['💰','재물운',money,pick(TXT.money[LV(money)])],['💕','애정운',love,pick(TXT.love[LV(love)])],['🍀','건강운',health,pick(TXT.health[LV(health)])],['💼','직장·학업운',work,pick(TXT.work[LV(work)])]],
  color:c,nums:n,dir:pick(DIR),time:(6+Math.floor(r()*16))+'시',tip:pick(TIP)}}
function render(f){
 var d=new Date(),ds=(d.getMonth()+1)+'월 '+d.getDate()+'일 ('+'일월화수목금토'[d.getDay()]+')';
 var h='<div class="fh"><span class="fz">'+ZE[f.z]+'</span><div><b>'+Z[f.z]+'띠 · '+f.star+'</b><small>'+ds+' 운세</small></div></div>';
 h+='<div class="fscore"><span>'+EMO[LV(f.total)]+'</span><div><small>오늘의 총운</small><b>'+f.total+'점</b></div></div><p class="ftt"></p>';
 h+='<div class="fcats">'+f.cats.map(function(c,i){return '<div class="fc"><div class="fct"><span>'+c[0]+' '+c[1]+'</span><b>'+c[2]+'점</b></div><div class="fbar"><i style="width:'+c[2]+'%"></i></div><p data-i="'+i+'"></p></div>'}).join('')+'</div>';
 h+='<h3 class="hh">오늘의 행운</h3><div class="flk"><div><span>행운의 색</span><b><i class="dot" style="background:'+f.color[1]+'"></i>'+f.color[0]+'</b></div><div class="fwn"><span>행운의 숫자</span><b>'+f.nums.join(' · ')+'</b></div><div><span>좋은 방향</span><b>'+f.dir+'</b></div><div><span>좋은 시간</span><b>'+f.time+'</b></div></div>';
 h+='<div class="ftip"><span>💌 오늘의 한마디</span><p></p></div>';
 $('fres').innerHTML=h;$('fres').hidden=false;
 $('fres').querySelector('.ftt').textContent=f.tt;
 f.cats.forEach(function(c,i){$('fres').querySelector('[data-i="'+i+'"]').textContent=c[3]});
 $('fres').querySelector('.ftip p').textContent=f.tip;
 $('fshare').hidden=false;
 $('fshare')._t='오늘의 운세 ('+Z[f.z]+'띠 · '+f.star+')\n총운 '+f.total+'점 — '+f.tt+'\n'+f.cats.map(function(c){return c[1]+' '+c[2]+'점'}).join(' / ')+'\n행운의 색 '+f.color[0]+', 숫자 '+f.nums.join('·')+'\n(재미로 보는 운세)\n'+location.href}
function go(){
 var v=$('fb').value;if(!v){$('fb').focus();$('fmsg').textContent='생년월일을 먼저 골라 주세요.';return}
 var y=+v.slice(0,4);if(y<1900||y>new Date().getFullYear()){$('fmsg').textContent='생년월일을 확인해 주세요.';return}
 $('fmsg').textContent='';S.set('lc_fortune_birth',v);render(make(v));$('fres').scrollIntoView({behavior:'smooth',block:'start'})}
$('go').onclick=go;
$('fshare').onclick=function(){if(window.shareText)window.shareText(this._t,this)};
var sv=S.get('lc_fortune_birth',null);if(sv){$('fb').value=sv;render(make(sv))}
})();
