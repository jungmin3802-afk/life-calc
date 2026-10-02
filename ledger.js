(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},pad=S.pad,ymd=S.ymd;
var KEY='lc_ledger';
var D=S.get(KEY,null);if(!D||!D.tx)D={tx:[],budget:0,bu:0};
D.tx=D.tx||[];D.rec=D.rec||[];D.budget=D.budget||0;
var EC=[['식비','🍚'],['카페·간식','☕'],['교통','🚌'],['쇼핑','🛍️'],['주거·통신','🏠'],['의료','💊'],['육아','🍼'],['문화·여가','🎬'],['경조사','🎁'],['기타','📝'],['금융·저축','🏦']];
var IC=[['급여','💰'],['용돈','🧧'],['부수입','💼'],['이자·환급','🏦'],['기타','📝']];
var rpt='',type='e',cat=0,cur=new Date(new Date().getFullYear(),new Date().getMonth(),1),sel=null;
var WD='일월화수목금토';
function dim(y,m){return new Date(y,m+1,0).getDate()}
function materialize(){var T=new Date(),ts=ymd(T),ch=false;
 D.rec.forEach(function(r){var st=r.start.split('-'),y=+st[0],m=+st[1]-1,n=0,step=r.freq==='y'?12:1;
  for(;;){var d=y+'-'+pad(m+1)+'-'+pad(Math.min(r.day,dim(y,m)));
   if(d>ts||(r.until&&d>r.until)||n>600)break;
   if(d>=r.start){var id='r_'+r.id+'_'+d.slice(0,7);
    if((r.sk||[]).indexOf(id)<0&&!D.tx.some(function(x){return x.id===id})){D.tx.push({id:id,t:r.t,a:r.a,c:r.c,m:'🔁 '+r.m,d:d,_u:Date.parse(d)||1});ch=true}}
   m+=step;while(m>11){m-=12;y++}n++}});
 if(ch)save()}
function save(){S.set(KEY,D);if(window.LCSync)LCSync.kick('ledger')}
function won(n){return Math.round(n).toLocaleString('ko-KR')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ico(t,c){var L=t==='e'?EC:IC;return (L[c]||L[L.length-1])}
function ym(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)}
function month(){var p=ym(cur);return D.tx.filter(function(x){return x.d.slice(0,7)===p})}
function cf(n){if(n>=10000){var m=n/10000;return (m>=100?Math.round(m):Math.round(m*10)/10)+'만'}return n.toLocaleString('ko-KR')}
function drawCal(M){var y=cur.getFullYear(),m=cur.getMonth(),T={},h='',td=ymd(new Date());
 M.forEach(function(x){var o=T[x.d]||(T[x.d]={e:0,i:0});if(x.t==='e')o.e+=x.a;else o.i+=x.a});
 $('lct').textContent=y+'년 '+(m+1)+'월';
 var first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),k;
 for(k=0;k<first;k++)h+='<span class="cc e"></span>';
 for(k=1;k<=n;k++){var d=y+'-'+pad(m+1)+'-'+pad(k),o=T[d];
  h+='<button type="button" class="cc lcc'+(d===td?' td':'')+(d===sel?' sl':'')+'" data-d="'+d+'"><b>'+k+'</b><span class="lci">'+(o&&o.i?cf(o.i):'')+'</span><span class="lce">'+(o&&o.e?cf(o.e):'')+'</span></button>'}
 $('lcgr').innerHTML=h;
 var so=sel&&sel.slice(0,7)===ym(cur)&&T[sel]||null;
 $('lcsel').innerHTML=sel&&sel.slice(0,7)===ym(cur)?'<b>'+(+sel.slice(8))+'일</b> 선택 · <span class="lci">수입 '+won(so?so.i:0)+'</span> · <span class="lce">지출 '+won(so?so.e:0)+'</span><br><small>아래에서 이 날짜로 바로 기록할 수 있어요</small>':'날짜를 누르면 그 날짜로 기록할 수 있어요'}
