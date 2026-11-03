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
  var lb, lbImg, lbCap, stage, items = [], idx = 0;
  function buildLB(){
    lb = el('div','lb'); lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
    stage = el('div','stage'); lbImg = el('img'); stage.appendChild(lbImg); lbCap = el('div','cap');
    lbImg.onclick = function(e){ e.stopPropagation(); stage.classList.toggle('zoom'); stage.scrollLeft = 0; stage.scrollTop = 0; };
    var x = el('button','x','×'); x.setAttribute('aria-label','닫기');
    var p = el('button','prev','‹'); p.setAttribute('aria-label','이전');
    var n = el('button','next','›'); n.setAttribute('aria-label','다음');
    x.onclick = close; p.onclick = function(e){ e.stopPropagation(); go(-1); };
    n.onclick = function(e){ e.stopPropagation(); go(1); };
    lb.onclick = function(e){ if (e.target === lb) close(); };
    [stage,lbCap,x,p,n].forEach(function(c){ lb.appendChild(c); });
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
      if (!stage.classList.contains('zoom') && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    });
  }
  function show(){ stage.classList.remove('zoom'); lbImg.src = items[idx].src; lbImg.alt = items[idx].caption || ''; lbCap.textContent = (items[idx].caption ? items[idx].caption + '  ' : '') + (items.length > 1 ? (idx+1) + ' / ' + items.length : '') + '  ·  사진을 누르면 확대'; }
  function open(list, i){ items = list; idx = i; if (!lb) buildLB(); show(); lb.classList.add('on'); document.body.style.overflow = 'hidden'; }
  function close(){ lb.classList.remove('on'); document.body.style.overflow = ''; }
  function go(d){ idx = (idx + d + items.length) % items.length; show(); }

  /* ── GitHub 폴더의 사진 목록 읽기 (파일명 순) ── */
  function listFolder(folder, fallback, cb){
    var G = D.github, key = 'ls:' + folder;
    function done(list){ cb(list && list.length ? list : (fallback || [])); }
    if (!G) return done();
    try { var c = JSON.parse(sessionStorage.getItem(key)); if (c && Date.now() - c.t < 120000) return done(c.l); } catch(e){}
    var url = 'https://api.github.com/repos/' + G.owner + '/' + G.repo + '/contents/' + folder + '?ref=' + (G.branch || 'main');
    fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(files){
        var list = files.filter(function(f){ return f.type === 'file' && /\.(jpe?g|png|webp|gif)$/i.test(f.name); })
          .sort(function(a,b){ return a.name.localeCompare(b.name, 'ko', { numeric: true }); })
          .map(function(f){ return { src: folder + '/' + encodeURIComponent(f.name) }; });
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), l: list })); } catch(e){}
        done(list);
      })
      .catch(function(){ done(); });
  }

  /* ── 방명록 페이지: 폴더별 섹션 ── */
  var SECTIONS = [
    { folder: 'guestbook', fallback: D.guestbook, layout: 'book', required: true,
      title: '방명록', desc: '찾아 주신 분들이 손글씨로 남겨 주신 마음입니다.' },
    { folder: 'children', layout: 'slips',
      title: '따뜻한 마음을 보태 준 어린이들', desc: '용돈을 가져와 기부해 준 어린이들이 무척 인상적이었습니다.' },
    { folder: 'envelopes', layout: 'slips',
      title: '따뜻한 한마음을 남겨 주신 분들', desc: '기부 봉투에 정성스러운 글귀를 남겨 주셨습니다.' }
  ];

  function renderSection(S, box){
    var head = el('div','sec-head'); head.appendChild(el('h2',null,S.title)); box.appendChild(head);
    if (S.desc) box.appendChild(el('p','sec-desc',S.desc));
    var body = el('div'); box.appendChild(body);
    body.appendChild(el('div','empty','불러오는 중…'));
    listFolder(S.folder, S.fallback, function(list){
      body.textContent = '';
      if (!list.length){
        if (S.required) body.appendChild(el('div','empty','사진이 곧 공개됩니다.'));
        else box.hidden = true;     /* 사진이 없는 섹션은 숨김 */
        return;
      }
      box.hidden = false;
      body.appendChild(el('div','count','총 ' + list.length + '장'));
      var wrap = el('div', S.layout === 'slips' ? 'slips' : 'book');
      list.forEach(function(p,i){
        var b = el('button', S.layout === 'slips' ? 'slip' : 'page'); b.type = 'button';
        b.setAttribute('aria-label', S.title + ' ' + (i+1) + ' 크게 보기');
        var im = el('img'); im.src = p.src; im.alt = S.title + ' ' + (i+1); im.loading = 'lazy'; im.decoding = 'async';
        b.appendChild(im);
        if (S.layout !== 'slips') b.appendChild(el('span',null,(i+1) + ''));
        b.onclick = function(){ open(list, i); };
        if (S.layout === 'slips'){ var w = el('div','slip-wrap'); w.appendChild(b); wrap.appendChild(w); }
        else wrap.appendChild(b);
      });
      body.appendChild(wrap);
    });
  }

  function guestbook(){
    SECTIONS.forEach(function(S){
      var box = el('section','part');
      if (!S.required) box.hidden = true;
      root.appendChild(box);
      renderSection(S, box);
    });
  }

  /* ── 포토월 / 사진: 폴더의 사진 전부 표시 ── */
  function folderPage(folder, fallback, emptyMsg, build){
    var msg = el('div','empty','불러오는 중…'); root.appendChild(msg);
    listFolder(folder, fallback, function(list){
      root.removeChild(msg);
      if (!list.length) return empty(emptyMsg);
      count(list.length);
      root.appendChild(build(list));
    });
  }

  function photowall(){
    folderPage('photos/wall', D.photowall, '포토월 사진이 곧 공개됩니다.', function(list){
      var wall = el('div','wall');
      list.forEach(function(p,i){
        var b = el('button','polaroid'); b.type = 'button'; b.setAttribute('aria-label','포토월 사진 ' + (i+1) + ' 크게 보기');
        var im = el('img'); im.src = p.src; im.alt = '포토월 사진 ' + (i+1); im.loading = 'lazy'; im.decoding = 'async';
        b.appendChild(im);
        b.onclick = function(){ open(list, i); };
        wall.appendChild(b);
      });
      return wall;
    });
  }

  function photos(){
    folderPage('photos/gallery', D.photos, '행사 사진이 곧 공개됩니다.', function(list){
      var g = el('div','gallery');
      list.forEach(function(p,i){
        var b = el('button'); b.type = 'button'; b.setAttribute('aria-label','사진 ' + (i+1) + ' 크게 보기');
        var im = el('img'); im.src = p.src; im.alt = '행사 사진 ' + (i+1); im.loading = 'lazy'; im.decoding = 'async';
        b.appendChild(im); b.onclick = function(){ open(list, i); };
        g.appendChild(b);
      });
      return g;
    });
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
