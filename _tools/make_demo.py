#!/usr/bin/env python3
"""営業先ごとの専用デモ(index.html)と比較ページ(compare.html)を作る。
使い方: python3 _tools/make_demo.py _tools/companies.json
companies.json の各社について /<slug>/ を作り直す(sample を元にする)。
"""
import json, os, re, shutil, sys, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAMPLE = os.path.join(ROOT, 'sample')
TPL = os.path.join(ROOT, '_tools', 'compare_tpl.html')

def build(c):
    d = os.path.join(ROOT, c['slug'])
    os.makedirs(d, exist_ok=True)
    for f in ('base.css', 'common.js', 'skin.css'):
        shutil.copy(os.path.join(SAMPLE, f), d)
    s = open(os.path.join(SAMPLE, 'index.html'), encoding='utf-8').read()

    # 写真(あれば差し替え)
    for k, v in zip(['img/house1.jpg', 'img/house2.jpg', 'img/house3.jpg', 'img/house4.jpg'], c.get('photos', [])):
        s = s.replace(k, v)
    s = s.replace('img/', '../sample/img/')

    name, short = c['name'], c['short']
    city, pref = c['city'], c['pref']
    tel = c['tel']; teld = tel.replace('-', '')
    fv = c['fv']
    rep = [
        ('SINCE 1986 ・ LOCAL PAINTING COMPANY', fv['eye']),
        ('<span class="count" data-to="40" data-delay="500" data-dur="1900">40</span><span class="u"><b>YEARS</b><small>年、この街の家を塗ってきた。</small></span>',
         f'<span class="count" data-to="{fv["num"]}" data-delay="500" data-dur="1900">{fv["num"]}</span><span class="u"><b>{fv["en"]}</b><small>{fv["small"]}</small></span>'),
        ('創業40年。〇〇市の塗装会社、〇〇塗装です。', fv['sub']),
    ]
    trust_old = ['<b>創業1986年・2代目</b><small>40年、地元で塗装一筋</small>',
                 '<b>施工実績 3,000件以上</b><small>戸建てからマンションまで</small>',
                 '<b>完全自社施工</b><small>下請けに丸投げしません</small>',
                 '<b>1級塗装技能士 在籍</b><small>国家資格をもつ職人が施工</small>']
    for o, n in zip(trust_old, c['trust']):
        rep.append((o, f'<b>{n[0]}</b><small>{n[1]}</small>'))
    rep += [
        ('<p>下請けへの丸投げはせず、国家資格をもつ自社の職人が施工します。工事のあとも定期点検にうかがい、最長10年の保証でお守りします。</p>', f'<p>{c["reason3"]}</p>'),
        ('最長10年の工事保証', c['badge']),
        ('地元で40年、この街の家を塗らせていただいてきました。', c['message']),
        ('<small>2代目 代表取締役</small>〇〇 〇〇', f'<small>{c["rep_title"]}</small>{c["rep_name"]}'),
        ('代表取締役 〇〇 〇〇', f'{c["rep_title"]} {c["rep_name"]}'),
        ('〇〇塗装株式会社', name), ('〇〇塗装', short),
        ('〒000-0000 〇〇県〇〇市〇〇町1-2-3', c['address']),
        ('フリーダイヤル 0120-000-000<br>TEL 000-000-0000', ('フリーダイヤル ' if tel.startswith('0120') else 'TEL ') + tel),
        ('<small>通話無料</small>', '<small>通話無料</small>' if tel.startswith('0120') else '<small>お電話</small>'),
        ('通話無料・お電話でのご相談', '通話無料・お電話でのご相談' if tel.startswith('0120') else 'お電話でのご相談'),
        ('0120-000-000', tel), ('tel:0120000000', 'tel:' + teld),
        ('〇〇市を中心に、近隣の市町村', c['area']),
        ('〇〇県', pref), ('〇〇市', city),
    ]
    for a, b in rep:
        s = s.replace(a, b)
    s = re.sub(r'<tr><th>建設業許可</th><td>[^<]*</td></tr>', '', s)
    s = re.sub(r'<tr><th>創業</th><td>[^<]*</td></tr>', c.get('founded_row', ''), s)
    s = s.replace('<tr><th>保有資格</th><td>1級塗装技能士／外壁劣化診断士</td></tr>', '')
    # 満足度の数字:実際の数字があれば使い、なければ消す
    big = r'<p class="big rv"><span class="count" data-to="98">98</span><small>%のお客様が「満足」とお答えくださいました。</small></p>'
    if c.get('satisfaction'):
        s = s.replace(big, f'<p class="big rv"><span class="count" data-to="{c["satisfaction"]}">{c["satisfaction"]}</span><small>%のお客様にご満足いただいています。</small></p>')
    else:
        s = s.replace(big, '')
    photo_note = f'施工写真は、{short}様の現在のホームページから使用しています。' if c.get('photos') else '写真はイメージです。'
    s = s.replace('※こちらは見本ページです。写真・文章はすべてサンプルで、実際は貴社の写真と実績に差し替えます。',
                  f'※こちらは{short}様へのご提案用の見本ページです。{photo_note}お客様の声などの文章はイメージで、実際は貴社の内容に差し替えます。')
    left = re.findall(r'.{10}〇〇.{10}', s)
    if left:
        print('  ! 未置換:', c['slug'], left[:5])
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(s)

    t = open(TPL, encoding='utf-8').read()
    t = t.replace('{{SHORT}}', html.escape(short)).replace('{{SITE}}', html.escape(c['site']))
    open(os.path.join(d, 'compare.html'), 'w', encoding='utf-8').write(t)

if __name__ == '__main__':
    for c in json.load(open(sys.argv[1], encoding='utf-8')):
        build(c); print('ok', c['slug'])
