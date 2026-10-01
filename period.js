(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},pad=S.pad,ymd=S.ymd,KEY='lc_period';
var WD='일월화수목금토',today=new Date(),T=ymd(today),cur=new Date(today.getFullYear(),today.getMonth(),1),sel=T;
function P(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2])}
function add(s,n){var d=P(s);d.setDate(d.getDate()+n);return ymd(d)}
function diff(a,b){return Math.round((P(b)-P(a))/864e5)}
function md(s){var a=s.split('-');return (+a[1])+'/'+(+a[2])}
function norm(o){o=o&&typeof o==='object'?o:{};o.cl=o.cl||28;o.pl=o.pl||5;o.sym=o.sym||{};
 if(!o.days){o.days={};(o.logs||[]).forEach(function(l){var e=l.e||add(l.s,Math.min(o.pl,14)-1),n=0;for(var d=l.s;d<=e&&n<14;d=add(d,1),n++)o.days[d]=1});delete o.logs}
 return o}
var D=norm(S.get(KEY,null));
function save(){S.set(KEY,D)}
function groups(){var ks=Object.keys(D.days).sort(),g=[];
 ks.forEach(function(k){var l=g[g.length-1];if(l&&diff(l.e,k)<=2)l.e=k;else g.push({s:k,e:k})});return g}
function avg(){var g=groups(),c=[],p=[];
 for(var i=1;i<g.length;i++){var d=diff(g[i-1].s,g[i].s);if(d>=15&&d<=60)c.push(d)}
 g.forEach(function(x,i){if(i===g.length-1&&diff(x.e,T)<=1)return;var d=diff(x.s,x.e)+1;if(d>=1&&d<=14)p.push(d)});
 c=c.slice(-6);p=p.slice(-6);
 var f=function(a,d){return a.length?Math.round(a.reduce(function(x,y){return x+y},0)/a.length):d};
 return{cl:f(c,D.cl),pl:f(p,D.pl),auto:c.length>0}}
function predict(){var g=groups(),A=avg(),r={A:A,starts:[],g:g};if(!g.length)return r;
 var last=g[g.length-1].s;for(var k=1;k<=10;k++)r.starts.push(add(last,A.cl*k));return r}
function state(s,pr){var st={};if(D.days[s])st.p=1;
 if(!st.p&&s>T)pr.starts.forEach(function(ns){var ov=add(ns,-14);if(s>=ns&&s<=add(ns,pr.A.pl-1))st.pp=1;if(s>=add(ov,-5)&&s<=add(ov,1))st.f=1;if(s===ov)st.o=1});
 else if(!st.p)pr.starts.forEach(function(ns){var ov=add(ns,-14);if(s>=ns&&s<=add(ns,pr.A.pl-1))st.pp=1;if(s>=add(ov,-5)&&s<=add(ov,1))st.f=1;if(s===ov)st.o=1});
 return st}
var SY=['복통','두통','허리통증','피로','예민','붓기','식욕증가','메스꺼움'];
var PL=[['😊','없음'],['😣','약함'],['😖','보통'],['😭','심함']];
var TIP={'복통':'따뜻한 생강차·보리차로 배를 따뜻하게. 찬 음식과 카페인은 줄여요.','두통':'물을 자주 마시고 바나나·견과류(마그네슘)를 챙겨요.','허리통증':'따뜻한 찜질과 함께 연어·견과류(오메가3)가 도움돼요.','피로':'소고기·시금치·미역(철분)에 비타민C 과일을 곁들여요.','예민':'바나나·고구마·두유로 속을 채우고 다크초콜릿은 소량만.','붓기':'짠 음식은 줄이고 오이·바나나·물을 늘려요.','식욕증가':'단 과자 대신 고구마·요거트·견과류로 채워요.','메스꺼움':'따뜻한 죽이나 생강차가 속을 편하게 해요.'};
function tips(st,x){var out=[],seen={};
 (x.s||[]).forEach(function(k){if(TIP[k]&&out.length<3)out.push(TIP[k])});
 if(!out.length&&(x.p||0)>=2)out.push(TIP['복통']);
 if(!out.length){if(st.p)out.push('철분이 풍부한 소고기·시금치·미역·두부와 따뜻한 물을 챙겨요.');
  else if(st.o||st.f)out.push('균형 잡힌 식사와 충분한 수분이 좋아요. 과음은 피해요.');
  else if(st.pp)out.push('생리 전에는 짠 음식·카페인을 줄이면 붓기와 예민함이 덜해요.')}
 return out}
