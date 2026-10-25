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
