#!/usr/bin/env python3
"""ライズカラー 塗装会社向けホームページの型(STREAK / SUMI / GALLERY)

使い方:
  python3 build.py <会社データ.json> <型の名前> <書き出し先フォルダ>
  例) python3 build.py ../data/toshin.json streak ../../tpl/streak

会社ごとに書き換えるのは data/ の JSON 1ファイルだけ。
文字の { } で囲んだ部分は、型ごとの差し色で強調されます。
"""
import json, os, re, shutil, sys, html

HERE = os.path.dirname(os.path.abspath(__file__))
SKINS = ("streak", "sumi", "gallery")
FONTS = {
  "streak": "family=Oswald:wght@500;600;700&family=Noto+Sans+JP:wght@400;500;700;900",
  "sumi": "family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Shippori+Mincho+B1:wght@500;600;700;800&family=Noto+Sans+JP:wght@400;500;700",
  "gallery": "family=Jost:wght@400;500&family=Noto+Serif+JP:wght@500;600;700&family=Noto+Sans+JP:wght@400;500;700",
}
NAV = [("index.html", "HOME", "トップ"), ("service.html", "SERVICE", "工事の内容"), ("works.html", "WORKS", "施工実績"),
       ("company.html", "COMPANY", "会社案内"), ("contact.html", "CONTACT", "お問い合わせ")]
V = "?v=" + __import__("time").strftime("%m%d%H%M")

def e(s): return html.escape(str(s), quote=True)
def em(s):
    """{ } で囲んだ部分を強調にする"""
    return re.sub(r"\{(.+?)\}", r"<em>\1</em>", e(s))
def digits(s): return re.sub(r"[^0-9+]", "", s)

