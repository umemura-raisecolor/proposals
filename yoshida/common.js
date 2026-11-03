/* 汎用デモ 共通の動き */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var head = document.querySelector('header.site');

  // ヘッダー:スクロールで影、スマホメニュー
  function setHeadH(){ if(head) document.documentElement.style.setProperty('--head-h', head.getBoundingClientRect().bottom + 'px'); }
  setHeadH(); window.addEventListener('resize', setHeadH);
  var toTop = document.querySelector('.to-top');
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(head) head.classList.toggle('scrolled', y > 10);
    if(toTop) toTop.classList.toggle('show', y > 600);
    setHeadH();
  }, {passive:true});
  var mb = document.querySelector('.menu-btn');
  if(mb){
    mb.addEventListener('click', function(){
      var open = document.body.classList.toggle('menu-open');
      mb.setAttribute('aria-expanded', open);
      setHeadH();
    });
    document.querySelectorAll('nav.gnav a').forEach(function(a){ a.addEventListener('click', function(){ document.body.classList.remove('menu-open'); }); });
  }

  // スクロールでふわっと表示
  var targets = document.querySelectorAll('.rv,.reveal-img,.sec-head,.ba,.flow');
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          if(e.target.classList.contains('ba')) e.target.classList.add('hint');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.18, rootMargin:'0px 0px -40px 0px'});
    targets.forEach(function(t){ io.observe(t); });
  } else {
    targets.forEach(function(t){ t.classList.add('in'); });
  }

  // Before / After の比較つまみ
  document.querySelectorAll('.ba').forEach(function(ba){
    var r = ba.querySelector('input');
    if(!r) return;
    var set = function(){ ba.style.setProperty('--pos', r.value + '%'); };
    r.addEventListener('input', function(){ ba.classList.remove('hint'); set(); });
    set();
  });

  // 数字のカウントアップ(止まった瞬間にポンと弾む)
  var counts = document.querySelectorAll('.count');
  if(counts.length){
    var run = function(el){
      var to = +el.dataset.to, from = +(el.dataset.from || 0), t0 = null, dur = +(el.dataset.dur || 1600);
      if(reduce || isNaN(to)) return;
      // 最終の数字の幅を先に確保して、数字が変わっても周りが動かないようにする
      el.style.display = 'inline-block';
      el.style.textAlign = 'right';
      el.style.fontVariantNumeric = 'tabular-nums';
      el.style.minWidth = el.getBoundingClientRect().width + 'px';
      el.textContent = from;
      setTimeout(function(){ requestAnimationFrame(function step(t){
        if(!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        if(p < 1) requestAnimationFrame(step);
      }); }, +(el.dataset.delay || 0));
      // 描画が止まっている環境でも、最後は必ず目標の数字にする
      setTimeout(function(){ el.textContent = to; }, +(el.dataset.delay || 0) + dur + 150);
    };
    if('IntersectionObserver' in window){
      var co = new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting){ run(e.target); co.unobserve(e.target); } });
      }, {threshold:.5});
      counts.forEach(function(c){ co.observe(c); });
    }
  }
})();