function draw(){var pr=predict(),A=pr.A,g=pr.g,h='';
 var todayOn=!!D.days[T];
 if(!g.length){$('pbig').textContent='기록 없음';$('psub').textContent='달력에서 생리 시작한 날을 눌러 기록하세요';$('pfx').textContent=''}
 else{var last=g[g.length-1];
  if(todayOn){$('pbig').textContent='생리 '+(diff(last.s,T)+1)+'일째';$('psub').textContent='시작일 '+md(last.s);$('pfx').textContent=''}
  else{var ns=pr.starts[0],dd=diff(T,ns);
   $('pbig').textContent=dd>0?'D-'+dd:dd===0?'오늘 예정':'D+'+(-dd)+' 지연';
   $('psub').textContent='다음 생리 예정 '+md(ns)+' ('+WD[P(ns).getDay()]+')';
   var ov=add(ns,-14);$('pfx').textContent='가임기 '+md(add(ov,-5))+'~'+md(add(ov,1))+' · 배란 '+md(ov)}}
 $('pcl').textContent=A.cl+'일'+(A.auto?'':' (기본)');$('ppl').textContent=A.pl+'일';
 $('pnow').textContent=todayOn?'오늘 생리 기록 취소':'🩸 오늘 생리 시작했어요';$('pnow').classList.toggle('off',todayOn);
 var y=cur.getFullYear(),m=cur.getMonth();$('pttl').textContent=y+'년 '+(m+1)+'월';
 var first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();
 for(var i=0;i<first;i++)h+='<span class="cc e"></span>';
 for(var d=1;d<=n;d++){var s=y+'-'+pad(m+1)+'-'+pad(d),st=state(s,pr),x=D.sym[s],
  cls='cc pc'+(s===T?' td':'')+(s===sel?' sl':'')+(st.p?' pm':st.pp?' pp':st.f?' pf':'');
  h+='<button type="button" class="'+cls+'" data-d="'+s+'"><b>'+d+'</b><em></em><span class="dt">'+(st.o?'<u>🥚</u>':x&&x.p>0?'<u>'+PL[x.p][0]+'</u>':x&&(x.s||[]).length?'<u class="pd"></u>':'')+'</span></button>'}
 $('pg').innerHTML=h;drawDay(pr);
 $('plist').innerHTML=g.length?g.slice().reverse().map(function(l,i){var idx=g.length-1-i,prev=idx>0?g[idx-1]:null,cyc=prev?diff(prev.s,l.s):0,bp=-1,bd='';
  for(var k=l.s;k<=l.e;k=add(k,1)){var x=D.sym[k];if(x&&x.p>bp&&x.p>0){bp=x.p;bd=k}}
  return '<div class="tr"><span class="tn"><b>'+md(l.s)+' ~ '+md(l.e)+'</b><small>'+(diff(l.s,l.e)+1)+'일간'+(cyc?' · 주기 '+cyc+'일':'')+(bd?' · 가장 아팠던 날 '+md(bd)+' '+PL[bp][0]:'')+'</small></span></div>'}).join(''):'<p class="note">아직 기록이 없어요.</p>';
 $('pset1').value=D.cl;$('pset2').value=D.pl}
function drawDay(pr){var st=state(sel,pr),x=D.sym[sel]||{p:0,s:[]},past=sel<=T,a=P(sel),h='';
 var lab=st.p?'생리 중':st.o?'배란 예정일':st.f?'가임기':st.pp?'생리 예정':'';
 h+='<h3 class="hh" style="margin-top:0">'+(a.getMonth()+1)+'월 '+a.getDate()+'일 ('+WD[a.getDay()]+')'+(lab?' <small class="pl">'+lab+'</small>':'')+'</h3>';
 if(past){
  h+='<button type="button" class="pt'+(D.days[sel]?' on':'')+'" data-a="tg">'+(D.days[sel]?'🩸 생리 중 (눌러서 취소)':'🩸 이 날 생리 시작/중')+'</button>';
  if(!D.days[sel]||true)h+='<div class="pn"><span>이 날부터</span>'+[3,4,5,6,7].map(function(n){return '<button type="button" data-n="'+n+'">'+n+'일</button>'}).join('')+'<span>간</span></div>';
  h+='<label>통증</label><div class="pp4">'+PL.map(function(p,i){return '<button type="button" data-p="'+i+'" class="'+(x.p===i&&(i>0||D.sym[sel])?'on':'')+'"><span>'+p[0]+'</span>'+p[1]+'</button>'}).join('')+'</div>';
  h+='<label>증상</label><div class="psy">'+SY.map(function(k){return '<button type="button" data-s="'+k+'" class="'+((x.s||[]).indexOf(k)>=0?'on':'')+'">'+k+'</button>'}).join('')+'</div>'}
 var t=tips(st,x);
 if(t.length)h+='<div class="ptip"><b>🍽️ 이럴 땐</b>'+t.map(function(z){return '<p>'+z+'</p>'}).join('')+'<small>참고용이에요. 심하면 병원에 가세요.</small></div>';
 else if(!past)h+='<p class="note">아직 오지 않은 날이에요.</p>';
 $('pday').innerHTML=h}
