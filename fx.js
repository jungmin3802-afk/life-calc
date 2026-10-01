(function(){
var CUR=[['KRW','대한민국 원','🇰🇷',1,'원'],['USD','미국 달러','🇺🇸',1,'달러'],['JPY','일본 엔','🇯🇵',100,'엔'],['EUR','유럽 유로','🇪🇺',1,'유로'],['CNY','중국 위안','🇨🇳',1,'위안'],['HKD','홍콩 달러','🇭🇰',1,'홍콩달러'],['GBP','영국 파운드','🇬🇧',1,'파운드'],['AUD','호주 달러','🇦🇺',1,'호주달러'],['CAD','캐나다 달러','🇨🇦',1,'캐나다달러'],['NZD','뉴질랜드 달러','🇳🇿',1,'뉴질랜드달러'],['THB','태국 바트','🇹🇭',1,'바트'],['VND','베트남 동','🇻🇳',100,'동'],['TWD','대만 달러','🇹🇼',1,'대만달러'],['PHP','필리핀 페소','🇵🇭',1,'페소']];
var NEED=CUR.slice(1).map(function(c){return c[0]});
function up(o){var x={};for(var k in o)x[k.toUpperCase()]=o[k];return x}
// R[통화] = 원화 1원당 해당 통화 단위 수
var SRC=[
 {n:'Coinbase 시장 환율',live:true,u:'https://api.coinbase.com/v2/exchange-rates?currency=USD',p:function(j){var r=j.data.rates,k=parseFloat(r.KRW),o={};if(!(k>0))throw 0;for(var c in r)o[c]=parseFloat(r[c])/k;o.USD=1/k;return{r:o,t:new Date()}}},
 {n:'ExchangeRate-API',u:'https://open.er-api.com/v6/latest/KRW',p:function(j){if(j.result!=='success')throw 0;return{r:j.rates,t:j.time_last_update_utc?new Date(j.time_last_update_utc):null}}},
 {n:'Currency-API',u:'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json',p:function(j){return{r:up(j.krw),t:j.date?new Date(j.date+'T00:00:00Z'):null}}},
 {n:'Currency-API',u:'https://latest.currency-api.pages.dev/v1/currencies/krw.json',p:function(j){return{r:up(j.krw),t:j.date?new Date(j.date+'T00:00:00Z'):null}}}
];
var R=null,T=null,SN='',LIVE=false,from='USD',to='KRW',$=function(i){return document.getElementById(i)};
function info(c){for(var i=0;i<CUR.length;i++)if(CUR[i][0]===c)return CUR[i]}
function rateOf(c){return c==='KRW'?1:R[c]}
function fmt(n,c){var d=(c==='KRW'||c==='VND')?0:2;return n.toLocaleString('ko-KR',{minimumFractionDigits:d,maximumFractionDigits:d})}
function fmtRate(x){return x.toLocaleString('ko-KR',{maximumFractionDigits:x>=100?2:x>=1?3:5})}
function kst(d){return d.toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})}
function amount(){var a=parseFloat(($('amt').value||'').replace(/,/g,''));return isFinite(a)?a:NaN}
function curBtn(id,c){var i=info(c);$(id).innerHTML='<span>'+i[2]+' '+c+'</span><small>'+i[1]+'</small>'}
function calc(){
 curBtn('bfrom',from);curBtn('bto',to);
 if(!R){$('res').textContent='…';return}
 var a=amount(),one=1/rateOf(from)*rateOf(to);
 $('res').textContent=isFinite(a)?fmt(a/rateOf(from)*rateOf(to),to):'0';
 var fi=info(from),ti=info(to);
 $('hero').textContent='1 '+from+' = '+fmtRate(one)+' '+to;
 $('nt').textContent='국제 시장 환율 기준이며 은행·환전소의 실제 매매 환율과 수수료는 다릅니다.';
 var q=$('qa'),L=from==='KRW'?[1000,10000,50000,100000,1000000]:from==='JPY'||from==='VND'?[100,1000,10000,100000]:[1,10,100,1000,10000];
 q.innerHTML=L.map(function(v){return '<button type="button" data-q="'+v+'">'+v.toLocaleString('ko-KR')+'</button>'}).join('')}