class Site:
    def __init__(self, d, skin):
        self.d, self.skin = d, skin

    # ---------- 共通の部品 ----------
    def head(self, title, desc, cur, extra=""):
        d = self.d
        nav = "".join(f'<a href="{h}"' + (' class="sp-only"' if h == "contact.html" else "") + (' aria-current="page"' if h == cur else "") +
                      f'><b>{en}</b><small>{jp}</small></a>' for h, en, jp in NAV)
        ld = {"@context": "https://schema.org", "@type": "HousePainter", "name": d["name"], "telephone": d["tel"],
              "address": {"@type": "PostalAddress", "postalCode": d["postal"], "addressRegion": d["region"], "addressLocality": d["city"], "streetAddress": d["street"], "addressCountry": "JP"},
              "founder": {"@type": "Person", "name": d["rep"]["name"]}, "areaServed": d["area"]}
        colors = "".join(f"--{k}:{v};" for k, v in d.get("colors", {}).get(self.skin, {}).items())
        logo = f'<img src="{e(d["logo"])}" alt="{e(d["name"])}">' if d.get("logo") and self.skin == "gallery" else f'<span class="lt">{e(d["name_en"] if self.skin != "sumi" else d["short"])}</span>'
        return f'''<!DOCTYPE html>
<html lang="ja" class="sk-{self.skin}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS[self.skin]}&display=swap">
<link rel="stylesheet" href="base.css{V}">
<link rel="stylesheet" href="skin.css{V}">
{f"<style>:root{{{colors}}}</style>" if colors else ""}
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
{extra}
</head>
<body>
<header class="site{' over' if cur == 'index.html' else ''}">
  <a class="brand" href="index.html" aria-label="{e(d['name'])} トップへ">{logo}</a>
  <nav class="gnav" id="gnav" aria-label="メインメニュー">{nav}</nav>
  <a class="h-tel" href="tel:{digits(d['tel_free'])}"><small>通話無料</small><b>{e(d['tel_free'])}</b></a>
  <a class="h-contact" href="contact.html"><b>CONTACT</b><small>無料お見積り</small></a>
  <button class="menu-btn" aria-label="メニュー" aria-controls="gnav" aria-expanded="false"><span></span><span></span><span></span></button>
</header>
'''

    def sh(self, en, jp, lead="", center=False):
        return (f'<header class="sh{" c" if center else ""} rv"><p class="en">{e(en)}</p><h2>{em(jp)}</h2>' +
                (f'<p class="lead">{e(lead)}</p>' if lead else "") + "</header>")

    def page_hero(self, en, jp, lead, img):
        return f'''<section class="ph-hero">
  <div class="ph-img" aria-hidden="true"><img src="{e(img)}" alt=""></div>
  <div class="wrap"><p class="en">{e(en)}</p><h1>{e(jp)}</h1><p class="lead">{e(lead)}</p><p class="crumb"><a href="index.html">トップ</a> ／ {e(jp)}</p></div>
</section>'''

    def cta(self):
        d = self.d
        return f'''<section class="cta">
  <div class="wrap">
    <div class="rv"><p class="en">CONTACT</p><h2>まずは、建物の状態を<br>見せてください。</h2><p>現地を拝見して、塗装で良いのか、防水や交換が必要なのか、建物の状態とご予算に合った方法を正直にご提案します。お見積りは無料です。</p></div>
    <div class="acts rv dl1">
      <a class="btn btn-main" href="contact.html"><span class="tag">無料</span>お見積り・ご相談 <span class="arw">→</span></a>
      <a class="tel-btn" href="tel:{digits(d['tel_free'])}"><small>通話無料・お電話でのご相談</small><b>{e(d['tel_free'])}</b></a>
    </div>
  </div>
</section>'''

    def foot(self, js=""):
        d = self.d
        nav = "".join(f'<a href="{h}">{jp}</a>' for h, en, jp in NAV)
        return f'''<footer class="site">
  <div class="wrap">
    <div class="cols">
      <div><p class="fname">{e(d['name'])}</p><p>〒{e(d['postal'])} {e(d['address'])}<br>フリーダイヤル {e(d['tel_free'])}／TEL {e(d['tel'])}{"／FAX " + e(d['fax']) if d.get('fax') else ""}<br>{e(d['license'])}</p></div>
      <nav class="fnav" aria-label="フッターメニュー">{nav}</nav>
    </div>
    <p class="copy">© 2026 {e(d['name'])} All Rights Reserved.</p>
  </div>
</footer>
<div class="sp-bar"><a class="t" href="tel:{digits(d['tel_free'])}"><small>通話無料</small>電話で相談</a><a class="m" href="contact.html"><small>かんたん入力</small>無料お見積り</a></div>
<a class="to-top" href="#" aria-label="ページの先頭へ">↑</a>
<script src="common.js{V}"></script>
{js}
<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{{"token": "66a2b055c38a48da9c19547b0177c091"}}'></script><!-- End Cloudflare Web Analytics -->
</body>
</html>
'''

    # ---------- ファーストビュー(型ごと) ----------
    def T(self, k, default):
        return self.d.get("texts", {}).get(k, default)

    def fv(self):
        d, h = self.d, self.d["hero"]
        acts = f'''<div class="acts"><a class="btn btn-main" href="contact.html"><span class="tag">無料</span>お見積り・ご相談 <span class="arw">→</span></a><a class="tel-btn" href="tel:{digits(d['tel_free'])}"><small>通話無料・お電話でのご相談</small><b>{e(d['tel_free'])}</b></a></div>'''
        if self.skin == "streak":
            nums = "".join(f'<div><span class="count" data-to="{n}">{n}</span><small>{e(u)}</small><i>{e(l)}</i></div>' for n, u, l in d["facts"][:2])
            lines = "".join(f'<span><i>{em(x)}</i></span>' for x in h["catch"])
            return f'''<section class="fv" aria-label="ご紹介">
  <div class="fv-photo"><img src="{e(h['photo'])}" alt="{e(h.get('photo_alt', d['short'] + 'の現場'))}" style="object-position:{e(h['photo_pos'])}"></div>
  <div class="fv-streak" aria-hidden="true"></div>
  <p class="fv-tag" aria-hidden="true">{e(h['tagline_en'])}</p>
  <div class="fv-nums" aria-hidden="true">{nums}</div>
  <div class="fv-copy">
    <p class="fv-eyebrow">{e(h['place_en'])}</p>
    <h1>{lines}</h1>
    <p class="fv-sub">{e(h['sub'])}<br>{e(h['sub2'])}</p>
    {acts}
  </div>
</section>'''
        if self.skin == "sumi":
            v = "".join(f'<span>{em(x)}</span>' for x in h["catch_kanji"])
            return f'''<div class="intro" aria-hidden="true"><b>{e(d['short'])}</b><small>{e(h['place_en'].title())}</small></div>
<section class="fv" aria-label="ご紹介">
  <img class="fv-bg" src="{e(h['photo'])}" alt="{e(h.get('photo_alt', d['short'] + 'の現場'))}" style="object-position:{e(h['photo_pos'])}">
  <span class="fv-frame" aria-hidden="true"></span>
  <h1 class="fv-vert">{v}<span class="s">{e(h['sub'])}</span></h1>
  <div class="fv-left">
    <p class="fv-tag">{e(h['tagline_en'])}</p>
    <p class="fv-en">{e(h['en_short'])}</p>
    <p class="fv-sub2">{e(h['sub2'])}</p>
    {acts}
  </div>
  <p class="fv-cap" aria-hidden="true">{e(h['photo_caption'])}</p>
</section>'''
        # gallery
        figs = f'<figure class="a"><img src="{e(h["photo"])}" alt="{e(h.get("photo_alt", d["short"] + "の現場"))}" style="object-position:{e(h["photo_pos"])}"><figcaption>{e(h.get("photo_caption_en", "ON SITE — " + h["place_en"].split(",")[0]))}</figcaption></figure>'
        figs += "".join(f'<figure class="{c}"><img src="{e(p)}" alt=""><figcaption>{e(cap)}</figcaption></figure>' for c, (p, cap) in zip("bc", h["photos"]))
        cat = "<br>".join(em(x) for x in h["catch_kanji"])
        return f'''<section class="fv" aria-label="ご紹介">
  {figs}
  <div class="fv-copy"><h1>{cat}</h1><p>{e(h['sub'])}<br>{e(h['sub2'])}</p>{acts}</div>
</section>'''

    # ---------- セクション ----------
    def trust(self):
        items = "".join(f'<li class="rv dl{k}"><b>{e(a)}</b><small>{e(b)}</small></li>' for k, (a, b) in enumerate(self.d["trust"]))
        badges = "".join(f"<li>{e(b)}</li>" for b in self.d["badges"])
        return f'<section class="trust" aria-label="信頼の理由"><div class="wrap"><ul class="trust-list">{items}</ul><ul class="badges">{badges}</ul></div></section>'

    def wcard(self, w, k=0):
        rows = "".join(f"<dt>{e(a)}</dt><dd>{e(b)}</dd>" for a, b in w["rows"])
        cost = "<dt>工期・費用</dt><dd>—</dd>" if self.T("works_cost_row", True) else ""
        la = w.get("la", "AFTER")
        return f'''<article class="wcard rv dl{k % 2 + 1}">
  <div class="pair"><figure><img src="{e(w['b'])}" alt="{e(w['area'])} {e(w['t'])} {e(w['lb'])}" loading="lazy"><figcaption>{e(w['lb'])}</figcaption></figure><figure class="af"><img src="{e(w['a'])}" alt="{e(w['area'])} {e(w['t'])} {e(la)}" loading="lazy"><figcaption>{e(la)}</figcaption></figure></div>
  <div class="bd"><p class="area"><span>{e(w['area_en'])}</span>{e(w['area'])}</p><h3>{e(w['t'])}</h3><dl>{rows}{cost}</dl></div>
</article>'''

    def works(self, n=None, more=True):
        ws = self.d["works"][:n] if n else self.d["works"]
        btn = '<p class="more rv"><a class="btn btn-line" href="works.html">施工実績をすべて見る <span class="arw">→</span></a></p>' if more else ""
        return f'''<section class="sec s-works"><div class="wrap">
  {self.sh("WORKS", "施工実績", self.T("works_lead", "施工前と施工後、工事の中身まで。同じ形で見比べていただけます。"))}
  <div class="works">{"".join(self.wcard(w, k) for k, w in enumerate(ws))}</div>
  <p class="note">{e(self.d['works_note'])}</p>{btn}
</div></section>'''

    def proof(self):
        p = self.d["proof"]
        def figs(x):
            f = f'<figure><img src="{e(x["a"])}" alt="{e(x["t"])} {e(x.get("la",""))}" loading="lazy"><figcaption>{e(x.get("la",""))}</figcaption></figure>'
            if x.get("b"):
                f += f'<figure><img src="{e(x["b"])}" alt="{e(x["t"])} {e(x.get("lb",""))}" loading="lazy"><figcaption>{e(x.get("lb",""))}</figcaption></figure>'
            return f'<div class="two{"" if x.get("b") else " one"}">{f}</div>'
        def yr(x):
            if "y" in x:
                return f'<p class="yr"><span class="count" data-to="{x["y"]}">{x["y"]}</span><small>{e(x.get("ysuf", "年後も"))}</small></p>'
            return f'<p class="yr"><small>{e(x.get("tag", ""))}</small></p>'
        items = "".join(f'''<article class="pitem rv dl{k+1}">{figs(x)}
<div class="bd">{yr(x)}<h3>{e(x['t'])}｜{e(x['k'])}</h3><p class="when">{e(x['when'])}</p><p>{e(x['text'])}</p></div></article>''' for k, x in enumerate(p["items"]))
        return f'''<section class="sec s-proof"><div class="wrap">
  <div class="proof-top"><p class="big rv"><span class="count" data-to="{p['big']}">{p['big']}</span><small>{e(p['big_label'])}</small></p>{self.sh(p.get('en', 'PROOF'), p['title'], p['lead'])}</div>
  <div class="proof">{items}</div>
</div></section>'''

    def reasons(self):
        r = "".join(f'<article class="reason rv dl{k+1}"><div class="r-img reveal-img"><img src="{e(i)}" alt="" loading="lazy"></div><div class="bd"><h3>{e(t)}</h3><p>{e(x)}</p></div></article>' for k, (i, t, x) in enumerate(self.d["reasons"]))
        hands = "".join(f'<figure class="rv dl{k+1}"><img src="{e(i)}" alt="{e(c)}" loading="lazy"><figcaption>{e(c)}</figcaption></figure>' for k, (i, c) in enumerate(self.d["hands"]))
        return f'''<section class="sec s-reasons"><div class="wrap">
  {self.sh("CRAFTSMANSHIP", "選ばれる理由", self.d['reasons_lead'])}
  <div class="reasons">{r}</div>
  <div class="hands"><p class="hands-h rv">{e(self.T('hands_h', '手元にこそ、仕事は出る。'))}</p><div class="hands-row">{hands}</div></div>
</div></section>'''

    def services(self):
        s = "".join(f'<a class="svc rv dl{k+1}" href="service.html#{e(x["id"])}"><img src="{e(x["img"])}" alt="" loading="lazy"><span class="bd"><span class="s-en">{e(x["en"])}</span><b>{e(x["t"])}</b><span class="s-tx">{e(x["short"])}</span><span class="s-more">くわしく見る →</span></span></a>' for k, x in enumerate(self.d["services"]))
        return f'''<section class="sec s-service"><div class="wrap">
  {self.sh("SERVICE", "工事の内容", self.d['services_lead'])}
  <div class="svcs">{s}</div>
</div></section>'''

    def message(self, full=False):
        d, m = self.d, self.d["message"]
        paras = "".join(f"<p>{e(x)}</p>" for x in m["paras"])
        btn = "" if full else '<a class="btn btn-line" href="company.html">会社案内を見る <span class="arw">→</span></a>'
        return f'''<section class="sec s-message"><div class="wrap msg">
  <div class="m-img rv"><div class="reveal-img"><img src="{e(d['rep']['photo'])}" alt="{e(d['rep']['title'])} {e(d['rep']['name'])}" loading="lazy"></div><p class="m-name"><small>{e(d['rep']['title'])}</small>{e(d['rep']['name'])}</p></div>
  <div class="m-tx rv dl1"><p class="en">MESSAGE</p><h2>{e(m['title'])}</h2>{paras}{btn}</div>
</div>{f'<div class="wrap"><p class="vision rv"><small>OUR VISION</small>{e(m["vision"])}</p></div>' if full else ""}</section>'''

    def flow(self):
        f = "".join(f'<li class="rv dl{k+1}"><span class="f-no">STEP {k+1}</span><h3>{e(t)}</h3><p>{e(x)}</p></li>' for k, (t, x) in enumerate(self.d["flow"]))
        return f'<section class="sec s-flow"><div class="wrap">{self.sh("FLOW", "ご依頼の流れ", "はじめての方にも安心していただけるよう、工事の前にしっかりご説明します。")}<ol class="flow">{f}</ol></div></section>'

    # ---------- ページ ----------
    def index(self):
        d = self.d
        js = ""
        if self.skin == "streak":
            pass
        return (self.head(d["seo"]["title"], d["seo"]["desc"], "index.html") + "<main>" + self.fv() + self.trust() + self.works(4) +
                self.proof() + self.reasons() + self.services() + self.message() + self.flow() + "</main>" + self.cta() + self.foot(js))

    def service(self):
        d = self.d
        blocks = ""
        for k, s in enumerate(d["services"]):
            lis = "".join(f"<li>{e(x)}</li>" for x in s["items"])
            blocks += f'''<section class="sec s-blk{" alt" if k % 2 else ""}" id="{e(s['id'])}"><div class="wrap blk{" rev" if k % 2 else ""}">
  <div class="b-img reveal-img rv"><img src="{e(s['img'])}" alt="{e(s['t'])}" loading="lazy"></div>
  <div class="b-tx rv dl1"><p class="en">{e(s['en'])}</p><h2>{e(s['t'])}</h2><p>{e(s['text'])}</p><ul class="chk">{lis}</ul></div>
</div></section>'''
        steps = "".join(f'<div class="wrap"><h3 class="sub-h rv">{e(t)}</h3><div class="steps">' + "".join(f'<figure class="rv"><img src="{e(i)}" alt="{e(c)}" loading="lazy"><figcaption><span>{n+1}</span>{e(c)}</figcaption></figure>' for n, (i, c) in enumerate(L)) + "</div></div>" for t, L in d.get("steps", []))
        small = "".join(f'<figure class="rv"><img src="{e(i)}" alt="{e(t)}" loading="lazy"><figcaption><b>{e(t)}</b>{e(x)}</figcaption></figure>' for i, t, x in d.get("small", []))
        return (self.head(f"工事の内容｜{self.T('service_kw', '外壁・屋根塗装、防水工事、雨漏り修理、改修')}｜{d['name']}", f"{d['name']}の工事の内容。{self.T('service_kw', '外壁・屋根塗装、防水工事、雨漏り修理、改修')}をご紹介します。", "service.html") +
                "<main>" + self.page_hero("SERVICE", "工事の内容", d["services_lead"], d["page_photos"]["service"]) + blocks +
                (f'<section class="sec s-steps">{steps}</section>' if steps else "") +
                (f'<section class="sec s-small"><div class="wrap">{self.sh("SMALL WORKS", self.T('small_h', '小さな塗装も、お任せください'), self.T('small_lead', '玄関扉1枚、カウンター1台から。暮らしの中の「ちょっと直したい」にもお応えします。'))}<div class="small">{small}</div></div></section>' if small else "") +
                "</main>" + self.cta() + self.foot())

    def works_page(self):
        d = self.d
        return (self.head(f"施工実績｜{d['name']}", f"{d['name']}の施工実績。" + self.T('works_desc', '施工前・施工後と工事内容、塗装から年数がたったお住まいの様子をご紹介します。'), "works.html") +
                "<main>" + self.page_hero("WORKS", "施工実績", self.T('works_page_lead', '施工前と施工後、工事の中身、そして何年もたったあとの様子までご覧いただけます。'), d["page_photos"]["works"]) +
                self.works(more=False) + self.proof() + "</main>" + self.cta() + self.foot())

    def company(self):
        d = self.d
        rows = [("会社名", d["name"]), ("代表者", f"{d['rep']['title']} {d['rep']['name']}"), ("所在地", f"〒{d['postal']} {d['address']}"),
                ("電話", f"フリーダイヤル {d['tel_free']}<br>TEL {d['tel']}" + (f"／FAX {d['fax']}" if d.get("fax") else "")), ("事業内容", d["business"]),
                ("建設業許可", d["license"]), ("対応エリア", d["area"])] + [tuple(x) for x in d.get("profile_extra", [])]
        tbl = "".join(f"<tr><th>{e(a)}</th><td>{b if '<br>' in b else e(b)}</td></tr>" for a, b in rows)
        q = "https://maps.google.com/maps?q=" + __import__("urllib.parse").parse.quote(d["address"]) + "&z=15&output=embed"
        rec = d.get("recruit")
        recruit = f'''<section class="sec s-recruit"><div class="wrap blk"><div class="b-img reveal-img rv"><img src="{e(rec['img'])}" alt="" loading="lazy"></div><div class="b-tx rv dl1"><p class="en">RECRUIT</p><h2>{e(rec.get('title', '職人を募集しています'))}</h2><p>{e(rec['text'])}</p><a class="btn btn-line" href="contact.html">募集について問い合わせる <span class="arw">→</span></a></div></div></section>''' if rec else ""
        return (self.head(f"会社案内｜{d['name']}", f"{d['name']}の会社案内。代表あいさつ、会社概要、所在地をご紹介します。", "company.html") +
                "<main>" + self.page_hero("COMPANY", "会社案内", d["message"]["title"], d["page_photos"]["company"]) + self.message(full=True) +
                f'<section class="sec s-profile"><div class="wrap">{self.sh("PROFILE", "会社概要")}<table class="info rv">{tbl}</table><div class="map rv"><iframe title="{e(d["name"])}の地図" loading="lazy" src="{q}"></iframe></div></div></section>' +
                recruit + "</main>" + self.cta() + self.foot())

    def contact(self):
        d = self.d
        kinds = "".join(f'<label><input type="radio" name="kind"{" checked" if k == 0 else ""}> {e(x)}</label>' for k, x in enumerate(d["contact_kinds"]))
        js = "<script>document.getElementById('cf').addEventListener('submit',function(ev){ev.preventDefault();document.getElementById('done').hidden=false;});</script>"
        return (self.head(f"お問い合わせ・無料お見積り｜{d['name']}", f"{d['name']}へのお問い合わせ・無料お見積りはこちら。", "contact.html") +
                "<main>" + self.page_hero("CONTACT", "お問い合わせ", "お見積り・ご相談は無料です。お電話でも、フォームからでもお気軽にどうぞ。", d["page_photos"]["contact"]) + f'''
<section class="sec s-contact"><div class="wrap">
  <div class="tel-box"><a class="rv dl1" href="tel:{digits(d['tel_free'])}"><small>通話無料</small><b>{e(d['tel_free'])}</b></a><a class="rv dl2" href="tel:{digits(d['tel'])}"><small>TEL</small><b>{e(d['tel'])}</b></a></div>
  <form class="cf rv" id="cf" novalidate>
    <div class="row"><span class="t">ご相談の内容</span><div class="radios">{kinds}</div></div>
    <div class="row"><label class="t" for="nm">お名前 <span class="req">必須</span></label><input type="text" id="nm" autocomplete="name"></div>
    <div class="row"><label class="t" for="em">メールアドレス <span class="req">必須</span></label><input type="email" id="em" autocomplete="email"></div>
    <div class="row"><label class="t" for="tl">お電話番号</label><input type="tel" id="tl" autocomplete="tel"></div>
    <div class="row"><label class="t" for="ms">ご相談内容</label><textarea id="ms" placeholder="{e(self.T('form_ph', '例:築15年の戸建てです。ベランダの下の天井にシミが出ています。'))}"></textarea></div>
    <div class="send"><button class="btn btn-main" type="submit"><span class="tag">無料</span>この内容で送信する <span class="arw">→</span></button></div>
    <p class="done" id="done" role="status" hidden>こちらはご提案用の見本ページのため、送信はされません。<br>実際のサイトでは、このまま{e(d['short'])}様のメールに届く形にいたします。</p>
  </form>
</div></section></main>''' + self.foot(js))

def build(data_path, skin, out):
    d = json.load(open(data_path, encoding="utf-8"))
    os.makedirs(out, exist_ok=True)
    s = Site(d, skin)
    for name, fn in [("index.html", s.index), ("service.html", s.service), ("works.html", s.works_page), ("company.html", s.company), ("contact.html", s.contact)]:
        open(os.path.join(out, name), "w", encoding="utf-8").write(fn())
    shutil.copy(os.path.join(HERE, "base.css"), os.path.join(out, "base.css"))
    shutil.copy(os.path.join(HERE, "skins", skin + ".css"), os.path.join(out, "skin.css"))
    shutil.copy(os.path.join(HERE, "common.js"), os.path.join(out, "common.js"))

if __name__ == "__main__":
    if len(sys.argv) != 4 or sys.argv[2] not in SKINS:
        print(__doc__); sys.exit(1)
    build(*sys.argv[1:])
    print("ok", sys.argv[2], "->", sys.argv[3])
