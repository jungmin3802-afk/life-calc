(function(){
var S=window.LCStore,$=function(i){return document.getElementById(i)},pad=S.pad,ymd=S.ymd,KEY='lc_period';
var D=S.get(KEY,null);if(!D||!D.logs)D={logs:[],cl:28,pl:5};D.cl=D.cl||28;D.pl=D.pl||5;
function save(){S.set(KEY,D)}
var WD='일월화수목금토',today=new Date(),T=ymd(today),cur=new Date(today.getFullYear(),today.getMonth(),1);
function P(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2])}
function add(s,n){var d=P(s);d.setDate(d.getDate()+n);return ymd(d)}
function diff(a,b){return Math.round((P(b)-P(a))/864e5)}
function md(s){var a=s.split('-');return (+a[1])+'/'+(+a[2])}
function logs(){return D.logs.slice().sort(function(a,b){return a.s<b.s?-1:1})}
function avg(){var L=logs(),c=[],p=[];
 for(var i=1;i<L.length;i++){var d=diff(L[i-1].s,L[i].s);if(d>=15&&d<=60)c.push(d)}
 L.forEach(function(l){if(l.e){var d=diff(l.s,l.e)+1;if(d>=1&&d<=14)p.push(d)}});
 c=c.slice(-6);p=p.slice(-6);
 var f=function(a,d){return a.length?Math.round(a.reduce(function(x,y){return x+y},0)/a.length):d};
 return{cl:f(c,D.cl),pl:f(p,D.pl),auto:c.length>0}}
function predict(){var L=logs(),A=avg(),res={A:A,starts:[]};if(!L.length)return res;
 var last=L[L.length-1].s;for(var k=1;k<=8;k++)res.starts.push(add(last,A.cl*k));return res}
// 날짜별 상태
function state(s,pr){var L=logs(),st={};
 for(var i=0;i<L.length;i++){var l=L[i],e=l.e||(l.s<=T?(diff(l.s,T)<14?T:add(l.s,pr.A.pl-1)):add(l.s,pr.A.pl-1));if(s>=l.s&&s<=e){st.p=1;if(!l.e&&s>T)st.p=0}}
 if(!st.p){pr.starts.forEach(function(ns){var ov=add(ns,-14);if(s>=ns&&s<=add(ns,pr.A.pl-1))st.pp=1;if(s>=add(ov,-5)&&s<=add(ov,1))st.f=1;if(s===ov)st.o=1})}
 return st}
function draw(){var pr=predict(),A=pr.A,L=logs(),h='';
 var ongoing=L.length&&!L[L.length-1].e&&diff(L[L.length-1].s,T)<14?L[L.length-1]:null;
 // hero
 if(!L.length){$('pbig').textContent='기록 없음';$('psub').textContent='아래에서 마지막 생리 시작일을 기록해 주세요.';$('pfx').textContent=''}
 else if(ongoing){var dn=diff(ongoing.s,T)+1;$('pbig').textContent='생리 '+dn+'일째';$('psub').textContent='시작일 '+md(ongoing.s)+' · 보통 '+A.pl+'일 정도 이어져요';$('pfx').textContent=''}
 else{var ns=pr.starts[0],dd=diff(T,ns);
  while(dd<-A.cl+0&&pr.starts.length>1){pr.starts.shift();ns=pr.starts[0];dd=diff(T,ns)}
  $('pbig').textContent=dd>0?'D-'+dd:dd===0?'오늘 예정':'D+'+(-dd)+' (지연)';
  $('psub').textContent='다음 생리 예정일 '+md(ns)+' ('+WD[P(ns).getDay()]+')';
  var ov=add(ns,-14);$('pfx').textContent='배란 예정 '+md(ov)+' · 가임기 '+md(add(ov,-5))+'~'+md(add(ov,1))}
 $('pcl').textContent=A.cl+'일'+(A.auto?'':' (기본값)');$('ppl').textContent=A.pl+'일';
 // 입력 영역
 if(ongoing){$('plab').textContent='생리 종료일';$('pbtn').textContent='생리 끝났어요';$('pdate').setAttribute('data-mode','end')}
 else{$('plab').textContent='생리 시작일';$('pbtn').textContent='생리 시작했어요';$('pdate').setAttribute('data-mode','start')}
 // 달력
 var y=cur.getFullYear(),m=cur.getMonth();$('pttl').textContent=y+'년 '+(m+1)+'월';
 var first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();
 for(var i=0;i<first;i++)h+='<span class="cc e"></span>';
 for(var d=1;d<=n;d++){var s=y+'-'+pad(m+1)+'-'+pad(d),st=state(s,pr),cls='cc pc'+(s===T?' td':'')+(st.p?' pm':st.pp?' pp':st.f?' pf':'');
  h+='<button type="button" class="'+cls+'" data-d="'+s+'"><b>'+d+'</b><em></em><span class="dt">'+(st.o?'<u>🥚</u>':st.p?'<u>🩸</u>':'')+'</span></button>'}
 $('pg').innerHTML=h;
 // 기록
 $('plist').innerHTML=L.length?L.slice().reverse().map(function(l,i,arr){var idx=L.indexOf(l),prev=idx>0?L[idx-1]:null,cyc=prev?diff(prev.s,l.s):0;
  return '<div class="tr"><span class="tn"><b>'+md(l.s)+(l.e?' ~ '+md(l.e):' ~ 진행 중')+'</b><small>'+(l.e?(diff(l.s,l.e)+1)+'일간':'')+(cyc?(l.e?' · ':'')+'주기 '+cyc+'일':'')+'</small></span><button type="button" class="x" data-x="'+l.id+'" aria-label="삭제">×</button></div>'}).join(''):'<p class="note">아직 기록이 없어요.</p>';
 $('pset1').value=D.cl;$('pset2').value=D.pl}
