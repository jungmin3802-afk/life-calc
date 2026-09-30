(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},pad=S.pad,ymd=S.ymd;
var KEY='lc_cal';
var D=S.get(KEY,{events:[],diary:{}});D.events=D.events||[];D.diary=D.diary||{};
function save(){S.set(KEY,D)}
var today=new Date(),cur=new Date(today.getFullYear(),today.getMonth(),1),sel=ymd(today);
var WD=['일','월','화','수','목','금','토'];
var MOODS=['😊','🥰','😐','😢','😡','😴'];
var COLORS=['#E0457B','#F59E0B','#22A06B','#3B82F6','#8B5CF6'];
// ---- 공휴일 (양력 고정 + 음력은 브라우저 음력 달력으로 계산) ----
var HC={};
function lunarMap(y){
 var f=new Intl.DateTimeFormat('en-u-ca-chinese',{month:'numeric',day:'numeric'}),m={};
 for(var d=new Date(y,0,1);d.getFullYear()===y;d=new Date(y,d.getMonth(),d.getDate()+1)){
  var mo=null,da=null;f.formatToParts(d).forEach(function(p){if(p.type==='month')mo=p.value;if(p.type==='day')da=p.value});
  if(/^\d+$/.test(mo))m[ymd(d)]=[+mo,+da]}
 return m}
function hol(y){
 if(HC[y])return HC[y];
 var H={},G=[];// G: 그룹(대체공휴일 판단용)
 function add(d,name){H[ymd(d)]=name}
 var fixed=[[1,1,'신정',0],[3,1,'삼일절',1],[5,5,'어린이날',1],[6,6,'현충일',0],[8,15,'광복절',1],[10,3,'개천절',1],[10,9,'한글날',1],[12,25,'성탄절',1]];
 fixed.forEach(function(x){var d=new Date(y,x[0]-1,x[1]);add(d,x[2]);G.push({days:[d],sub:x[3]===1&&(d.getDay()===0||d.getDay()===6)?'sat':null,name:x[2]})});
 try{
  var L=lunarMap(y),ks=Object.keys(L);
  ks.forEach(function(k){var l=L[k],p=k.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]);
   if(l[0]===1&&l[1]===1){var a=[new Date(y,d.getMonth(),d.getDate()-1),d,new Date(y,d.getMonth(),d.getDate()+1)];
    add(a[0],'설날 연휴');add(a[1],'설날');add(a[2],'설날 연휴');G.push({days:a,sub:'sun',name:'설날'})}
   if(l[0]===8&&l[1]===15){var b=[new Date(y,d.getMonth(),d.getDate()-1),d,new Date(y,d.getMonth(),d.getDate()+1)];
    add(b[0],'추석 연휴');add(b[1],'추석');add(b[2],'추석 연휴');G.push({days:b,sub:'sun',name:'추석'})}
   if(l[0]===4&&l[1]===8){add(d,'부처님오신날');G.push({days:[d],sub:(d.getDay()===0||d.getDay()===6)?'sat':null,name:'부처님오신날'})}
  })}catch(_){}
 // 설·추석 연휴가 일요일과 겹치면, 그 밖의 명절은 토·일과 겹치면 다음 평일을 대체공휴일로
 G.forEach(function(g){var need=false;
  if(g.sub==='sun')need=g.days.some(function(d){return d.getDay()===0});else if(g.sub==='sat')need=true;
  if(!need)return;
  var d=new Date(g.days[g.days.length-1]);
  do{d=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1)}while(d.getDay()===0||d.getDay()===6||H[ymd(d)]);
  if(d.getFullYear()===y)add(d,'대체공휴일')});
 return HC[y]=H}
function holName(s){var y=+s.slice(0,4);return hol(y)[s]||''}
// ---- 반복 일정 ----
function occurs(ev,s){
 if(s<ev.date)return false;
 if(ev.rep==='w')return new Date(s+'T00:00').getDay()===new Date(ev.date+'T00:00').getDay();
 if(ev.rep==='m')return s.slice(8)===ev.date.slice(8);
 if(ev.rep==='y')return s.slice(5)===ev.date.slice(5);
 return s===ev.date}
