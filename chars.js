(function(){
var $=function(i){return document.getElementById(i)},txt=$('txt'),tb=$('tb');
function bytes(s){var n=0;for(var ch of s){n+=ch==='\n'?2:(ch.codePointAt(0)>127?2:1)}return n}
function calc(){var s=txt.value.replace(/\r\n/g,'\n'),all=Array.from(s).length,nos=Array.from(s.replace(/\s/g,'')).length,
 words=s.trim()?s.trim().split(/\s+/).length:0,lines=s?s.split('\n').length:0,u8=new TextEncoder().encode(s.replace(/\n/g,'\r\n')).length;
 var f=function(n){return n.toLocaleString('ko-KR')};
 tb.innerHTML='<tr class="b"><td>글자수 (공백 포함)</td><td>'+f(all)+'자</td></tr><tr><td>글자수 (공백 제외)</td><td>'+f(nos)+'자</td></tr><tr><td>바이트 (한글 2바이트 기준)</td><td>'+f(bytes(s))+' byte</td></tr><tr><td>바이트 (UTF-8 기준)</td><td>'+f(u8)+' byte</td></tr><tr><td>단어 수</td><td>'+f(words)+'개</td></tr><tr><td>줄 수</td><td>'+f(lines)+'줄</td></tr>'}
txt.addEventListener('input',calc);
$('cclear').onclick=function(){txt.value='';calc();txt.focus()};
$('ccopy').onclick=function(){var b=$('ccopy');function ok(){var o=b.textContent;b.textContent='복사됨';setTimeout(function(){b.textContent=o},1400)}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt.value).then(ok,function(){txt.select()})}else{txt.select()}};
calc();
})();
