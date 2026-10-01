(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},pad=S.pad,ymd=S.ymd,KEY='lc_cal';
var D=S.get(KEY,{events:[],diary:{}});D.events=D.events||[];D.diary=D.diary||{};
function save(){var C=S.get(KEY,{events:[],diary:{}});C.events=C.events||[];C.diary=D.diary;S.set(KEY,C)}
var MOODS=['😊','🥰','😐','😢','😡','😴'],WD='일월화수목금토',today=new Date(),cur=new Date(today.getFullYear(),today.getMonth(),1),sel=ymd(today),q='';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function has(o){return o&&(o.text||o.mood)}
function grid(){var y=cur.getFullYear(),m=cur.getMonth();$('yttl').textContent=y+'년 '+(m+1)+'월';
 var first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),h='',cnt={},tot=0;
 for(var i=0;i<first;i++)h+='<span class="cc e"></span>';
 for(var d=1;d<=n;d++){var s=y+'-'+pad(m+1)+'-'+pad(d),w=new Date(y,m,d).getDay(),di=D.diary[s];
  if(has(di)){tot++;if(di.mood)cnt[di.mood]=(cnt[di.mood]||0)+1}
  h+='<button type="button" class="cc'+(s===ymd(today)?' td':'')+(s===sel?' sl':'')+(w===0?' su':w===6?' sa':'')+'" data-d="'+s+'"><b>'+d+'</b><em></em><span class="dt">'+(has(di)?'<u class="big">'+(di.mood||'✎')+'</u>':'')+'</span></button>'}
 $('yg').innerHTML=h;
 $('ystat').innerHTML='<span>이번 달 기록 '+tot+'일</span>'+MOODS.filter(function(x){return cnt[x]}).map(function(x){return '<span>'+x+' '+cnt[x]+'</span>'}).join('')}
function day(){var p=sel.split('-'),dt=new Date(+p[0],+p[1]-1,+p[2]),di=D.diary[sel]||{};
 $('yday').innerHTML='<div class="dh"><strong>'+(+p[0])+'년 '+(+p[1])+'월 '+(+p[2])+'일 ('+WD[dt.getDay()]+')</strong>'+(sel===ymd(today)?'<span class="dd">오늘</span>':'')+'</div>'
  +'<div class="moods" role="group" aria-label="오늘의 기분">'+MOODS.map(function(x){return '<button type="button" class="mo'+(di.mood===x?' on':'')+'" data-m="'+x+'">'+x+'</button>'}).join('')+'</div>'
  +'<textarea id="ytx" rows="6" placeholder="오늘 하루는 어땠나요?" aria-label="일기"></textarea><p class="note" id="ysv">쓰는 대로 자동 저장돼요.</p>';
 $('ytx').value=di.text||''}
function list(){var ks=Object.keys(D.diary).filter(function(k){return has(D.diary[k])}).sort().reverse(),t=q.trim().toLowerCase();
 if(t)ks=ks.filter(function(k){return (D.diary[k].text||'').toLowerCase().indexOf(t)>=0});else ks=ks.slice(0,20);
 $('ylist').innerHTML=ks.length?ks.map(function(k){var o=D.diary[k],p=k.split('-');return '<button type="button" class="yi" data-d="'+k+'"><b>'+(o.mood||'✎')+' '+(+p[0])+'.'+(+p[1])+'.'+(+p[2])+'</b><span>'+esc(o.text||'(기분만 기록)')+'</span></button>'}).join(''):'<p class="note">'+(t?'검색 결과가 없어요.':'아직 쓴 일기가 없어요.')+'</p>'}
function all(){grid();day();list()}
function go(s){sel=s;var p=s.split('-');cur=new Date(+p[0],+p[1]-1,1);all()}
$('yg').addEventListener('click',function(e){var b=e.target.closest('[data-d]');if(!b)return;sel=b.getAttribute('data-d');grid();day()});
$('ylist').addEventListener('click',function(e){var b=e.target.closest('[data-d]');if(!b)return;go(b.getAttribute('data-d'));window.scrollTo({top:0,behavior:'smooth'})});
$('yday').addEventListener('click',function(e){var m=e.target.closest('.mo');if(!m)return;var v=m.getAttribute('data-m'),o=D.diary[sel]||(D.diary[sel]={});o.mood=o.mood===v?'':v;if(!has(o))delete D.diary[sel];save();var tx=$('ytx').value;grid();day();$('ytx').value=tx;list()});
$('yday').addEventListener('input',function(e){if(e.target.id!=='ytx')return;var o=D.diary[sel]||(D.diary[sel]={});o.text=e.target.value;if(!has(o))delete D.diary[sel];save();grid();list();var s=$('ysv');s.textContent='✓ 저장됐어요'});
$('yq').addEventListener('input',function(){q=this.value;list()});
$('yprev').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()-1,1);grid()};
$('ynext').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()+1,1);grid()};
$('ytoday').onclick=function(){go(ymd(today))};
$('ycsv').onclick=function(){var rows=['날짜,기분,내용'];Object.keys(D.diary).sort().forEach(function(k){var o=D.diary[k];rows.push([k,o.mood||'','"'+String(o.text||'').replace(/"/g,'""')+'"'].join(','))});if(!S.download('다이어리.csv','﻿'+rows.join('\n'),'text/csv'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('yexp').onclick=function(){if(!S.download('다이어리-백업.json',JSON.stringify({diary:D.diary}),'application/json'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('yimp').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||typeof o.diary!=='object')throw 0;if(confirm('백업 파일의 일기를 합칠까요? (같은 날짜는 백업 내용으로 바뀌어요)')){Object.keys(o.diary).forEach(function(k){D.diary[k]=o.diary[k]});save();all();S.notify('불러오기 완료','일기 '+Object.keys(o.diary).length+'개')}}catch(_){S.notify('불러오기 실패','다이어리 백업 파일이 아닙니다. (달력 백업 파일도 일기가 들어 있으면 불러올 수 있어요)')}};r.readAsText(f);this.value=''};
if(!S.persistent())$('ywarn').hidden=false;
all();
})();
