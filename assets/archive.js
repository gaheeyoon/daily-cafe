(function(){
  var D = window.ARCHIVE || {};
  var page = document.body.getAttribute('data-page');
  var root = document.getElementById('app');

  function el(tag, cls, text){
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function won(n){ return Number(n||0).toLocaleString('ko-KR') + '원'; }
  function sum(a){ return (a||[]).reduce(function(s,x){ return s + (Number(x.amount)||0); }, 0); }
  function empty(msg){ root.appendChild(el('div','empty',msg)); }
  function count(n){ root.appendChild(el('div','count','총 ' + n + '개')); }

  /* ── 라이트박스 ── */
  var lb, lbImg, lbCap, items = [], idx = 0;
  function buildLB(){
    lb = el('div','lb'); lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
    lbImg = el('img'); lbCap = el('div','cap');
    var x = el('button','x','×'); x.setAttribute('aria-label','닫기');
    var p = el('button','prev','‹'); p.setAttribute('aria-label','이전');
    var n = el('button','next','›'); n.setAttribute('aria-label','다음');
    x.onclick = close; p.onclick = function(e){ e.stopPropagation(); go(-1); };
    n.onclick = function(e){ e.stopPropagation(); go(1); };
    lb.onclick = function(e){ if (e.target === lb) close(); };
    [lbImg,lbCap,x,p,n].forEach(function(c){ lb.appendChild(c); });
    document.body.appendChild(lb);
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
    lb.addEventListener('touchend', function(e){
      if (sx == null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    });
  }
  function show(){ lbImg.src = items[idx].src; lbImg.alt = items[idx].caption || ''; lbCap.textContent = (items[idx].caption || '') + (items.length > 1 ? '  (' + (idx+1) + '/' + items.length + ')' : ''); }
  function open(list, i){ items = list; idx = i; if (!lb) buildLB(); show(); lb.classList.add('on'); document.body.style.overflow = 'hidden'; }
  function close(){ lb.classList.remove('on'); document.body.style.overflow = ''; }
  function go(d){ idx = (idx + d + items.length) % items.length; show(); }

  /* ── 방명록 ── */
  function guestbook(){
    var list = D.guestbook || [];
    if (!list.length) return empty('방명록이 곧 공개됩니다.');
    count(list.length);
    var box = el('div','notes');
    list.forEach(function(g){
      var n = el('article','note' + (g.image ? ' has-img' : ''));
      if (g.image){ var im = el('img'); im.src = g.image; im.alt = (g.name || '') + '님의 방명록'; im.loading = 'lazy'; n.appendChild(im); }
      if (g.message) n.appendChild(el('p','msg',g.message));
      var by = el('div','by'); by.appendChild(el('b',null,g.name || '익명')); by.appendChild(el('span',null,g.date || ''));
      n.appendChild(by); box.appendChild(n);
    });
    root.appendChild(box);
  }

  /* ── 포토월 ── */
  function photowall(){
    var list = D.photowall || [];
    if (!list.length) return empty('포토월 사진이 곧 공개됩니다.');
    count(list.length);
    var wall = el('div','wall');
    list.forEach(function(p,i){
      var b = el('button','polaroid'); b.type = 'button';
      var im = el('img'); im.src = p.src; im.alt = p.caption || '포토월 사진'; im.loading = 'lazy';
      b.appendChild(im); b.appendChild(el('span',null,p.caption || ''));
      b.onclick = function(){ open(list, i); };
      wall.appendChild(b);
    });
    root.appendChild(wall);
  }

  /* ── 사진 ── */
  function photos(){
    var list = D.photos || [];
    if (!list.length) return empty('행사 사진이 곧 공개됩니다.');
    count(list.length);
    var g = el('div','gallery');
    list.forEach(function(p,i){
      var b = el('button'); b.type = 'button'; b.setAttribute('aria-label', p.caption || ('사진 ' + (i+1)));
      var im = el('img'); im.src = p.src; im.alt = p.caption || ''; im.loading = 'lazy';
      b.appendChild(im); b.onclick = function(){ open(list, i); };
      g.appendChild(b);
    });
    root.appendChild(g);
  }

  /* ── 결산 ── */
  function ledger(rows, totalLabel){
    var ul = el('ul','ledger');
    rows.forEach(function(r){
      var li = el('li'); li.appendChild(el('span',null,r.label)); li.appendChild(el('span','a',won(r.amount))); ul.appendChild(li);
    });
    var t = el('li','total'); t.appendChild(el('span',null,totalLabel)); t.appendChild(el('span','a',won(sum(rows)))); ul.appendChild(t);
    return ul;
  }
  function summary(){
    var S = D.summary; if (!S) return empty('결산이 곧 공개됩니다.');
    var income = sum(S.income), expense = sum(S.expense), net = income - expense;
    var hl = el('div','hl');
    hl.appendChild(el('div','k','장학기금 마련 수익'));
    hl.appendChild(el('div','v',won(net)));
    if (S.donation) hl.appendChild(el('div','s',S.donation));
    root.appendChild(hl);

    if (S.stats && S.stats.length){
      var st = el('div','stats');
      S.stats.forEach(function(s){ var c = el('div','stat'); c.appendChild(el('div','v',s.v)); c.appendChild(el('div','k',s.k)); st.appendChild(c); });
      root.appendChild(st);
    }
    var h = el('div','sec-head'); h.appendChild(el('h2',null,'수입')); root.appendChild(h);
    root.appendChild(ledger(S.income || [], '수입 합계'));
    h = el('div','sec-head'); h.appendChild(el('h2',null,'지출')); root.appendChild(h);
    root.appendChild(ledger(S.expense || [], '지출 합계'));

    if (S.sponsors && S.sponsors.length){
      h = el('div','sec-head'); h.appendChild(el('h2',null,'마음을 보태 주신 분들')); root.appendChild(h);
      var ul = el('ul','sponsors');
      S.sponsors.forEach(function(s){ var li = el('li'); li.appendChild(el('span','goods',s.goods)); li.appendChild(el('span','donor',s.donor)); ul.appendChild(li); });
      root.appendChild(ul);
    }
    root.appendChild(el('p','thanks','따뜻한 마음을 보태 주셔서 감사합니다.\n수익금 전액은 태안군청소년 장학기금으로 전달됩니다.'));
    root.lastChild.style.whiteSpace = 'pre-line';
  }

  ({guestbook:guestbook, photowall:photowall, photos:photos, summary:summary})[page]();
})();
