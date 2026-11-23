/* Renders the portfolio from /content/*.json. Edit those files with /admin (no code needed). */
(function(){
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
function md(s){
  s=esc(s);
  s=s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,function(m,t,u){u=u.replace(/&amp;/g,'&');
    return /^(https?:|mailto:|\/|#|images\/|docs\/|[\w.-]+\.html)/i.test(u)?'<a href="'+esc(u)+'" target="_blank" rel="noopener" style="color:var(--gold)">'+t+'</a>':t});
  return s.replace(/\*\*([^*]+)\*\*/g,'<strong style="color:var(--white)">$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
}
function get(n){return fetch('content/'+n+'.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(n);return r.json()})}
function paras(t){return String(t||'').split(/\n\s*\n/).map(function(p){return '<p>'+md(p.trim()).replace(/\n/g,'<br>')+'</p>'}).join('')}
function block(b){
  switch(b.type){
    case 'text': return paras(b.text);
    case 'points': return '<div class="outcomes-grid">'+(b.items||[]).map(function(i){return '<div class="outcome-item"><p>'+md(i)+'</p></div>'}).join('')+'</div>';
    case 'screens': return '<div class="screenshots-strip">'+(b.items||[]).map(function(i){return '<div class="ss-thumb"><img loading="lazy" decoding="async" src="'+esc(i.image)+'" alt="'+esc(i.label)+'"><p class="ss-label">'+esc(i.label)+'</p></div>'}).join('')+'</div>';
    case 'scores': return (b.items||[]).map(function(i){var n=Number(i.score)||0;return '<div class="score-row"><p class="score-label">'+md(i.label)+'</p><div class="score-bar-wrap"><div class="score-bar" style="width:'+Math.max(0,Math.min(100,n/5*100))+'%"></div></div><p class="score-num">'+n+'/5</p></div>'}).join('');
    case 'image': return '<div class="proof-frame">'+(b.caption?'<p class="proof-label">'+md(b.caption)+'</p>':'')+'<img loading="lazy" decoding="async" src="'+esc(b.image)+'" alt="'+esc(b.caption||'')+'" style="width:100%;display:block;max-width:480px"></div>';
    case 'quote': return '<div style="border-left:3px solid var(--gold);padding:.4rem 0 .4rem 1.1rem"><p style="font-style:italic">“'+md(b.text)+'”</p>'+(b.author?'<p style="opacity:.7;font-size:.85rem;margin-top:.4rem">'+md(b.author)+'</p>':'')+'</div>';
    case 'tags': return '<div class="framework-tags">'+(b.items||[]).map(function(t){return '<span class="ftag">'+esc(t)+'</span>'}).join('')+'</div>';
  } return '';
}
function body(blocks){
  var out='',open=false;
  (blocks||[]).forEach(function(b){
    if(b.type==='heading'){if(open)out+='</div>';out+='<div class="case-sec"><p class="case-sec-title">'+md(b.text)+'</p>';open=true;}
    else{if(!open){out+='<div class="case-sec">';open=true}out+=block(b)}
  });
  return out+(open?'</div>':'');
}
function projects(d){
  return (d.projects||[]).map(function(p){
    var id=esc(p.id);
    return '<div class="case-study" id="'+id+'"><div class="case-header" onclick="toggleCase(this)"><div><span class="case-type">'+md(p.type)+'</span><h2 class="case-title">'+md(p.title)+'</h2><div class="case-meta">'+(p.meta||[]).map(function(m){return '<span class="meta-item"><strong>'+esc(m.label)+':</strong> '+md(m.value)+'</span>'}).join('')+'</div></div><button class="expand-btn" aria-label="Expand">+</button></div>'+(p.preview&&p.preview.length?block({type:'screens',items:p.preview}):'')+'<div class="case-body" id="body-'+id+'">'+body(p.blocks)+'</div></div>';
  }).join('');
}
function experience(d){
  return (d.groups||[]).map(function(g){
    return '<div class="exp-sep"><h2>'+esc(g.title)+'</h2></div><div class="timeline">'+(g.items||[]).map(function(i,n){
      var yr=esc(i.start)+(i.end?'<br>— '+esc(i.end):'');
      return '<div class="tl-item fu'+(n?' d'+Math.min(n,3):'')+'"><div class="tl-year"><span>'+yr+'</span></div><div class="tl-dot"></div><div class="tl-content"><p class="tl-company">'+md(i.org)+(i.location?' <span class="tl-loc">· '+esc(i.location)+'</span>':'')+'</p><h3 class="tl-role">'+md(i.role)+'</h3>'+((i.bullets||[]).length?'<ul class="tl-list">'+i.bullets.map(function(b){return '<li>'+md(b)+'</li>'}).join('')+'</ul>':'')+'</div></div>';
    }).join('')+'</div>';
  }).join('');
}
var STAR='<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
function awards(d){
  return (d.categories||[]).map(function(c,n){
    var list=(d.awards||[]).filter(function(a){return a.category===c.name});
    return '<div class="award-cat fu"><div class="award-cat-header"><span class="cat-num">'+('0'+(n+1)).slice(-2)+'</span><div><h2 class="cat-title">'+md(c.name)+'</h2><p class="cat-desc">'+md(c.description)+'</p></div></div><div class="award-grid">'+list.map(function(a){
      return '<div class="award-card"><div class="award-photo-wrap">'+(a.image?'<img loading="lazy" decoding="async" src="'+esc(a.image)+'" alt="'+esc(a.title)+'">':'')+STAR+'</div>'+(a.year?'<span class="award-year">'+esc(a.year)+'</span>':'')+'<div class="award-info"><span class="award-org">'+esc(a.issuer)+'</span><h3 class="award-title">'+md(a.title)+'</h3>'+(a.recipient?'<p class="award-recipient">'+md(a.recipient)+'</p>':'')+'</div></div>';
    }).join('')+'</div></div>';
  }).join('');
}
var views={
  projects:function(el){return get('projects').then(function(d){el.innerHTML=projects(d);var h=location.hash;if(h&&/^#[\w-]+$/.test(h)){var t=el.querySelector(h+' .case-header');if(t){t.click();setTimeout(function(){t.scrollIntoView({behavior:'smooth',block:'start'})},150)}}})},
  experience:function(el){return get('experience').then(function(d){el.innerHTML=experience(d)})},
  awards:function(el){return get('awards').then(function(d){el.innerHTML=awards(d);var t=document.querySelector('.total-num');if(t)t.textContent=(d.awards||[]).length})},
  stats:function(el){return Promise.all([get('site'),get('awards')]).then(function(r){el.innerHTML=(r[0].stats||[]).map(function(s){return '<div class="stat"><span class="stat-num">'+esc(String(s.value).replace('{awards}',(r[1].awards||[]).length))+'</span><p class="stat-label">'+md(s.label)+'</p></div>'}).join('')})},
  featured:function(el){return get('projects').then(function(d){el.innerHTML=(d.projects||[]).filter(function(p){return p.featured}).map(function(p,n){return '<a href="projects.html#'+esc(p.id)+'" class="project-card"><span class="project-num">'+('0'+(n+1)).slice(-2)+'</span><span class="project-type">'+md(p.card_type||p.type)+'</span><h3 class="project-title">'+md(p.title)+'</h3><p class="project-desc">'+md(p.summary)+'</p><span class="project-link">View Case Study →</span></a>'}).join('')})}
};
function init(){[].forEach.call(document.querySelectorAll('[data-cms]'),function(el){var v=views[el.getAttribute('data-cms')];if(v)v(el).catch(function(e){console.warn('CMS content not loaded, showing saved page',e)})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
