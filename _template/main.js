// メニュー開閉
const menuBtn = document.querySelector('.menu-btn');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', document.body.classList.contains('menu-open'));
  });
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
}

// スクロールで表示
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 数字のカウントアップ
const countIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = parseInt(el.dataset.to, 10);
    const dur = 1600;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-to]').forEach(el => countIO.observe(el));

// 施工事例の絞り込み
const filters = document.querySelectorAll('.filters button');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const cat = btn.dataset.cat;
  document.querySelectorAll('.work[data-cat]').forEach(w => {
    w.classList.toggle('hide', cat !== 'all' && w.dataset.cat !== cat);
  });
}));

// デモ用フォーム(送信はされません)
const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    form.querySelector('.msg').classList.add('show');
  });
}
