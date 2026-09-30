(function(){
var desc=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
function cols(o){var n=o.length,m=0;o.forEach(function(x){m=Math.max(m,x.t.length)});
 if(o.some(function(x){return x.s}))return n<=4?n:n>9?4:3;
 if(n<=3&&m<=12)return n;if(m<=5)return 4;if(m<=8)return 3;if(m<=18)return 2;return 1}
function up(sel){
 if(sel.getAttribute('data-sg')||sel.hasAttribute('data-plain')||sel.options.length>16||sel.options.length<2)return;
 sel.setAttribute('data-sg','1');
 var g=document.createElement('div');g.className='sg';g.setAttribute('role','radiogroup');
 var lb=sel.id&&document.querySelector('label[for="'+sel.id+'"]');if(lb&&lb.textContent)g.setAttribute('aria-label',lb.textContent);
 sel.parentNode.insertBefore(g,sel.nextSibling);sel.hidden=true;
 function draw(){
  var o=[].map.call(sel.options,function(x){var m=x.textContent.match(/^([A-Z]{3}) - (.+)$/);return m?{v:x.value,t:m[1],s:m[2]}:{v:x.value,t:x.textContent}});
  g.style.setProperty('--n',cols(o));g.innerHTML='';
  o.forEach(function(x){var b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.setAttribute('data-v',x.v);
   b.innerHTML=(x.s?'<b></b><small></small>':'<span></span>');
   if(x.s){b.children[0].textContent=x.t;b.children[1].textContent=x.s}else b.children[0].textContent=x.t;
   g.appendChild(b)});
  mark()}
 function mark(){var v=desc.get.call(sel);[].forEach.call(g.children,function(b){b.setAttribute('aria-checked',b.getAttribute('data-v')===v?'true':'false')})}
 Object.defineProperty(sel,'value',{configurable:true,get:function(){return desc.get.call(sel)},set:function(v){desc.set.call(sel,v);mark()}});
 g.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;desc.set.call(sel,b.getAttribute('data-v'));mark();
  sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}))});
 sel.addEventListener('change',mark);
 new MutationObserver(draw).observe(sel,{childList:true});
 draw()}
function scan(root){[].forEach.call((root||document).querySelectorAll('main select'),up)}
function init(){scan();new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.tagName==='SELECT'&&n.closest('main'))up(n);else if(n.querySelectorAll)scan(n)}})})}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
