(function(){
var $=function(i){return document.getElementById(i)};
var U={
'길이':[['mm',0.001],['cm',0.01],['m',1],['km',1000],['inch',0.0254],['ft',0.3048],['yd',0.9144],['mile',1609.344],['자',10/33]],
'넓이':[['㎡',1],['평',400/121],['㎢',1e6],['ha',1e4],['acre',4046.8564224],['ft²',0.09290304]],
'무게':[['mg',1e-6],['g',1e-3],['kg',1],['톤',1000],['oz',0.028349523125],['lb',0.45359237],['돈',0.00375],['냥',0.0375],['근(600g)',0.6]],
'부피':[['mL',1e-3],['L',1],['㎥',1000],['gal(US)',3.785411784],['cup(US)',0.2365882365],['fl oz(US)',0.0295735295625],['되',1.8039],['홉',0.18039]],
'속도':[['m/s',1],['km/h',1/3.6],['mph',0.44704],['knot',1852/3600]],
'데이터':[['B',1],['KB',1024],['MB',1048576],['GB',1073741824],['TB',1099511627776]],
'온도':[['℃'],['℉'],['K']]
};
var cat=$('cat'),uv=$('uv'),uf=$('uf'),ut=$('ut'),tb=$('tb');
Object.keys(U).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=k;cat.appendChild(o)});
function fill(){var L=U[cat.value],h=L.map(function(u){return'<option value="'+u[0]+'">'+u[0]+'</option>'}).join('');
 uf.innerHTML=h;ut.innerHTML=h;uf.selectedIndex=cat.value==='온도'?0:Math.min(2,L.length-1);ut.selectedIndex=cat.value==='온도'?1:(cat.value==='길이'?1:Math.min(3,L.length-1));if(ut.selectedIndex===uf.selectedIndex)ut.selectedIndex=(uf.selectedIndex+1)%L.length;calc()}
function conv(x,c,f,t){
 if(c==='온도'){var k=f==='℃'?x+273.15:f==='℉'?(x-32)*5/9+273.15:x;return t==='℃'?k-273.15:t==='℉'?(k-273.15)*9/5+32:k}
 var m={};U[c].forEach(function(u){m[u[0]]=u[1]});return x*m[f]/m[t]}
function fmt(x){if(!isFinite(x))return'-';return Number(x.toPrecision(10)).toLocaleString('ko-KR',{maximumFractionDigits:10})}
function calc(){var c=cat.value,x=parseFloat(uv.value.replace(/,/g,''));
 if(isNaN(x)){tb.innerHTML='';$('all').innerHTML='';return}
 var r=conv(x,c,uf.value,ut.value);
 tb.innerHTML='<tr class="b"><td>'+fmt(x)+' '+uf.value+'</td><td>'+fmt(r)+' '+ut.value+'</td></tr>';
 $('all').innerHTML=U[c].map(function(u){return'<tr><td>'+u[0]+'</td><td>'+fmt(conv(x,c,uf.value,u[0]))+'</td></tr>'}).join('');
 $('nt').textContent=c==='넓이'?'1평 = 3.3058㎡ 기준입니다.':c==='무게'?'근은 육류·한약재 기준 600g입니다.':''}
cat.onchange=fill;uf.onchange=calc;ut.onchange=calc;
uv.addEventListener('input',function(){var d=uv.value.replace(/[^\d.\-]/g,'');uv.value=d;calc()});
$('uswap').onclick=function(){var a=uf.selectedIndex;uf.selectedIndex=ut.selectedIndex;ut.selectedIndex=a;calc()};
fill();
})();