function evOn(s){return D.events.filter(function(e){return occurs(e,s)}).sort(function(a,b){return (a.time||'')<(b.time||'')?-1:1})}
// ---- 달력 그리기 ----
function drawGrid(){
 var y=cur.getFullYear(),m=cur.getMonth();
 $('cttl').textContent=y+'년 '+(m+1)+'월';
 var first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),h='';
 for(var i=0;i<first;i++)h+='<span class="cc e"></span>';
 for(var d=1;d<=n;d++){
  var s=y+'-'+pad(m+1)+'-'+pad(d),dt=new Date(y,m,d),w=dt.getDay(),hn=holName(s),ev=evOn(s),di=D.diary[s];
  var cls='cc'+(s===ymd(today)?' td':'')+(s===sel?' sl':'')+(w===0||hn?' su':w===6?' sa':'');
  var dots='';ev.slice(0,3).forEach(function(e){dots+='<i style="background:'+e.color+'"></i>'});
  h+='<button type="button" class="'+cls+'" data-d="'+s+'" aria-label="'+(m+1)+'월 '+d+'일'+(hn?' '+hn:'')+(ev.length?' 일정 '+ev.length+'개':'')+'"><b>'+d+'</b><em>'+(hn?hn.replace(' 연휴',''):'')+'</em><span class="dt">'+dots+(di&&(di.text||di.mood)?'<u>'+(di.mood||'✎')+'</u>':'')+'</span></button>'}
 $('cg').innerHTML=h}
function drawDay(){
 var p=sel.split('-'),dt=new Date(+p[0],+p[1]-1,+p[2]),hn=holName(sel),ev=evOn(sel),di=D.diary[sel]||{};
 var diff=Math.round((new Date(dt.getFullYear(),dt.getMonth(),dt.getDate())-new Date(today.getFullYear(),today.getMonth(),today.getDate()))/864e5);
 var dd=diff===0?'오늘':diff>0?'D-'+diff:'D+'+(-diff);
 var h='<div class="dh"><div><strong>'+(+p[1])+'월 '+(+p[2])+'일 ('+WD[dt.getDay()]+')</strong>'+(hn?' <span class="hn">'+hn+'</span>':'')+'</div><span class="dd">'+dd+'</span></div>';
 h+='<div class="moods" role="group" aria-label="오늘의 기분">'+MOODS.map(function(x){return '<button type="button" class="mo'+(di.mood===x?' on':'')+'" data-m="'+x+'">'+x+'</button>'}).join('')+'</div>';
 h+='<textarea id="dtx" rows="3" placeholder="오늘의 다이어리를 적어보세요" aria-label="다이어리"></textarea>';
 h+='<h3 class="hh">일정</h3>';
 if(!ev.length)h+='<p class="note">등록된 일정이 없습니다.</p>';
 ev.forEach(function(e){
  h+='<div class="ev" style="border-left-color:'+e.color+'"><div class="et"><b>'+esc(e.title)+'</b><small>'+(e.time||'종일')+(e.rep?' · '+{w:'매주',m:'매월',y:'매년'}[e.rep]:'')+(e.al!==''&&e.al!=null?' · 🔔'+alLabel(+e.al):'')+'</small></div><div class="ea"><button type="button" class="sec" data-ics="'+e.id+'">📲 폰에 추가</button><button type="button" class="sec" data-del="'+e.id+'" aria-label="삭제">삭제</button></div></div>'});
 h+='<details class="addev"><summary>＋ 일정 추가</summary><label for="et">제목</label><input id="et" maxlength="60" placeholder="예: 예방접종, 엄마 생신" autocomplete="off">'
  +'<div class="r2"><div><label for="etm">시간 (선택)</label><input id="etm" type="time"></div><div><label for="eal">알림</label><select id="eal"><option value="">없음</option><option value="0">정시</option><option value="10">10분 전</option><option value="30">30분 전</option><option value="60">1시간 전</option><option value="1440">하루 전</option></select></div></div>'
  +'<div class="r2"><div><label for="ere">반복</label><select id="ere"><option value="">안 함</option><option value="w">매주</option><option value="m">매월</option><option value="y">매년</option></select></div><div><label for="eco">색</label><select id="eco">'+COLORS.map(function(c,i){return '<option value="'+c+'">'+['핑크','주황','초록','파랑','보라'][i]+'</option>'}).join('')+'</select></div></div>'
  +'<button type="button" id="eadd">일정 저장</button></details>';
 $('cday').innerHTML=h;$('dtx').value=di.text||''}
