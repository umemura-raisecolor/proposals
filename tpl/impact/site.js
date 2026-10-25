/* ============================================================
   IMPACT(全画面カルーセルの型)
   会社ごとに書き換えるのは、このファイルだけです。
   index.html は共通の型なので触りません。
   { } で囲んだ文字はゴールドで強調されます。
   下はトーシン株式会社さん(調布市)の記入例です。
   ============================================================ */
window.SITE = {

  // --- ページの情報 ---
  title: "トーシン株式会社｜調布市の外壁塗装・防水工事・雨漏り修理",
  description: "東京都調布市のトーシン株式会社。一級塗装技能士の代表が率いる職人の会社です。外壁・屋根塗装、防水工事、雨漏り修理、マンション改修。お見積り無料。",

  // --- 会社 ---
  company: "トーシン株式会社",
  companyEn: "TO-SHIN",
  logo: "",                       // ロゴ画像のURL(なければ "" で社名を文字で表示)
  tel: "0120-416-104",
  telNote: "受付 8:00〜18:00 ／ お見積り無料",
  area: "調布市を中心に、東京・多摩地区",

  // --- ファーストビュー(全画面で切り替わる写真。3〜5枚) ---
  // en:写真にまたがる巨大な英字(2行) / catch:日本語のキャッチ(2行)
  // pos:写真の見せたい位置("50% 50%" が真ん中)
  slides: [
    {
      img: "https://to-shin.tokyo/wp-content/uploads/2025/03/IMG_8059-scaled.jpg", pos: "50% 40%",
      kicker: "調布市の塗装・防水・雨漏り修理",
      en: ["PAINTED", "TO LAST."],
      catch: ["塗装の差は、", "{16年後}に出る。"],
      caption: "稲城市｜屋根カバー工法・外壁塗装"
    },
    {
      img: "https://to-shin.tokyo/wp-content/uploads/2025/03/DSCN0027-scaled.jpg", pos: "70% 35%",
      kicker: "一級塗装技能士の代表が率いる職人の会社",
      en: ["CRAFTS", "MANSHIP."],
      catch: ["仕上がりは、", "{職人の腕}で決まる。"],
      caption: "調布市 佐須町の現場"
    },
    {
      img: "https://to-shin.tokyo/wp-content/uploads/2022/09/IMG_9191-scaled.jpg", pos: "50% 45%",
      kicker: "見えなくなる下地まで、手を抜かない",
      en: ["NO SHORT", "CUTS."],
      catch: ["見えない所に、", "{手間}をかける。"],
      caption: "世田谷区 桜上水｜アパートの塗り替え"
    },
    {
      img: "https://to-shin.tokyo/wp-content/uploads/2025/03/IMG_7684-scaled.jpg", pos: "50% 50%",
      kicker: "塗装も防水も雨漏りも、一社で",
      en: ["ONE", "TEAM."],
      catch: ["建物の外まわりを、", "{まるごと}守る。"],
      caption: "調布市｜外壁(サイディング)の塗り替え"
    }
  ],

  // 写真の下を流れつづける文字
  marquee: ["外壁塗装", "屋根塗装", "防水工事", "雨漏り修理", "マンション改修", "シーリング打ち替え"],

  // --- 大きな数字(4つ。0からカウントアップ。料金・値段は入れない) ---
  facts: [
    { num: 16, unit: "年後", label: "たっても剥がれ・ひび割れなし" },
    { num: 11, unit: "年後", label: "たっても屋根に剥がれ・錆なし" },
    { num: 1,  unit: "級",   label: "塗装技能士の代表が責任を持つ" },
    { num: 3,  unit: "分野", label: "塗装・防水・マンション改修" }
  ],

  // --- 施工事例(施工前→施工後。真ん中のつまみを動かして見比べられます) ---
  works: {
    lead: "つまみを左右に動かすと、施工前と施工後を見比べられます。",
    items: [
      { area: "稲城市", title: "屋根カバー工法・外壁塗装",
        before: "https://to-shin.tokyo/wp-content/uploads/2025/03/IMG_7798.jpg",
        after:  "https://to-shin.tokyo/wp-content/uploads/2025/03/IMG_8059-scaled.jpg",
        text: "屋根はカバー工法で葺き替えずに一新。外壁は目地の打ち替えから塗装まで行いました。" },
      { area: "世田谷区 桜上水", title: "アパートの塗り替え",
        before: "https://to-shin.tokyo/wp-content/uploads/2022/09/IMG_9098-scaled.jpg",
        after:  "https://to-shin.tokyo/wp-content/uploads/2022/09/IMG_9191-scaled.jpg",
        text: "入居者さまの暮らしに配慮しながら、外壁・鉄部をまとめて塗り替えました。" },
      { area: "小金井市", title: "ベランダの雨漏り修理",
        before: "https://to-shin.tokyo/wp-content/uploads/2022/02/DSC_1993.jpg",
        after:  "https://to-shin.tokyo/wp-content/uploads/2022/02/IMG_8450-scaled.jpg",
        text: "原因を確かめたうえで、ベランダの防水をやり直し、雨漏りを止めました。" }
    ]
  },

  // --- 選ばれる理由(3つ。写真と文章が左右交互に並びます) ---
  reasons: {
    lead: "真面目さが技術に、技術が丁寧な仕事に。",
    items: [
      { img: "https://to-shin.tokyo/wp-content/uploads/2025/03/DSCN0027-scaled.jpg",
        title: "仕上がりは、職人の腕で決まる",
        text: "どんなに良い塗料でも、塗るのは職人です。営業の話術ではなく、現場の腕で選ばれる会社であるために、職人が技量を発揮できる環境づくりを大切にしています。" },
      { img: "https://to-shin.tokyo/wp-content/uploads/2016/12/4.jpg",
        title: "見えなくなる下地に、手間をかける",
        text: "ひび割れの補修、古いシーリングの撤去と打ち替え、下塗り。仕上がれば見えない工程こそ、塗装の寿命を左右します。" },
      { img: "https://to-shin.tokyo/wp-content/uploads/2025/03/12.jpg",
        title: "塗装だけにこだわらない、正直な提案",
        text: "塗装で十分なところは塗装で。交換やカバー工法のほうが長い目でお得なところは、正直にそうご提案します。" }
    ]
  },

  // --- 代表あいさつ(顔写真があると信頼感がぐっと上がります) ---
  message: {
    photo: "https://to-shin.tokyo/wp-content/uploads/2022/11/0f319951ce5583cfdb768a1e009e2fb2.jpg",
    name: "畑農 維人",
    role: "代表取締役 ／ 一級塗装技能士",
    heading: "塗装業界で、{一番信頼できる}会社を。",
    paras: [
      "この想いで、トーシン株式会社を立ち上げました。仕上がりを決めるのは、資材でも営業の話術でもなく、実際に施工する職人の腕です。",
      "最終仕上げ業者としてのプライドと責任を持って、一つひとつの現場に向き合っています。塗装・防水・雨漏り・マンション改修のことなら、どうぞお気軽にご相談ください。"
    ]
  },

  // --- 工事の内容 ---
  services: [
    { en: "PAINTING",   title: "外壁・屋根塗装", img: "https://to-shin.tokyo/wp-content/uploads/2025/03/IMG_7684-scaled.jpg",
      text: "下地補修から丁寧に。何年たっても剥がれない塗装を。" },
    { en: "WATERPROOF", title: "防水工事",       img: "https://to-shin.tokyo/wp-content/uploads/2018/10/bousui.jpg",
      text: "シーリング、ベランダ、廊下・階段、屋上まで。" },
    { en: "LEAK REPAIR",title: "雨漏り修理",     img: "https://to-shin.tokyo/wp-content/uploads/2022/02/IMG_8450-scaled.jpg",
      text: "原因を職人の目で確かめてから、直し方をご提案します。" },
    { en: "RENOVATION", title: "マンション改修", img: "https://to-shin.tokyo/wp-content/uploads/2022/09/IMG_9191-scaled.jpg",
      text: "アパート・マンションの大規模修繕もお任せください。" }
  ],

  // --- ご依頼の流れ(順番どおりに並びます) ---
  flow: [
    { title: "お問い合わせ",     text: "お電話かフォームから、お気軽にご連絡ください。" },
    { title: "現地調査",         text: "亀裂や欠損、雨漏りの原因などを、職人の目で確かめます。" },
    { title: "ご提案・お見積り", text: "塗装・防水・交換など、建物に合った方法をご説明します。" },
    { title: "施工・お引き渡し", text: "下地処理から丁寧に施工し、仕上がりを一緒に確認します。" }
  ],

  // --- 会社概要 ---
  profile: [
    ["会社名",   "トーシン株式会社"],
    ["代表者",   "代表取締役 畑農 維人(一級塗装技能士)"],
    ["所在地",   "〒182-0036 東京都調布市飛田給3-25-33"],
    ["電話",     "0120-416-104 ／ 042-485-4147"],
    ["許可",     "東京都知事許可(般-28)第146157号 塗装工事業"],
    ["事業内容", "外壁・屋根塗装、防水工事、雨漏り修理、マンション改修"],
    ["対応エリア", "調布市を中心に、東京・多摩地区"]
  ],

  // --- お問い合わせの種類(フォームの選択肢) ---
  contactKinds: ["外壁・屋根の塗装", "防水工事・雨漏り", "改修・リフォーム", "その他"]

  // --- 色を変えたいときだけ(ふだんは書かない=紺×ゴールド) ---
  // , colors: { navy: "#0a1428", gold: "#c9a55c" }
};
