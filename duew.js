(function(){try{var d=JSON.parse(localStorage.getItem('lc_due')||'null');d=d&&d.d;if(!d)return;
var a=d.split('-'),due=new Date(+a[0],+a[1]-1,+a[2]),r=DUEW(due);if(r.days<0)return;
var g=DUEG(r.w),e=document.getElementById('duew');if(!e)return;
e.innerHTML='<a class="duw" href="due-date.html"><span class="e">'+(g?g[3]:'🤰')+'</span><span><b>임신 '+r.w+'주 '+r.d+'일</b><small>'+(r.left>=0?'출산예정일 D-'+r.left:'예정일 '+Math.abs(r.left)+'일 지남')+(g?' · 지금 '+g[4]+' 크기 ('+g[1]+'cm)':'')+'</small></span></a>'}catch(x){}})();