function draw(){
 var M=month(),e=0,i=0;M.forEach(function(x){if(x.t==='e')e+=x.a;else i+=x.a});
 $('lm').textContent=cur.getFullYear()+'년 '+(cur.getMonth()+1)+'월';
 $('lex').textContent=won(e);$('lin').textContent=won(i);$('lba').textContent=(i-e<0?'-':'')+won(Math.abs(i-e));
 var bh='';
 if(D.budget>0){var pc=Math.min(100,Math.round(e/D.budget*100)),left=D.budget-e;
  bh='<div class="bgt"><div class="bgb"><i style="width:'+pc+'%" class="'+(e>D.budget?'ov':pc>=80?'wr':'')+'"></i></div><span>'+(left>=0?'예산 '+won(D.budget)+'원 중 <b>'+won(left)+'원</b> 남음 ('+pc+'%)':'예산 <b>'+won(-left)+'원</b> 초과')+'</span></div>'}
 $('lbg').innerHTML=bh;
 // 카테고리
 var cs={};M.forEach(function(x){if(x.t==='e')cs[x.c]=(cs[x.c]||0)+x.a});
 var ks=Object.keys(cs).sort(function(a,b){return cs[b]-cs[a]});
 $('lcat').innerHTML=ks.length?ks.map(function(k){var c=ico('e',+k),p=e?cs[k]/e*100:0;return '<div class="cr"><span class="ci">'+c[1]+'</span><div class="cb"><div class="ct"><b>'+c[0]+'</b><span>'+won(cs[k])+'원 · '+Math.round(p)+'%</span></div><div class="bar"><i style="width:'+Math.max(2,p)+'%"></i></div></div></div>'}).join(''):'<p class="note">이 달의 지출 기록이 없어요.</p>';
 // 목록
 var days={};M.forEach(function(x){(days[x.d]=days[x.d]||[]).push(x)});
 var ds=Object.keys(days).sort().reverse();
 $('llist').innerHTML=ds.length?ds.map(function(d){var L=days[d].sort(function(a,b){return b._u-a._u}),sum=0;L.forEach(function(x){sum+=x.t==='e'?-x.a:x.a});
  var p=d.split('-'),dt=new Date(+p[0],+p[1]-1,+p[2]);
  return '<div class="ld2"><div class="dh3"><b>'+(+p[1])+'월 '+(+p[2])+'일 ('+WD[dt.getDay()]+')</b><span>'+(sum<0?'-':'+')+won(Math.abs(sum))+'원</span></div>'+L.map(function(x){var c=ico(x.t,x.c);
   return '<div class="tr"><span class="ti">'+c[1]+'</span><span class="tn"><b>'+c[0]+'</b>'+(x.m?'<small>'+esc(x.m)+'</small>':'')+'</span><span class="ta '+(x.t==='e'?'ex':'in')+'">'+(x.t==='e'?'-':'+')+won(x.a)+'</span><button type="button" class="x" data-x="'+x.id+'" aria-label="삭제">×</button></div>'}).join('')+'</div>'}).join(''):'<p class="note">이 달 기록이 없어요. 위에서 첫 내용을 입력해 보세요.</p>';
 if($('lrec'))$('lrec').innerHTML=D.rec.length?D.rec.map(function(r){var c=ico(r.t,r.c);return '<div class="tr"><span class="ti">'+c[1]+'</span><span class="tn"><b>'+esc(r.m)+'</b><small>'+(r.freq==='y'?'매년':'매월')+' '+r.day+'일'+(r.until?' · '+r.until+'까지':'')+'</small></span><span class="ta '+(r.t==='e'?'ex':'in')+'">'+(r.t==='e'?'-':'+')+won(r.a)+'</span><button type="button" class="x" data-rx="'+r.id+'" aria-label="끝내기">×</button></div>'}).join(''):'<p class="note">반복 내역이 없어요. 위에서 매월/매년을 고르거나 계산기에서 "달력·가계부에 연동"하면 여기에 생겨요.</p>';
 $('lbud').value=D.budget?won(D.budget):'';drawCal(M)}
function drawCats(){var L=type==='e'?EC:IC;$('lcg').innerHTML=L.map(function(c,k){return '<button type="button" data-c="'+k+'"'+(k===cat?' class="on"':'')+'><span>'+c[1]+'</span>'+c[0]+'</button>'}).join('');
 $('lt').innerHTML='<button type="button" data-t="e"'+(type==='e'?' class="on"':'')+'>지출</button><button type="button" data-t="i"'+(type==='i'?' class="on"':'')+'>수입</button>'}
$('lt').addEventListener('click',function(e){var b=e.target.closest('[data-t]');if(!b)return;type=b.getAttribute('data-t');cat=0;drawCats()});
$('lcg').addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;cat=+b.getAttribute('data-c');drawCats()});
$('la').addEventListener('input',function(){var d=this.value.replace(/\D/g,'');this.value=d?Number(d).toLocaleString('ko-KR'):''});
$('lq').addEventListener('click',function(e){var b=e.target.closest('[data-p]');if(!b)return;var v=parseInt(($('la').value||'0').replace(/\D/g,''),10)||0;
 var p=b.getAttribute('data-p');v=p==='0'?0:v+(+p);$('la').value=v?v.toLocaleString('ko-KR'):''});