function alLabel(m){return m===0?'정시':m===1440?'하루 전':m>=60?(m/60)+'시간 전':m+'분 전'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function drawUp(){
 var out=[],base=new Date(today.getFullYear(),today.getMonth(),today.getDate());
 for(var i=0;i<60&&out.length<8;i++){var d=new Date(base.getFullYear(),base.getMonth(),base.getDate()+i),s=ymd(d);
  evOn(s).forEach(function(e){out.push([s,i,e])})}
 var h='';out.slice(0,8).forEach(function(o){var p=o[0].split('-');
  h+='<button type="button" class="upi" data-go="'+o[0]+'"><span class="ud" style="background:'+o[2].color+'">'+(o[1]===0?'오늘':'D-'+o[1])+'</span><span><b>'+esc(o[2].title)+'</b><small>'+(+p[1])+'/'+(+p[2])+' '+(o[2].time||'종일')+'</small></span></button>'});
 $('cup').innerHTML=h||'<p class="note">앞으로 60일 안에 등록된 일정이 없습니다.</p>'}
function all(){drawGrid();drawDay();drawUp()}
$('cprev').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()-1,1);drawGrid()};
$('cnext').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()+1,1);drawGrid()};
$('ctoday').onclick=function(){cur=new Date(today.getFullYear(),today.getMonth(),1);sel=ymd(today);all()};
$('cg').addEventListener('click',function(e){var b=e.target.closest('[data-d]');if(!b)return;sel=b.getAttribute('data-d');drawGrid();drawDay();
 $('cday').scrollIntoView({behavior:'smooth',block:'nearest'})});
$('cup').addEventListener('click',function(e){var b=e.target.closest('[data-go]');if(!b)return;sel=b.getAttribute('data-go');var p=sel.split('-');cur=new Date(+p[0],+p[1]-1,1);all();$('cday').scrollIntoView({behavior:'smooth'})});
$('cday').addEventListener('click',function(e){
 var t=e.target;
 var mo=t.closest('.mo');if(mo){var v=mo.getAttribute('data-m'),o=D.diary[sel]||(D.diary[sel]={});o.mood=o.mood===v?'':v;save();drawGrid();drawDay();return}
 var del=t.closest('[data-del]');if(del){var id=del.getAttribute('data-del');if(confirm('이 일정을 삭제할까요? (반복 일정이면 모든 날짜에서 삭제됩니다)')){D.events=D.events.filter(function(x){return x.id!==id});save();all()}return}
 var ic=t.closest('[data-ics]');if(ic){var ev=D.events.filter(function(x){return x.id===ic.getAttribute('data-ics')})[0];if(ev&&!S.download(ev.title+'.ics',ics([ev]),'text/calendar'))S.notify('저장 실패','이 화면에서는 파일을 내려받을 수 없습니다. 실제 주소에서 사용해 보세요.');return}
 if(t.id==='eadd'){var ti=$('et').value.trim();if(!ti){$('et').focus();return}
  D.events.push({id:'e'+Date.now().toString(36)+Math.floor(Math.random()*1e4),title:ti,date:sel,time:$('etm').value,al:$('eal').value,rep:$('ere').value,color:$('eco').value});
  save();all();if($('eal').value!==''||true){}}
});
$('cday').addEventListener('input',function(e){if(e.target.id==='dtx'){var o=D.diary[sel]||(D.diary[sel]={});o.text=e.target.value;if(!o.text&&!o.mood)delete D.diary[sel];save();drawGrid()}});
// ---- 폰 캘린더(.ics) ----
function ics(list){
 var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//lifecalc//KR','CALSCALE:GREGORIAN'];
 list.forEach(function(e){var d=e.date.replace(/-/g,'');
  L.push('BEGIN:VEVENT','UID:'+e.id+'@lifecalc','DTSTAMP:'+stamp());
  if(e.time){var t=e.time.replace(':','')+'00',et=(function(){var h=+e.time.slice(0,2)+1,m=e.time.slice(3);return pad(h%24)+m+'00'})();
   L.push('DTSTART:'+d+'T'+t,'DTEND:'+(+e.time.slice(0,2)+1>23?d+'T235900':d+'T'+et))}
  else{var n=new Date(e.date+'T00:00');n.setDate(n.getDate()+1);L.push('DTSTART;VALUE=DATE:'+d,'DTEND;VALUE=DATE:'+ymd(n).replace(/-/g,''))}
  L.push('SUMMARY:'+String(e.title).replace(/[\;,]/g,'\\$&'));
  if(e.rep)L.push('RRULE:FREQ='+{w:'WEEKLY',m:'MONTHLY',y:'YEARLY'}[e.rep]);
  if(e.al!==''&&e.al!=null)L.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+String(e.title).replace(/[\;,]/g,'\\$&'),'TRIGGER:-PT'+(+e.al)+'M','END:VALARM');
  L.push('END:VEVENT')});
 L.push('END:VCALENDAR');return L.join('\r\n')}
