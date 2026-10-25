# HPデモ テンプレート(STREAK / SUMI / GALLERY)

## 新しい営業先のデモを作る手順
1. `data/toshin.json` をコピーして `data/<会社名>.json` を作り、中身を書き換える
   - 写真は営業先サイトの画像URLをそのまま入れる
   - `{ }` で囲んだ文字はアクセント色で強調される
2. 型を選んでビルド
   ```
   cd _templates/engine
   python3 build.py ../data/<会社名>.json streak ../../<会社名>
   ```
   型: `streak`(黒×青・斜め帯・大きな英字)/ `sumi`(墨×金・明朝縦書き)/ `gallery`(生成り×深緑・写真ギャラリー)
3. 出力:index / service / works / company / contact の5ページ + CSS/JS
4. 色だけ変えたい場合は JSON の `colors` に `{"--accent":"#xxxxxx"}` のように書く

## 運用
- 公開URL: https://umemura-raisecolor.github.io/proposals/<フォルダ名>/
- 全ページ noindex。送信から2週間で削除。

## レター・フォームの署名(10/25 恵美さん指定の形で統一。フォームで送るときは必ず入れる)
```
ーーーーーーーーーーーーーー
合同会社ライズカラー 梅村恵美
〒105-0013 東京都港区浜松町2-2-15-2
TEL 080-4440-2010
Mail umemura@raisecolor.net
Web https://umemura-raisecolor.github.io/raisecolor/
```
※署名の前に必ず「今後このようなご案内がご不要でしたら、お手数ですがその旨ご返信ください。以後のご連絡は控えさせていただきます。」(フォームでもメールでも)
※(10/25 恵美さん判断)「見本ページは2週間ほどで削除いたします」は入れない(こちらの都合なので)
※Gmailで送るときは自動署名が付くので本文には入れない
