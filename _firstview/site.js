/* ============================================================
   会社ごとに書き換えるのは、このファイルだけです。
   (index.html は共通の型なので触りません)
   下は昭研工業さん(武蔵野市)の記入例です。
   ============================================================ */
window.SITE = {

  // --- ページの情報 ---
  title: "昭研工業株式会社｜武蔵野市・小平市の外壁塗装・屋根塗装・防水工事",
  description: "東京都武蔵野市・小平市の外壁塗装、屋根塗装、雨漏り修理、防水工事なら昭和49年創業の昭研工業株式会社へ。",

  // 一番上の細い帯(営業先に「ご提案用デモ」と伝える一文。不要なら "" に)
  ribbon: "",
  topNote: "東京都武蔵野市・小平市の外壁塗装、屋根塗装、雨漏り修理、防水工事",

  // --- 会社 ---
  company: "昭研工業株式会社",
  companyEn: "SHOKEN KOGYO",
  logo: "https://shouken-kougyou.com/files/libs/217/202305111043425552.jpg", // なければ ""
  tel: "0422-32-5821",
  telNote: "お気軽にお電話ください",

  // --- メニュー(上のナビ) ---
  nav: [
    { label: "トップ",       href: "index.html", current: true },
    { label: "ごあいさつ",   href: "about.html" },
    { label: "工事の内容",   href: "service.html" },
    { label: "施工事例",     href: "works.html" },
    { label: "会社案内",     href: "company.html" },
    { label: "お問い合わせ", href: "contact.html" }
  ],

  // --- ファーストビューの文字 ---
  since: "昭和49年創業｜武蔵野市",
  // 3行。2行目がゴールドで目立つ行です
  catch: ["この街の建物を、", "親切で丁寧に", "守りつづけて半世紀。"],
  lead: "外壁・屋根の塗り替えから、雨漏り修理、防水工事、マンションの大規模修繕まで。訪問してのお見積りにも伺います。",
  buttons: {
    main: { label: "無料でお見積りを相談する", href: "contact.html" },
    sub:  { label: "施工事例を見る",           href: "works.html" }
  },

  // --- 右半分に切り替わる写真(3枚がおすすめ。2〜5枚まで可) ---
  slides: [
    { img: "https://shouken-kougyou.com/files/libs/106/202110010854043039.JPG", tag: "施工事例",   caption: "分譲マンション｜武蔵野市" },
    { img: "https://shouken-kougyou.com/files/libs/120/202110010854215126.jpg", tag: "施工事例",   caption: "武蔵野市公会堂｜武蔵野市" },
    { img: "https://shouken-kougyou.com/files/libs/124/202110010854268574.JPG", tag: "工事の様子", caption: "外壁の塗り替え工事" }
  ],

  // --- 大きな数字の帯(4つ。数字はカウントアップします) ---
  // ※料金・値段はカウントアップさせないので、ここには入れないでください
  facts: [
    { num: 52, unit: "年",   label: "創業から(昭和49年)" },
    { num: 53, unit: "名",   label: "社員・スタッフ" },
    { num: 3,  unit: "拠点", label: "武蔵野市・小平市" },
    { num: 35, unit: "回",   label: "職人さんの褒章式" }
  ]

  // --- 色を変えたいときだけ(ふだんは書かない=紺×ゴールド) ---
  // , colors: { base: "#0b1322", band: "#0f1a2d", accent: "#c9a55c", accentHover: "#e2c385" }
};