$('pbtn').onclick=function(){var v=$('pdate').value||T,mode=$('pdate').getAttribute('data-mode'),L=logs();
 if(v>T){S.notify('날짜를 확인해 주세요','오늘 이후 날짜는 기록할 수 없어요.');return}
 if(mode==='end'){var o=L[L.length-1];if(v<o.s){S.notify('날짜를 확인해 주세요','종료일이 시작일보다 빠릅니다.');return}o.e=v}
 else{if(L.some(function(l){return l.s===v})){S.notify('이미 기록된 날짜예요','');return}D.logs.push({id:'p'+Date.now().toString(36),s:v,e:''})}
 save();$('pdate').value=T;draw()};
$('plist').addEventListener('click',function(e){var x=e.target.closest('[data-x]');if(x&&confirm('이 기록을 삭제할까요?')){var id=x.getAttribute('data-x');D.logs=D.logs.filter(function(l){return l.id!==id});save();draw()}});
$('pprev').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()-1,1);draw()};
$('pnext').onclick=function(){cur=new Date(cur.getFullYear(),cur.getMonth()+1,1);draw()};
$('ptoday').onclick=function(){cur=new Date(today.getFullYear(),today.getMonth(),1);draw()};
$('pset1').addEventListener('input',function(){var v=parseInt(this.value,10);if(v>=20&&v<=45){D.cl=v;save();draw2()}});
$('pset2').addEventListener('input',function(){var v=parseInt(this.value,10);if(v>=1&&v<=14){D.pl=v;save();draw2()}});
function draw2(){var a=$('pset1').value,b=$('pset2').value;draw();$('pset1').value=a;$('pset2').value=b}
$('pcalbtn').onclick=function(){var pr=predict();if(!logs().length){S.notify('먼저 기록해 주세요','마지막 생리 시작일이 필요해요.');return}
 var C=S.get('lc_cal',{events:[],diary:{}});C.events=C.events||[];var ns=pr.starts.filter(function(s){return s>=T}).slice(0,3);
 ns.forEach(function(s){C.events.push({id:'e'+Date.now().toString(36)+Math.floor(Math.random()*1e4),title:'생리 예정일 (참고)',date:s,time:'',al:'1440',rep:'',color:'#E0457B'})});
 S.set('lc_cal',C);S.notify('달력에 추가했어요',ns.map(md).join(', ')+' 예정일 (하루 전 알림)')};
$('pexp').onclick=function(){if(!S.download('생리주기-백업.json',JSON.stringify(D),'application/json'))S.notify('저장 실패','실제 주소에서 사용해 보세요.')};
$('pimp').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(!o||!Array.isArray(o.logs))throw 0;if(confirm('백업 파일로 현재 기록을 덮어쓸까요?')){D=o;D.cl=D.cl||28;D.pl=D.pl||5;save();draw();S.notify('불러오기 완료','기록 '+D.logs.length+'개')}}catch(_){S.notify('불러오기 실패','생리주기 백업 파일이 아닙니다.')}};r.readAsText(f);this.value=''};
if(!S.persistent())$('pwarn').hidden=false;
$('pdate').value=T;
draw();
})();
