'use strict';
const c = window.PAINT_COMPANY;
const el = id => document.getElementById(id);
function node(tag, text, className) {
  const n = document.createElement(tag);
  if (text) n.textContent = text;
  if (className) n.className = className;
  return n;
}
function safeUrl(value) {
  if (!value) return '';
  try {
    const u = new URL(value, location.href);
    if (u.protocol === 'https:' || (!/^(?:[a-z]+:|\/\/)/i.test(value) && u.origin === location.origin)) return value;
  } catch {}
  return '';
}
function asset(img, path) {
  const url = safeUrl(path);
  if (url) img.src = url;
}
el('brand').textContent = c.name;
el('footer-name').textContent = c.roman || c.name;
document.title = c.name + '｜' + (c.demo ? 'RAISECOLOR 制作デモ' : '外壁塗装・リフォーム');
el('notice').textContent = c.demo ? 'RAISECOLOR 制作デモ · ' + (c.demoLabel || '架空の塗装会社') : '';
el('notice').hidden = !c.demo;
for (const [key,value] of Object.entries(c.colors || {})) {
  if (['ink','paper','accent'].includes(key) && /^#[\da-f]{6}$/i.test(value)) document.documentElement.style.setProperty('--' + key,value);
}
if (safeUrl(c.logo)) {
  const logo = node('img'); logo.alt = ''; asset(logo,c.logo);
  document.querySelector('.mark').replaceWith(logo);
}
for (const [i,line] of c.headline.entries()) {
  if (i) el('headline').append(node('br'));
  el('headline').append(line);
}
el('intro').textContent = c.intro;
asset(el('hero'),c.hero);
asset(el('craft-image'),c.craft);
asset(el('detail-image'),c.detail);
document.querySelector('.asset-note').textContent = c.imageNote ?? 'AI生成の参考イメージ';
el('works-note').textContent = c.worksNote ?? '外壁の色と質感で変わる、住まいの印象。掲載画像はAI生成の参考イメージです。';
for (const [i,[title,detail]] of c.strengths.entries()) {
  const row = node('article','','reason');
  const copy = node('div');
  copy.append(node('h3',title),node('p',detail));
  row.append(node('span',String(i+1).padStart(2,'0'),'num'),copy);
  el('strengths').append(row);
}
for (const item of c.projects) {
  const card = node('article','','project');
  const frame = node('div','','compare');
  const after = node('img');
  after.alt = item.alt || item.title;
  after.loading = 'lazy';
  asset(after,item.after);
  frame.append(after);
  card.append(frame);
  if (safeUrl(item.before)) {
    const before = node('img'); before.alt = item.beforeAlt || '施工前'; before.loading = 'lazy';
    asset(before,item.before); frame.append(before);
    const label = node('label','','range');
    const range = node('input'); range.type='range'; range.min='0'; range.max='100'; range.value='50';
    label.append(node('span',item.title + 'の比較（左：施工前／右：施工後）'),range);
    range.addEventListener('input',() => frame.style.setProperty('--split',range.value+'%'));
    card.append(label);
  }
  card.append(node('h3',item.title),node('p',item.detail));
  el('projects').append(card);
}
el('guarantee').textContent = c.guarantee || '';
el('region').textContent = c.region || '';
if (c.demo) {
  el('contact-note').textContent = 'このページは制作デモです。見積もり依頼や問い合わせは受け付けていません。';
} else {
  const contact = safeUrl(c.inquiry);
  const phone = /^[+\d][\d ()-]{5,24}$/.test(c.phone || '') ? c.phone : '';
  for (const [label,url] of [['お問い合わせ ↗',contact],['電話 ' + phone,phone && 'tel:' + phone.replace(/[^+\d]/g,'')]]) {
    if (url) { const link = node('a',label,'button'); link.href=url; el('contact-links').append(link); }
  }
  if (!contact && !phone) el('contact-note').textContent = '受付窓口は準備中です。';
}
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('visible'); observer.unobserve(entry.target);
    }
  });
  for (const section of document.querySelectorAll('.section-head')) { section.classList.add('reveal'); observer.observe(section); }
}