function setSym(fn){var x=D.sym[sel]||(D.sym[sel]={p:0,s:[]});fn(x);if(!x.p&&!(x.s||[]).length)delete D.sym[sel];save();draw()}
$('pday').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
 if(b.getAttribute('data-a')==='tg'){if(D.days[sel])delete D.days[sel];else D.days[sel]=1;save();draw();return}
 var n=b.getAttribute('data-n');if(n){var c=0;for(var i=0;i<+n;i++){var d=add(sel,i);if(d<=T){D.days[d]=1;c++}}save();draw();if(c<+n)S.notify('오늘까지만 기록돼요',c+'일 기록했어요');return}
 var p=b.getAttribute('data-p');if(p!==null){setSym(function(x){x.p=+p;x.s=x.s||[]});return}
 var s=b.getAttribute('data-s');if(s)setSym(function(x){x.s=x.s||[];var i=x.s.indexOf(s);if(i>=0)x.s.splice(i,1);else x.s.push(s)})});
$('pg').addEventListener('click',function(e){var b=e.target.closest('[data-d]');if(b){sel=b.getAttribute('data-d');draw();$('pday').scrollIntoView({block:'nearest',behavior:'smooth'})}});
$('pnow').onclick=function(){if(D.days[T])delete D.days[T];else D.days[T]=1;sel=T;cur=new Date(today.getFullYear(),today.getMonth(),1);save();draw()};
$('pprev').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()-1,1);draw()};
$('pnext').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()+1,1);draw()};
$('ptoday').onclick=function(){cur=new Date(today.getFullYear(),today.getMonth(),1);sel=T;draw()};
function draw2(){var a=$('pset1').value,b=$('pset2').value;draw();$('pset1').value=a;$('pset2').value=b}
$('pset1').addEventListener('input',function(){var v=parseInt(this.value,10);if(v>=20&&v<=45){D.cl=v;save();draw2()}});
$('pset2').addEventListener('input',function(){var v=parseInt(this.value,10);if(v>=1&&v<=14){D.pl=v;save();draw2()}});
$('pcalbtn').onclick=function(){var pr=predict();if(!pr.g.length){S.notify('먼저 기록해 주세요','마지막 생리 시작일이 필요해요.');return}
 var C=S.get('lc_cal',{events:[],diary:{}});C.events=C.events||[];var ns=pr.starts.filter(function(s){return s>=T}).slice(0,3);
 ns.forEach(function(s){C.events.push({id:'e'+Date.now().toString(36)+Math.floor(Math.random()*1e4),title:'생리 예정일 (참고)',date:s,time:'',al:'1440',rep:'',color:'#E0457B'})});
 S.set('lc_cal',C);S.notify('달력에 추가했어요',ns.map(md).join(', ')+' 예정일 (하루 전 알림)')};
$('pexp').onclick=function(){if(!S.download('생리주기-백업.json',JSON.stringify(D),'application/json'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('pimp').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||(!o.days&&!Array.isArray(o.logs)))throw 0;if(confirm('백업 파일로 현재 기록을 덮어쓸까요?')){D=norm(o);save();draw();S.notify('불러오기 완료','기록 '+Object.keys(D.days).length+'일')}}catch(_){S.notify('불러오기 실패','생리주기 백업 파일이 아닙니다.')}};r.readAsText(f);this.value=''};
if(!S.persistent())$('pwarn').hidden=false;
save();draw();
})();