if($('lfr'))$('lfr').addEventListener('click',function(e){var b=e.target.closest('[data-r]');if(!b)return;rpt=b.getAttribute('data-r');this.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)})});
$('lsave').onclick=function(){var a=parseInt(($('la').value||'0').replace(/\D/g,''),10)||0;if(!a){$('la').focus();return}
 var d=$('ld').value||ymd(new Date());
 var memo=$('lmemo').value.trim().slice(0,40);
 if(rpt){var rid='f'+Date.now().toString(36);D.rec.push({id:rid,t:type,a:a,c:cat,m:memo||ico(type,cat)[0],day:+d.slice(8),freq:rpt,start:d,_u:Date.now()});materialize()}
 else D.tx.push({id:'t'+Date.now().toString(36)+Math.floor(Math.random()*1e4),t:type,a:a,c:cat,m:memo,d:d,_u:Date.now()});
 $('la').value='';$('lmemo').value='';if(rpt&&$('lfr')){rpt='';$('lfr').querySelectorAll('button').forEach(function(x,i){x.classList.toggle('on',i===0)})}
 var p=d.split('-');cur=new Date(+p[0],+p[1]-1,1);save();draw();
 var f=$('lok');f.textContent='✓ '+(type==='e'?'지출':'수입')+' '+won(a)+'원 저장했어요';f.hidden=false;clearTimeout(f._t);f._t=setTimeout(function(){f.hidden=true},2500)};
$('llist').addEventListener('click',function(e){var x=e.target.closest('[data-x]');if(x&&confirm('이 내역을 삭제할까요?')){var id=x.getAttribute('data-x');if(id.indexOf('r_')===0)D.rec.forEach(function(r){if(id.indexOf('r_'+r.id+'_')===0){r.sk=(r.sk||[]);r.sk.push(id);r._u=Date.now()}});D.tx=D.tx.filter(function(t){return t.id!==id});save();draw()}});
var lr=$('lrec');if(lr){lr.addEventListener('click',function(e){var x=e.target.closest('[data-rx]');if(x&&confirm('이 반복 내역을 끝낼까요? (지난 기록은 그대로 남아요)')){var id=x.getAttribute('data-rx');D.rec=D.rec.filter(function(r){return r.id!==id});save();draw()}})}
$('lcgr').addEventListener('click',function(ev){var b=ev.target.closest('[data-d]');if(!b)return;var d=b.getAttribute('data-d');sel=sel===d?null:d;if(sel)$('ld').value=sel;draw()});
$('lcp').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()-1,1);sel=null;draw()};
$('lcn').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()+1,1);sel=null;draw()};
$('lprev').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()-1,1);draw()};
$('lnext').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()+1,1);draw()};
$('lbud').addEventListener('input',function(){var d=this.value.replace(/\D/g,'');this.value=d?Number(d).toLocaleString('ko-KR'):'';D.budget=parseInt(d||'0',10)||0;D.bu=Date.now();save();draw();$('lbud').value=d?Number(d).toLocaleString('ko-KR'):''});
$('lcsv').onclick=function(){var rows=['날짜,구분,분류,금액,메모'];D.tx.slice().sort(function(a,b){return a.d<b.d?-1:1}).forEach(function(x){rows.push([x.d,x.t==='e'?'지출':'수입',ico(x.t,x.c)[0],x.a,(x.m||'').replace(/,/g,' ')].join(','))});
 if(!S.download('가계부.csv','﻿'+rows.join('\n'),'text/csv'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('lexp').onclick=function(){if(!S.download('가계부-백업.json',JSON.stringify(D),'application/json'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('limp').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||!Array.isArray(o.tx))throw 0;
 if(confirm('백업 파일로 현재 가계부를 덮어쓸까요?')){D=o;D.rec=D.rec||[];D.budget=D.budget||0;save();draw();S.notify('불러오기 완료','내역 '+D.tx.length+'개')}}catch(_){S.notify('불러오기 실패','가계부 백업 파일이 아닙니다.')}};r.readAsText(f);this.value=''};
if(window.LCSync&&$('lsync'))LCSync.mount($('lsync'),'ledger',{
 get:function(){var m={},c={};D.tx.forEach(function(x){m[x.id]=x});if(D.budget)c.budget={v:D.budget,_u:D.bu||1};var rc={};D.rec.forEach(function(x){rc[x.id]=x});return {tx:m,cfg:c,rec:rc}},
 set:function(k,m){if(k==='rec')D.rec=Object.keys(m).map(function(i){return m[i]});else if(k==='tx')D.tx=Object.keys(m).map(function(i){return m[i]});else if(k==='cfg'&&m.budget){D.budget=m.budget.v;D.bu=m.budget._u}},
 done:function(){S.set(KEY,D);materialize();draw()}});
if(!S.persistent())$('lwarn').hidden=false;
$('ld').value=ymd(new Date());
materialize();drawCats();draw();
})();
