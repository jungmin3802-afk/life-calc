(function(){
var $=function(i){return document.getElementById(i)},KEY='lc_wx';
var CITY=[['서울',37.5665,126.978],['부산',35.1796,129.0756],['대구',35.8714,128.6014],['인천',37.4563,126.7052],['광주',35.1595,126.8526],['대전',36.3504,127.3845],['울산',35.5384,129.3114],['세종',36.48,127.289],['수원',37.2636,127.0286],['제주',33.4996,126.5312],['강릉',37.7519,128.8761],['전주',35.8242,127.148],['청주',36.6424,127.489],['창원',35.2281,128.6811],['포항',36.019,129.3435]];
var loc=null;try{loc=JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){}
if(!loc||!loc.lat)loc={name:'서울',lat:37.5665,lon:126.978};
function saveLoc(){try{localStorage.setItem(KEY,JSON.stringify(loc))}catch(_){}}
function W(c,day){if(c===0)return day===0?['🌙','맑음']:['☀️','맑음'];if(c===1)return day===0?['🌙','대체로 맑음']:['🌤️','대체로 맑음'];if(c===2)return ['⛅','구름 조금'];if(c===3)return ['☁️','흐림'];if(c===45||c===48)return ['🌫️','안개'];
 if(c>=51&&c<=57)return ['🌦️','이슬비'];if(c>=61&&c<=65)return ['🌧️','비'];if(c===66||c===67)return ['🌧️','얼음비'];if(c>=71&&c<=77)return ['🌨️','눈'];if(c>=80&&c<=82)return ['🌦️','소나기'];if(c===85||c===86)return ['🌨️','눈 소나기'];if(c>=95)return ['⛈️','뇌우'];return ['☁️','흐림']}
function theme(c,day){if(c>=95)return 'th';if((c>=51&&c<=67)||(c>=80&&c<=82))return 'rn';if((c>=71&&c<=77)||c===85||c===86)return 'sn';if(day===0)return 'nt';if(c>=2)return 'cl';return 'sy'}
function di(t,h){return 0.81*t+0.01*h*(0.99*t-14.3)+46.3}
function diL(v){return v>=80?['매우 높음','#E5484D','대부분 불쾌감을 느껴요']:v>=75?['높음','#F97316','절반 이상이 불쾌해요']:v>=68?['보통','#EAB308','일부가 불쾌해요']:['낮음','#22A06B','대부분 쾌적해요']}
function pm10(v){return v<=30?['좋음','#22A06B']:v<=80?['보통','#EAB308']:v<=150?['나쁨','#F97316']:['매우 나쁨','#E5484D']}
function pm25(v){return v<=15?['좋음','#22A06B']:v<=35?['보통','#EAB308']:v<=75?['나쁨','#F97316']:['매우 나쁨','#E5484D']}
function uvL(v){return v>=11?['위험','#E5484D']:v>=8?['매우 높음','#F97316']:v>=6?['높음','#F97316']:v>=3?['보통','#EAB308']:['낮음','#22A06B']}
function windL(v){return v>=14?'매우 강함':v>=9?'강함':v>=4?'약간 강함':'약함'}
function cloth(t){return t>=28?'민소매·반팔, 시원하게 입으세요':t>=23?'반팔에 얇은 셔츠 정도예요':t>=20?'얇은 가디건이 좋아요':t>=17?'가디건이나 맨투맨을 챙기세요':t>=12?'자켓이나 니트가 좋아요':t>=9?'트렌치코트·두꺼운 자켓을 입으세요':t>=5?'코트와 히트텍을 챙기세요':'패딩과 목도리로 단단히 입으세요'}
function r(n){return Math.round(n)}
function hh(s){return s.slice(11,13)}
function draw(d,a){
 var c=d.current,dy=d.daily,hr=d.hourly,w=W(c.weather_code,c.is_day);
 var hero=$('whero');hero.className='lgh wxh '+theme(c.weather_code,c.is_day);
 $('wloc').textContent=loc.name;$('wem').textContent=w[0];$('wt').textContent=r(c.temperature_2m)+'°';$('wds').textContent=w[1];
 $('wsub').textContent='체감 '+r(c.apparent_temperature)+'° · 최고 '+r(dy.temperature_2m_max[0])+'° / 최저 '+r(dy.temperature_2m_min[0])+'°';
 var pp=dy.precipitation_probability_max[0],rain=(c.weather_code>=51&&c.weather_code<=67)||(c.weather_code>=80&&c.weather_code<=82)||c.weather_code>=95||pp>=50;
 $('wtip').innerHTML='<b>'+(rain?'☂️ 우산을 챙기세요':'👕 오늘 옷차림')+'</b><span>'+cloth(c.apparent_temperature)+'</span>';
 var D=di(c.temperature_2m,c.relative_humidity_2m),dl=diL(D),uv=dy.uv_index_max[0],ul=uvL(uv),m='';
 function cell(t,v,u,s,col){return '<div class="wc"><span>'+t+'</span><b>'+v+(u?'<small>'+u+'</small>':'')+'</b><em'+(col?' style="color:'+col+'"':'')+'>'+(s||'&nbsp;')+'</em></div>'}
 m+=cell('불쾌지수',r(D),'',dl[0],dl[1]);
 m+=cell('습도',c.relative_humidity_2m,'%',c.relative_humidity_2m>=80?'습함':c.relative_humidity_2m<=30?'건조':'적당');
 m+=cell('강수확률',pp==null?'-':pp,'%',c.precipitation>0?'지금 '+c.precipitation+'mm':'오늘 최대');
 m+=cell('바람',(Math.round(c.wind_speed_10m*10)/10),'m/s',windL(c.wind_speed_10m));
 if(a&&a.current){var p10=a.current.pm10,p25=a.current.pm2_5;
  m+=cell('미세먼지',p10==null?'-':r(p10),'㎍',p10==null?'':pm10(p10)[0],p10==null?'':pm10(p10)[1]);
  m+=cell('초미세먼지',p25==null?'-':r(p25),'㎍',p25==null?'':pm25(p25)[0],p25==null?'':pm25(p25)[1])}
 m+=cell('자외선',r(uv),'',ul[0],ul[1]);
 m+=cell('일출·일몰',dy.sunrise[0].slice(11),'',dy.sunset[0].slice(11));
 $('wgrid').innerHTML=m;
 // 시간별
 var now=c.time.slice(0,13),i0=0;for(var i=0;i<hr.time.length;i++){if(hr.time[i].slice(0,13)>=now){i0=i;break}}
 var h='';for(var k=i0;k<Math.min(i0+25,hr.time.length);k++){var hw=W(hr.weather_code[k],1),pr=hr.precipitation_probability[k];
  h+='<div class="wh2"><span>'+(k===i0?'지금':hh(hr.time[k])+'시')+'</span><i>'+hw[0]+'</i><b>'+r(hr.temperature_2m[k])+'°</b><small>'+(pr>=20?pr+'%':'&nbsp;')+'</small></div>'}
 $('whr').innerHTML=h;
 // 주간
 var mn=Math.min.apply(null,dy.temperature_2m_min),mx=Math.max.apply(null,dy.temperature_2m_max),rg=(mx-mn)||1,dd='',WD='일월화수목금토';
 for(var j=0;j<dy.time.length;j++){var dw=W(dy.weather_code[j],1),dt=new Date(dy.time[j]+'T00:00:00'),lo=dy.temperature_2m_min[j],hi=dy.temperature_2m_max[j],pq=dy.precipitation_probability_max[j];
  dd+='<div class="wd"><span class="wdn">'+(j===0?'오늘':WD[dt.getDay()])+'</span><i>'+dw[0]+'</i><small>'+(pq>=20?pq+'%':'')+'</small><span class="wlo">'+r(lo)+'°</span><div class="wbar"><u style="left:'+((lo-mn)/rg*100)+'%;width:'+Math.max(6,(hi-lo)/rg*100)+'%"></u></div><span class="whi">'+r(hi)+'°</span></div>'}
 $('wdaily').innerHTML=dd;$('wbody').hidden=false;$('werr').hidden=true;
}
function load(){
 $('wbody').style.opacity=.5;$('werr').hidden=true;
 var q='latitude='+loc.lat+'&longitude='+loc.lon+'&timezone=auto&wind_speed_unit=ms&forecast_days=7';
 var f1=fetch('https://api.open-meteo.com/v1/forecast?'+q+'&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset').then(function(x){if(!x.ok)throw 0;return x.json()});
 var f2=fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude='+loc.lat+'&longitude='+loc.lon+'&current=pm10,pm2_5&timezone=auto').then(function(x){return x.ok?x.json():null}).catch(function(){return null});
 Promise.all([f1,f2]).then(function(a){draw(a[0],a[1]);$('wbody').style.opacity=1;$('wupd').textContent=a[0].current.time.replace('T',' ')+' 기준'}).catch(function(){$('wbody').style.opacity=1;$('wbody').hidden=true;$('werr').hidden=false})}
function pills(){$('wcity').innerHTML='<button type="button" data-g="1" class="gps">📍 현재 위치</button>'+CITY.map(function(c,i){return '<button type="button" data-i="'+i+'"'+(c[0]===loc.name?' class="on"':'')+'>'+c[0]+'</button>'}).join('')+'<button type="button" data-s="1">🔍 검색</button>'}
$('wcity').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
 if(b.getAttribute('data-i')!==null){var c=CITY[+b.getAttribute('data-i')];loc={name:c[0],lat:c[1],lon:c[2]};saveLoc();pills();load()}
 else if(b.getAttribute('data-s')){$('wsrch').hidden=!$('wsrch').hidden;if(!$('wsrch').hidden)$('wq').focus()}
 else if(b.getAttribute('data-g')){if(!navigator.geolocation){$('wmsg').textContent='이 기기에서는 위치를 쓸 수 없어요.';return}
  $('wmsg').textContent='위치 확인 중...';navigator.geolocation.getCurrentPosition(function(p){loc={name:'현재 위치',lat:Math.round(p.coords.latitude*1e4)/1e4,lon:Math.round(p.coords.longitude*1e4)/1e4};saveLoc();$('wmsg').textContent='';pills();load()},function(){$('wmsg').textContent='위치 권한이 없어요. 도시를 직접 골라 주세요.'},{timeout:10000,maximumAge:600000})}});
function search(){var q=$('wq').value.trim();if(!q)return;$('wres').innerHTML='<span class="note">찾는 중...</span>';
 fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(q)+'&count=6&language=ko').then(function(x){return x.json()}).then(function(j){var a=j.results||[];
  $('wres').innerHTML=a.length?a.map(function(p,i){return '<button type="button" data-r="'+i+'">'+p.name+'<small>'+[p.admin1,p.country].filter(Boolean).join(' · ')+'</small></button>'}).join(''):'<span class="note">결과가 없어요.</span>';
  $('wres')._a=a}).catch(function(){$('wres').innerHTML='<span class="note">검색에 실패했어요.</span>'})}
$('wgo').onclick=search;$('wq').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();search()}});
$('wres').addEventListener('click',function(e){var b=e.target.closest('[data-r]');if(!b)return;var p=this._a[+b.getAttribute('data-r')];loc={name:p.name,lat:p.latitude,lon:p.longitude};saveLoc();$('wsrch').hidden=true;$('wres').innerHTML='';$('wq').value='';pills();load()});
$('wretry').onclick=load;
pills();load();
})();
