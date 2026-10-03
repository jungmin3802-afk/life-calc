(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},KEY='lc_due',D=S.get(KEY,null),vw=null;
function P(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2])}
function fm(g){return g>=1000?(g/1000).toFixed(g%1000?2:0).replace(/0$/,'')+'kg':g+'g'}
function care(w){
 if(w<=4)return['임신 초기','엽산을 챙기고 술·담배는 피하세요.','복용 중인 약은 의사와 먼저 상담하세요.','임신이 확인되면 산부인과에서 아기집과 심박을 확인하세요.'];
 if(w<=8)return['임신 초기','입덧이 심하면 소량씩 자주 드세요.','날고기·날생선·살균 안 된 유제품은 피하세요.','심한 복통이나 출혈이 있으면 바로 병원에 가세요.','카페인은 하루 200mg(커피 약 2잔) 이하로 줄이세요.'];
 if(w<=13)return['임신 초기','유산 위험이 높은 시기라 무리한 운동·무거운 짐은 피하세요.','11~13주에 1차 기형아 검사(목덜미 투명대)를 해요.','충분히 쉬고 수분을 자주 드세요.'];
 if(w<=19)return['임신 중기','안정기에 들어서요. 가벼운 걷기·임산부 요가가 좋아요.','15~20주에 2차 기형아 검사(쿼드 검사)를 해요.','빈혈이 생기기 쉬우니 철분 섭취를 확인하세요.','배가 땅기면 쉬고, 계속되면 병원에 문의하세요.'];
 if(w<=27)return['임신 중기','20~24주에 정밀 초음파로 아기 장기를 확인해요.','24~28주에 임신성 당뇨 검사를 해요.','갑자기 붓거나 심한 두통·시야 이상이 있으면 바로 병원에 가세요.','허리가 아프면 옆으로 누워 자고 무리하지 마세요.'];
 if(w<=36)return['임신 후기','조기 진통(규칙적인 배 뭉침)이 있으면 병원에 연락하세요.','태동을 매일 확인하고 갑자기 줄면 병원에 가세요.','장거리 여행과 무거운 짐은 피하세요.','36주 전에 출산 가방과 이동 방법을 준비하세요.'];
 return['만삭','규칙적인 진통, 양수가 터짐, 출혈이 있으면 바로 병원에 가세요.','태동이 눈에 띄게 줄면 바로 병원에 가세요.','언제든 나갈 수 있게 출산 가방을 챙겨 두세요.']}
function draw(){
 var has=D&&D.d;$('dusetup').hidden=has;$('duview').hidden=!has;
 if(!has){return}
 var due=P(D.d),r=DUEW(due),cur=Math.max(4,Math.min(40,r.w));if(vw===null)vw=cur;
 $('duin').value=D.d;$('dupin').textContent=D.pin===false?'📌 홈 상단에 고정하기':'📌 홈 상단 고정 해제';
 var big=r.days<0?'아직 임신 전이에요':r.w>=40&&r.left<0?'예정일이 지났어요':r.w+'주 '+r.d+'일';
 $('dubig').textContent=big;
 $('dusub').textContent=r.left>=0?'출산예정일까지 D-'+r.left+' · '+due.getFullYear()+'.'+(due.getMonth()+1)+'.'+due.getDate():'예정일에서 '+Math.abs(r.left)+'일 지났어요';
 var pg=Math.max(0,Math.min(100,r.days/280*100));$('dubar').style.width=pg+'%';
 var tri=r.w<14?'1분기':r.w<28?'2분기':'3분기';$('dutri').textContent=tri+' · 진행 '+Math.round(pg)+'%';
 var g=DUEG(vw);
 $('duwk').textContent=vw+'주'+(vw===r.w?' (지금)':'');
 $('duem').textContent=g[3];$('dunm').textContent='아기는 '+g[4]+' 크기';
 $('ducm').textContent=g[1]+'cm';$('dukg').textContent=g[2]?fm(g[2]):'1g 미만';
 $('dudev').textContent=g[5];
 var c=care(vw);$('duct').textContent=c[0]+' 주의할 점';
 $('dulist').innerHTML=c.slice(1).map(function(x){return'<li>'+x+'</li>'}).join('');
 $('duprev').disabled=vw<=4;$('dunext').disabled=vw>=40}
$('dusave').onclick=function(){var v=$('duin0').value;if(!v){$('duin0').focus();return}D={d:v,pin:true};S.set(KEY,D);vw=null;draw()};
$('duin').onchange=function(){if($('duin').value){D={d:$('duin').value,pin:D.pin!==false};S.set(KEY,D);vw=null;draw()}};
$('duprev').onclick=function(){vw=Math.max(4,vw-1);draw()};
$('dunext').onclick=function(){vw=Math.min(40,vw+1);draw()};
$('dupin').onclick=function(){D.pin=D.pin===false;S.set(KEY,D);draw()};
$('duclr').onclick=function(){D=null;S.set(KEY,null);vw=null;draw()};
draw()})();