function status(){
 if(!R)return;
 $('live').textContent=LIVE?'● 실시간 시장 환율':'● 일 1회 갱신 환율';
 $('live').style.background=LIVE?'rgba(255,255,255,.28)':'rgba(255,200,80,.5)';
 $('stamp2').textContent=(LIVE?'조회 ':'기준 ')+(T&&!isNaN(T)?kst(T):'')+' (KST) · 출처 '+SN+(LIVE?' · 1분마다 자동 갱신':'');
 $('stamp').textContent='원화 기준 1단위(엔·동은 100단위) 가격입니다. 눌러서 바로 계산해 보세요. 출처: '+SN}
function list(){
 if(!R)return;
 $('rt').innerHTML=CUR.slice(1).map(function(c){var u=c[3],v=u/R[c[0]];
  return '<button type="button" class="fxr" data-c="'+c[0]+'"><span class="fl">'+c[2]+'</span><span class="nm"><b>'+c[1]+'</b><small>'+u+' '+c[0]+'</small></span><span class="pr">'+v.toLocaleString('ko-KR',{minimumFractionDigits:2,maximumFractionDigits:2})+'<small>원</small></span></button>'}).join('')}
function pick(which){
 var o=document.createElement('div');o.id='dpo';var s=document.createElement('div');s.id='dps';o.appendChild(s);document.body.appendChild(o);document.body.style.overflow='hidden';
 var cur=which==='f'?from:to;
 s.innerHTML='<div class="hd"><small>통화 선택</small><b>'+(which==='f'?'바꿀 통화':'받을 통화')+'</b></div><div class="cpk" style="padding-top:14px">'+CUR.map(function(c){return '<button type="button" data-c="'+c[0]+'"'+(c[0]===cur?' class="on"':'')+'><span class="fl">'+c[2]+'</span><span><b>'+c[0]+'</b><small>'+c[1]+'</small></span></button>'}).join('')+'</div><div class="dft"><button type="button" class="ok" data-x="1">닫기</button></div>';
 function close(){o.remove();document.body.style.overflow=''}
 s.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-x')){close();return}
  var c=b.getAttribute('data-c');if(which==='f'){from=c;if(to===from)to=cur}else{to=c;if(from===to)from=cur}calc();close()});
 o.addEventListener('click',function(e){if(e.target===o)close()})}
$('bfrom').onclick=function(){pick('f')};$('bto').onclick=function(){pick('t')};
$('swap').onclick=function(){var x=from;from=to;to=x;calc()};
$('amt').addEventListener('input',function(){var d=this.value.replace(/[^\d.]/g,''),p=d.split('.');this.value=p[0]?Number(p[0]).toLocaleString('ko-KR')+(p.length>1?'.'+p[1]:''):d;calc()});
$('qa').addEventListener('click',function(e){var b=e.target.closest('[data-q]');if(!b)return;$('amt').value=Number(b.getAttribute('data-q')).toLocaleString('ko-KR');calc()});
$('rt').addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;from=b.getAttribute('data-c');to='KRW';var u=info(from)[3];$('amt').value=String(u);calc();window.scrollTo({top:0,behavior:'smooth'})});
function ok(o){for(var k=0;k<NEED.length;k++)if(!(o.r[NEED[k]]>0))return false;return true}
function load(i,manual){
 if(i>=SRC.length){if(!R){$('live').textContent='● 환율을 불러오지 못했어요';$('hero').textContent='잠시 후 새로고침을 눌러 주세요'}$('refresh').classList.remove('sp');return}
 fetch(SRC[i].u,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
  var o=SRC[i].p(j);if(!ok(o))throw 0;
  R=o.r;T=o.t;SN=SRC[i].n;LIVE=!!SRC[i].live;calc();list();status();$('refresh').classList.remove('sp')}).catch(function(){load(i+1,manual)})}
$('refresh').onclick=function(){this.classList.add('sp');load(0,true)};
calc();load(0);
setInterval(function(){if(!document.hidden)load(0)},60000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)load(0)});
})();