function stamp(){var n=new Date();return n.getUTCFullYear()+pad(n.getUTCMonth()+1)+pad(n.getUTCDate())+'T'+pad(n.getUTCHours())+pad(n.getUTCMinutes())+pad(n.getUTCSeconds())+'Z'}
$('cics').onclick=function(){if(!D.events.length){S.notify('내보낼 일정이 없어요','');return}if(!S.download('일정.ics',ics(D.events),'text/calendar'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('cexp').onclick=function(){if(!S.download('달력-백업.json',JSON.stringify(D),'application/json'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('cimp').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||!Array.isArray(o.events))throw 0;
 if(confirm('백업 파일로 현재 달력 데이터를 덮어쓸까요?')){D=o;D.diary=D.diary||{};save();all();S.notify('불러오기 완료','일정 '+D.events.length+'개')}}catch(_){S.notify('불러오기 실패','달력 백업 파일이 아닙니다.')}};r.readAsText(f);this.value=''};
// ---- 알림 ----
var FK='lc_cal_fired';
function fired(){return S.get(FK,{})}
function check(){
 var now=Date.now(),F=fired(),ch=false;
 for(var k=-1;k<=1;k++){var d=new Date(today.getFullYear(),today.getMonth(),today.getDate());var base=new Date();base=new Date(base.getFullYear(),base.getMonth(),base.getDate()+k);var s=ymd(base);
  D.events.forEach(function(e){if(e.al===''||e.al==null||!occurs(e,s))return;
   var t=e.time||'09:00',p=t.split(':'),oc=new Date(base.getFullYear(),base.getMonth(),base.getDate(),+p[0],+p[1]).getTime(),fire=oc-(+e.al)*6e4,key=e.id+'@'+s;
   if(now>=fire&&now<=oc+36e5&&!F[key]){F[key]=now;ch=true;S.notify('🔔 '+e.title,(e.time?e.time+' ':'')+(+e.al?alLabel(+e.al)+' 알림':'지금 시작'))}})}
 if(ch){var keep={};Object.keys(F).forEach(function(k){if(now-F[k]<2*864e5)keep[k]=F[k]});S.set(FK,keep)}}
$('cnoti').onclick=function(){S.ask(function(p){var m=p==='granted'?'알림이 켜졌습니다. 이 페이지가 열려 있을 때 시간에 맞춰 울립니다.':p==='unsupported'?'이 브라우저는 알림을 지원하지 않아요. 화면 안 알림과 폰 캘린더(.ics)를 이용해 주세요.':'알림이 차단되었습니다. 브라우저 설정에서 허용해 주세요.';$('cnmsg').textContent=m;})};
if(!S.persistent())$('cwarn').hidden=false;
all();check();setInterval(check,20000);document.addEventListener('visibilitychange',function(){if(!document.hidden){today=new Date();check()}});
})();
