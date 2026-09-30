(function(){
var CUR=[['KRW','대한민국 원',1],['USD','미국 달러',1],['JPY','일본 엔',100],['EUR','유럽 유로',1],['CNY','중국 위안',1],['HKD','홍콩 달러',1],['GBP','영국 파운드',1],['AUD','호주 달러',1],['CAD','캐나다 달러',1],['NZD','뉴질랜드 달러',1],['THB','태국 바트',1],['VND','베트남 동',100],['TWD','대만 달러',1],['PHP','필리핀 페소',1]];
var SRC=[
 {u:'https://open.er-api.com/v6/latest/KRW',p:function(j){if(j.result!=='success')throw 0;return{r:j.rates,t:j.time_last_update_utc?new Date(j.time_last_update_utc):null}}},
 {u:'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json',p:function(j){return{r:up(j.krw),t:j.date?new Date(j.date+'T00:00:00Z'):null}}},
 {u:'https://latest.currency-api.pages.dev/v1/currencies/krw.json',p:function(j){return{r:up(j.krw),t:j.date?new Date(j.date+'T00:00:00Z'):null}}}
];
function up(o){var x={};for(var k in o)x[k.toUpperCase()]=o[k];return x}
var R=null,T=null,$=function(i){return document.getElementById(i)};
var amt=$('amt'),from=$('from'),to=$('to'),tb=$('tb'),nt=$('nt');
var opts=CUR.map(function(c){return'<option value="'+c[0]+'">'+c[0]+' - '+c[1]+'</option>'}).join('');
from.innerHTML=opts;to.innerHTML=opts;from.value='USD';to.value='KRW';
function fmt(n,c){var d=(c==='KRW'||c==='VND')?0:2;return n.toLocaleString('ko-KR',{minimumFractionDigits:d,maximumFractionDigits:d})}
function stamp(){if(!T||isNaN(T))return'';return T.toLocaleString('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})+' (KST) 기준'}
function rateOf(c){return c==='KRW'?1:R[c]}
function calc(){
 if(!R){tb.innerHTML='<tr><td>안내</td><td>환율을 불러오는 중입니다</td></tr>';return}
 var a=parseFloat(amt.value.replace(/,/g,''));
 if(!isFinite(a)){tb.innerHTML='';return}
 var f=from.value,t=to.value,v=a/rateOf(f)*rateOf(t),one=1/rateOf(f)*rateOf(t);
 tb.innerHTML='<tr class="b"><td>'+fmt(a,f)+' '+f+'</td><td>'+fmt(v,t)+' '+t+'</td></tr><tr><td>적용 환율</td><td>1 '+f+' = '+one.toLocaleString('ko-KR',{maximumFractionDigits:6})+' '+t+'</td></tr>';
 nt.textContent='국제 기준 환율 기준이며 은행·환전소의 실제 매매 환율과 수수료는 다릅니다. '+stamp()}
function table(){
 var h='';CUR.slice(1).forEach(function(c){var u=c[2],v=u/R[c[0]];
  h+='<tr><td>'+u+' '+c[0]+' ('+c[1]+')</td><td>'+v.toLocaleString('ko-KR',{minimumFractionDigits:2,maximumFractionDigits:2})+'원</td></tr>'});
 $('rt').innerHTML=h;$('stamp').textContent='원화 기준 1단위(엔·동은 100단위) 가격입니다. '+stamp()}
amt.addEventListener('input',function(){var d=amt.value.replace(/[^\d.]/g,''),p=d.split('.');amt.value=p[0]?Number(p[0]).toLocaleString('ko-KR')+(p.length>1?'.'+p[1]:''):d;calc()});
from.onchange=calc;to.onchange=calc;
$('swap').onclick=function(){var x=from.value;from.value=to.value;to.value=x;calc()};
function fail(){tb.innerHTML='<tr><td>안내</td><td>환율을 불러오지 못했습니다. 잠시 후 <a href="">다시 시도</a>해 주세요.</td></tr>';$('rt').innerHTML='<tr><td>환율을 불러오지 못했습니다.</td><td></td></tr>'}
function load(i){
 if(i>=SRC.length)return fail();
 fetch(SRC[i].u,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
  var o=SRC[i].p(j);
  for(var k=1;k<CUR.length;k++)if(!(o.r[CUR[k][0]]>0))throw 0;
  R=o.r;T=o.t;calc();table()}).catch(function(){load(i+1)})}
calc();load(0);
})();
