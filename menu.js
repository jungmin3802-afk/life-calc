(function(){
var $=function(i){return document.getElementById(i)};
var M={
'한식':[['🍲','김치찌개'],['🥘','된장찌개'],['🍲','순두부찌개'],['🍲','부대찌개'],['🍖','제육볶음'],['🥩','불고기'],['🍚','비빔밥'],['🍜','칼국수'],['🍲','삼계탕'],['🥩','삼겹살'],['🍲','갈비탕'],['🍲','설렁탕'],['🍲','감자탕'],['🥘','닭볶음탕'],['🐟','생선구이 정식'],['🍚','김치볶음밥'],['🍲','육개장'],['🥬','쌈밥'],['🍜','냉면'],['🍲','곰탕']],
'중식':[['🍜','짜장면'],['🍜','짬뽕'],['🍤','탕수육'],['🍚','볶음밥'],['🍗','깐풍기'],['🍜','우동(중식)'],['🥟','군만두'],['🍚','마파두부 덮밥'],['🍤','깐쇼새우'],['🍜','울면'],['🍖','양장피'],['🍚','잡채밥'],['🍜','마라탕'],['🍢','꿔바로우']],
'일식':[['🍣','초밥'],['🍜','라멘'],['🍤','돈카츠'],['🍜','우동'],['🍚','규동'],['🍚','연어덮밥'],['🍤','텐동'],['🍜','소바'],['🍚','오므라이스'],['🍢','야키토리'],['🍣','회덮밥'],['🍲','샤브샤브'],['🍛','카레라이스'],['🍚','장어덮밥']],
'양식':[['🍝','토마토 파스타'],['🍝','크림 파스타'],['🍕','피자'],['🍔','수제버거'],['🥩','스테이크'],['🥗','샐러드'],['🍝','까르보나라'],['🍛','리조또'],['🥪','샌드위치'],['🍗','치킨 스테이크'],['🌮','타코'],['🌯','부리토'],['🍳','브런치 플레이트'],['🥘','그라탕']],
'분식':[['🌶️','떡볶이'],['🍙','김밥'],['🍢','어묵'],['🍜','라면'],['🍤','튀김'],['🌭','순대'],['🍚','참치마요 덮밥'],['🥟','만두'],['🍜','쫄면'],['🍞','토스트'],['🍙','주먹밥'],['🍲','치즈 라볶이']],
'아시아':[['🍜','쌀국수'],['🍛','팟타이'],['🥙','반미'],['🍛','나시고렝'],['🍛','인도 커리와 난'],['🍢','사테'],['🍜','분짜'],['🍛','똠얌꿍'],['🥟','딤섬'],['🍛','카오팟']],
'야식·안주':[['🍗','치킨'],['🍖','족발'],['🥩','보쌈'],['🍢','곱창'],['🍜','라면+계란'],['🍕','피자'],['🍤','감자튀김'],['🥘','닭발'],['🐟','회'],['🍲','어묵탕'],['🍗','양념치킨'],['🍖','막창']],
'가볍게':[['🥗','샐러드'],['🥪','샌드위치'],['🥣','죽'],['🍌','과일과 요거트'],['🥑','아보카도 토스트'],['🍙','주먹밥'],['🥣','오트밀'],['🍲','두부 요리'],['🥚','달걀 샌드위치'],['🥤','샐러드 랩']]};
var CATS=['전체'].concat(Object.keys(M)),cat='전체',last='';
$('mcat').innerHTML=CATS.map(function(c,i){return '<button type="button" data-c="'+c+'"'+(i?'':' class="on"')+'>'+c+'</button>'}).join('');
$('mcat').addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;cat=b.getAttribute('data-c');this.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)})});
function pool(){var a=[];Object.keys(M).forEach(function(k){if(cat==='전체'||cat===k)M[k].forEach(function(m){a.push([m[0],m[1],k])})});return a}
var busy=false;
$('mgo').onclick=function(){if(busy)return;busy=true;var a=pool(),n=0,tot=12,out=$('mout');
 var t=setInterval(function(){var r=a[Math.floor(Math.random()*a.length)];n++;
  if(n>=tot){clearInterval(t);var f;do{f=a[Math.floor(Math.random()*a.length)]}while(a.length>1&&f[1]===last);last=f[1];show(f);busy=false}
  else{out.className='mo2 spin';$('mem').textContent=r[0];$('mnm').textContent=r[1];$('mct').textContent=''}},70)};
function show(f){$('mout').className='mo2 done';$('mem').textContent=f[0];$('mnm').textContent=f[1];$('mct').textContent=f[2];$('mgo').textContent='🎲 다시 뽑기';
 $('msch').href='https://search.naver.com/search.naver?query='+encodeURIComponent('내 주변 '+f[1]+' 맛집');$('msch').hidden=false;
 try{var h=JSON.parse(localStorage.getItem('lc_menu')||'[]');h.unshift(f[0]+' '+f[1]);h=h.slice(0,8);localStorage.setItem('lc_menu',JSON.stringify(h));hist(h)}catch(_){}}
function hist(h){$('mh').innerHTML=h.length?h.map(function(x){return '<span>'+x+'</span>'}).join(''):'<p class="note">아직 뽑은 메뉴가 없어요.</p>'}
try{hist(JSON.parse(localStorage.getItem('lc_menu')||'[]'))}catch(_){hist([])}
})();
