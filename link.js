(function(){
var K_CAL='lc_cal',K_LED='lc_ledger',cur=null;
function rd(k,d){try{var v=localStorage.getItem(k);if(v)return JSON.parse(v)}catch(_){}return d}
function wr(k,o){try{localStorage.setItem(k,JSON.stringify(o));return true}catch(_){return false}}
function p2(n){return n<10?'0'+n:''+n}
function ymd(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
function won(n){return Math.round(n).toLocaleString('ko-KR')}
function num(s){return parseInt(String(s).replace(/[^\d]/g,''),10)||0}
function addM(s,k){var a=s.split('-'),y=+a[0],m=+a[1]-1+k,d=+a[2];y+=Math.floor(m/12);m=((m%12)+12)%12;var L=new Date(y,m+1,0).getDate();return y+'-'+p2(m+1)+'-'+p2(Math.min(d,L))}
function nextMD(md){var t=new Date(),y=t.getFullYear(),s=y+'-'+md;if(s<ymd(t))s=(y+1)+'-'+md;return s}
function big(rows){for(var i=0;i<rows.length;i++)if(rows[i][2])return rows[i];return rows[0]}
function row(rows,re){for(var i=0;i<rows.length;i++)if(re.test(rows[i][0]))return rows[i];return null}
function nm(){var t=new Date(),d=t.getDate();return addM(ymd(new Date(t.getFullYear(),t.getMonth(),Math.min(d,28))),1)}
// spec: {ask,def,title,cal:[{t,rep,n,off,md}],led:[{t,a,c,m,freq,n,off,md}]}
var SP={
 loan:function(v,r){var a=num(big(r)[1]);if(!a||!v.m)return null;var i=v.t==2,t=i?'대출 이자 나가는 날':'대출 상환일';
  return{ask:'첫 '+(i?'이자':'상환')+'일',def:nm(),cal:[{t:t,rep:'m',n:v.m}],led:[{t:'e',a:a,c:10,m:t,freq:'m',n:v.m}]}},
 save:function(v,r){if(!v.m)return null;
  if(v.t==2){return{ask:'첫 납입일',def:nm(),cal:[{t:'적금 납입일',rep:'m',n:v.m},{t:'적금 만기일',rep:'',off:v.m-1}],led:[{t:'e',a:v.a,c:10,m:'적금 납입',freq:'m',n:v.m},{t:'i',a:num(row(r,/세후 이자/)[1]),c:3,m:'적금 이자(세후)',freq:'once',off:v.m}]}}
  return{ask:'가입일',def:ymd(new Date()),cal:[{t:'예금 만기일',rep:'',off:v.m}],led:[{t:'i',a:num(row(r,/세후 이자/)[1]),c:3,m:'예금 이자(세후)',freq:'once',off:v.m}]}},
 compound:function(v,r){var a=v.t==0?v.m:num(big(r)[1]);if(!a||!v.y)return null;var n=Math.round(v.y*12);
  return{ask:'첫 저축일',def:nm(),cal:[{t:'저축·투자 납입일',rep:'m',n:n}],led:[{t:'e',a:a,c:10,m:'저축·투자',freq:'m',n:n}]}},
 cartax:function(v,r){var a=num(row(r,/각 납부액/)[1]);if(!a)return null;
  return{cal:[{t:'자동차세 납부 (6월분)',rep:'y',md:'06-30'},{t:'자동차세 납부 (12월분)',rep:'y',md:'12-31'}],led:[{t:'e',a:a,c:10,m:'자동차세 (6월)',freq:'y',md:'06-30'},{t:'e',a:a,c:10,m:'자동차세 (12월)',freq:'y',md:'12-31'}]}},
 rent:function(v,r){if(v.t!=0)return null;var a=num(row(r,/^월세$/)[1]);if(!a)return null;
  return{ask:'첫 월세일',def:nm(),cal:[{t:'월세 내는 날',rep:'m'}],led:[{t:'e',a:a,c:4,m:'월세',freq:'m'}]}},
 dday:function(v){if(!v.t)return null;return{ask:'날짜',def:v.t.toISOString().slice(0,10),title:'D-day',cal:[{t:'D-day',rep:''}],led:[]}},
 met:function(v){if(!v.s)return null;var t=ymd(new Date()),cal=[];
  [100,200,300,500,1000,2000,3000].forEach(function(k){var d=new Date(v.s.getTime()+(k-1)*864e5).toISOString().slice(0,10);if(d>=t)cal.push({t:'💕 '+k+'일',rep:'',fix:d})});
  return cal.length?{cal:cal,led:[]}:null}
};
var css='#lkb{display:block;width:100%;margin-top:10px;padding:12px;border:1px solid var(--acc);border-radius:10px;background:transparent;color:var(--acc);font-size:1rem;font-weight:700;cursor:pointer}'+
'#lko{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:110;display:none}#lko.on{display:block}'+
'#lks{position:fixed;left:0;right:0;bottom:0;max-width:560px;margin:0 auto;background:var(--card);color:var(--ink);border-radius:18px 18px 0 0;padding:20px 18px calc(18px + env(safe-area-inset-bottom));z-index:111;transform:translateY(105%);transition:transform .25s}'+
'#lks.on{transform:none}#lks h3{margin:0 0 4px;font-size:1.15rem}#lks .ls{color:var(--sub);font-size:.92rem;margin:0 0 12px}'+
'#lks .lr{display:flex;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--line);font-size:.95rem}#lks .lr b{text-align:right}'+
'#lks label{display:block;font-size:.85rem;color:var(--sub);margin:10px 0 4px}'+
'#lks .la{display:flex;gap:8px;margin-top:16px}#lks .la button{flex:1;padding:13px;border-radius:12px;border:0;font-size:1rem;font-weight:700;cursor:pointer}'+
'#lks .y{background:var(--acc);color:#fff}#lks .n{background:var(--bg);color:var(--ink)}#lks a{display:block;text-align:center;padding:12px;margin-top:8px;border-radius:12px;background:var(--bg);color:var(--ink);text-decoration:none;font-weight:700}';
function ui(){if(document.getElementById('lko'))return;var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
 var o=document.createElement('div');o.id='lko';var d=document.createElement('div');d.id='lks';d.setAttribute('role','dialog');document.body.appendChild(o);document.body.appendChild(d);o.onclick=close}
function close(){document.getElementById('lko').classList.remove('on');document.getElementById('lks').classList.remove('on')}
function open(h){ui();var d=document.getElementById('lks');d.innerHTML=h;document.getElementById('lko').classList.add('on');d.classList.add('on')}
function freqTxt(x,S){return x.freq==='once'?'한 번':x.freq==='y'?'매년':'매월'}
function plan(sp,S,title){ // resolve dates
 var cal=sp.cal.map(function(c){var st=c.fix||(c.md?nextMD(c.md):addM(S,c.off||0));return{t:(title&&sp.title&&c.t===sp.title)?title:c.t,rep:c.rep,st:st,until:c.n?addM(st,c.n-1):''}});
 var led=sp.led.map(function(x){var st=x.md?nextMD(x.md):addM(S,x.off||0);return{t:x.t,a:x.a,c:x.c,m:x.m,freq:x.freq,st:st,until:x.n&&x.freq==='m'?addM(S,x.n-1):''}});
 return{cal:cal,led:led}}
function step1(){var sp=cur.sp;
 var f=sp.ask?'<label>'+(sp.title?'이름':'')+'</label>'+(sp.title?'<input id="lkn" value="'+sp.title+'" maxlength="20">':'')+'<label>'+sp.ask+'</label><input type="date" id="lkd" value="'+sp.def+'">':'';
 var lines=sp.cal.slice(0,4).map(function(c){return'<div class="lr"><span>'+c.t+'</span><b>'+(c.rep==='m'?'매월':c.rep==='y'?'매년':c.fix||'한 번')+'</b></div>'}).join('');
 open('<h3>📅 달력에 추가할까요?</h3><p class="ls">일정을 만들어 드려요. 하루 전에 알림도 설정돼요.</p>'+lines+f+'<div class="la"><button class="n" id="lkx">건너뛰기</button><button class="y" id="lky">추가할게요</button></div>');
 document.getElementById('lkx').onclick=function(){cur.calDone=false;next()};
 document.getElementById('lky').onclick=function(){var dv=document.getElementById('lkd');cur.S=dv?dv.value:ymd(new Date());if(!cur.S){return}var tn=document.getElementById('lkn');cur.title=tn?(tn.value.trim()||sp.title):null;
  var P=plan(sp,cur.S,cur.title),C=rd(K_CAL,{events:[],diary:{}});C.events=C.events||[];
  P.cal.forEach(function(c){var e={id:'e'+Date.now().toString(36)+Math.floor(Math.random()*1e4),title:c.t,date:c.st,time:'',al:'1440',rep:c.rep,color:'#3B82F6'};if(c.until)e.until=c.until;C.events.push(e)});
  wr(K_CAL,C);cur.calDone=true;next()}}
function stepLed(){var sp=cur.sp,S=cur.S||sp.def||nm();var P=plan(sp,S,cur.title);
 var CAT=['식비','카페·간식','교통','쇼핑','주거·통신','의료','육아','문화·여가','경조사','기타','금융·저축'],ICAT=['급여','용돈','부수입','이자·환급','기타'];
 var lines=P.led.map(function(x){return'<div class="lr"><span>'+x.m+'<br><small style="color:var(--sub)">'+(x.t==='e'?CAT[x.c]:ICAT[x.c])+' · '+freqTxt(x)+(x.freq==='once'?' ('+x.st+')':' '+(+x.st.slice(8))+'일')+'</small></span><b>'+(x.t==='e'?'-':'+')+won(x.a)+'원</b></div>'}).join('');
 open('<h3>📒 가계부에도 연동할까요?</h3><p class="ls">날짜가 되면 가계부에 자동으로 기록돼요.</p>'+lines+'<div class="la"><button class="n" id="lkx">건너뛰기</button><button class="y" id="lky">연동할게요</button></div>');
 document.getElementById('lkx').onclick=function(){cur.ledDone=false;fin()};
 document.getElementById('lky').onclick=function(){var L=rd(K_LED,{tx:[],budget:0,bu:0});L.tx=L.tx||[];L.rec=L.rec||[];
  P.led.forEach(function(x){var id=Date.now().toString(36)+Math.floor(Math.random()*1e4);
   if(x.freq==='once')L.tx.push({id:'t'+id,t:x.t,a:x.a,c:x.c,m:x.m,d:x.st,_u:Date.now()});
   else L.rec.push({id:id,t:x.t,a:x.a,c:x.c,m:x.m,day:+x.st.slice(8),freq:x.freq,start:x.st,until:x.until||'',_u:Date.now()})});
  wr(K_LED,L);cur.ledDone=true;fin()}}
function next(){if(cur.sp.led.length)stepLed();else fin()}
function fin(){var a=[];if(cur.calDone)a.push('<a href="calendar.html">📅 달력에서 보기</a>');if(cur.ledDone)a.push('<a href="ledger.html">📒 가계부에서 보기</a>');
 if(!a.length){close();return}
 open('<h3>✓ 연동했어요</h3><p class="ls">'+(cur.calDone?'달력에 일정이 추가됐어요. ':'')+(cur.ledDone?'가계부는 날짜가 되면 자동으로 기록돼요.':'')+'</p>'+a.join('')+'<div class="la"><button class="n" id="lkx">닫기</button></div>');
 document.getElementById('lkx').onclick=close;
 var b=document.getElementById('lkb');if(b)b.textContent='✓ 연동 완료 (다시 하려면 누르세요)'}
window.LCLink={attach:function(key,v,rows){var f=SP[key],sp=null;try{sp=f&&f(v,rows)}catch(_){sp=null}
 var b=document.getElementById('lkb');
 if(!sp){if(b)b.remove();return}
 if(!b){b=document.createElement('button');b.id='lkb';b.type='button';var a=document.getElementById('share')||document.getElementById('tb');a.insertAdjacentElement('afterend',b)}
 b.textContent='📌 달력'+(sp.led.length?'·가계부':'')+'에 연동하기';
 b.onclick=function(){cur={sp:sp};step1()}}}
})();
