/**
 * 塗装店デモ:問い合わせ自動受付の仕組み(合同会社ライズカラー)
 *
 * フォーム送信 → ①台帳(スプレッドシート)に記録 → ②カレンダーに現地調査を登録
 *            → ③お客様へ自動返信メール → ④親方(見本ではライズカラー)へ通知メール
 *
 * 使い方
 *   1. このコードをApps Scriptに貼り付けて保存
 *   2. 上の関数選択で「setup」を選んで実行 → 権限を許可(台帳・カレンダー・写真フォルダが作られます)
 *   3. デプロイ → 新しいデプロイ → 種類「ウェブアプリ」/ 実行ユーザー「自分」/ アクセス「全員」
 *   4. 出てきたURL(…/exec)をデモページの GAS_URL に入れる
 */

const OWNER_EMAIL = 'umemura@raisecolor.net';   // 通知先(本番では親方のアドレス)
const SHOP_NAME = '〇〇塗装';                    // お客様に見える店名
const DAILY_AUTOREPLY_LIMIT = 40;                // 自動返信メールの1日の上限(いたずら対策)
const TZ = 'Asia/Tokyo';

const KINDS = ['外壁塗装', '屋根塗装・補修', '防水工事', 'その他'];
const SLOTS = {
  '9:00〜10:00':  ['09:00', '10:00'],
  '10:30〜11:30': ['10:30', '11:30'],
  '13:00〜14:00': ['13:00', '14:00'],
  '14:30〜15:30': ['14:30', '15:30'],
  '16:00〜17:00': ['16:00', '17:00'],
};
const HEADERS = ['No.', '受付日時', 'ご相談の種類', 'お名前', '電話番号', 'メールアドレス',
                 '現地調査の希望日', '時間帯', 'ご相談内容', '写真', '対応状況', '送信元'];

/** 最初に1回だけ実行:台帳・カレンダー・写真フォルダを作る */
function setup() {
  const p = PropertiesService.getScriptProperties();

  if (!p.getProperty('SHEET_ID')) {
    const ss = SpreadsheetApp.create('【デモ】問い合わせ管理台帳');
    ss.setSpreadsheetTimeZone(TZ);
    const sh = ss.getSheets()[0];
    sh.setName('問い合わせ一覧');
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      .setFontWeight('bold').setBackground('#1b5f94').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    [50, 130, 100, 110, 120, 200, 110, 110, 260, 90, 90, 80].forEach((w, i) => sh.setColumnWidth(i + 1, w));
    sh.getRange('K2:K1000').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['未対応', '連絡済み', '現地調査済み', '見積り提出', '受注', '失注']).build());
    p.setProperty('SHEET_ID', ss.getId());
  }

  if (!p.getProperty('CAL_ID')) {
    const cal = CalendarApp.createCalendar('【デモ】現地調査', { color: CalendarApp.Color.BLUE, timeZone: TZ });
    p.setProperty('CAL_ID', cal.getId());
  }

  if (!p.getProperty('FOLDER_ID')) {
    const folder = DriveApp.createFolder('【デモ】お客様からの写真');
    p.setProperty('FOLDER_ID', folder.getId());
  }

  MailApp.getRemainingDailyQuota(); // メール送信の権限確認用

  Logger.log('台帳:   ' + SpreadsheetApp.openById(p.getProperty('SHEET_ID')).getUrl());
  Logger.log('カレンダー: ' + p.getProperty('CAL_ID'));
  Logger.log('写真フォルダ: ' + DriveApp.getFolderById(p.getProperty('FOLDER_ID')).getUrl());
}

/** 動作確認用(ブラウザでURLを開くと ok が返る) */
function doGet() {
  return json_({ ok: true, service: 'demo-intake' });
}

/** フォームからの送信を受け付ける */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return json_({ ok: true }); // ロボット対策(見えない欄に入力があれば無視)

    const v = validate_(d);
    if (v.error) return json_({ ok: false, error: v.error });

    const p = PropertiesService.getScriptProperties();
    const sh = SpreadsheetApp.openById(p.getProperty('SHEET_ID')).getSheetByName('問い合わせ一覧');
    const cal = CalendarApp.getCalendarById(p.getProperty('CAL_ID'));
    const no = Math.max(sh.getLastRow(), 1); // 見出しが1行目なので、1件目は No.1
    const now = new Date();

    // 写真(任意)
    let photoUrl = '';
    if (v.photo) {
      const blob = Utilities.newBlob(Utilities.base64Decode(v.photo.data), v.photo.type,
        'No' + no + '_' + v.name + '.jpg');
      photoUrl = DriveApp.getFolderById(p.getProperty('FOLDER_ID')).createFile(blob).getUrl();
    }

    // ① 台帳に記録
    sh.appendRow([no, now, v.kind, v.name, v.phone, v.email, v.date, v.slot, v.message,
                  photoUrl ? '=HYPERLINK("' + photoUrl + '","写真を見る")' : 'なし', '未対応', v.ref || '直接']);
    sh.getRange(sh.getLastRow(), 2).setNumberFormat('yyyy/MM/dd HH:mm');

    // ② カレンダーに現地調査を登録
    const [s, t] = SLOTS[v.slot];
    const start = new Date(v.date + 'T' + s + ':00+09:00');
    const end = new Date(v.date + 'T' + t + ':00+09:00');
    cal.createEvent('現地調査 ' + v.name + '様', start, end, {
      description: [
        'ご相談:' + v.kind,
        '電話:' + (v.phone || '未入力'),
        'メール:' + v.email,
        '内容:' + (v.message || 'なし'),
        photoUrl ? '写真:' + photoUrl : '',
        '台帳 No.' + no,
      ].filter(Boolean).join('\n'),
    });

    const dateLabel = Utilities.formatDate(start, TZ, 'M月d日') + '(' + '日月火水木金土'[Number(Utilities.formatDate(start, TZ, 'u')) % 7] + ')';

    // ③ お客様への自動返信(1日の上限つき)
    let autoReply = false;
    const key = 'mail_' + Utilities.formatDate(now, TZ, 'yyyyMMdd');
    const sent = Number(p.getProperty(key) || 0);
    if (sent < DAILY_AUTOREPLY_LIMIT) {
      MailApp.sendEmail({
        to: v.email,
        name: SHOP_NAME + '(見本)',
        replyTo: OWNER_EMAIL,
        subject: '【' + SHOP_NAME + '】無料診断のお申し込みを受け付けました',
        body: [
          v.name + '様',
          '',
          'このたびは' + SHOP_NAME + 'にお問い合わせいただき、ありがとうございます。',
          '以下の内容で受け付けました。担当者より2営業日以内にご連絡いたします。',
          '',
          '■ご相談の種類:' + v.kind,
          '■現地調査のご希望:' + dateLabel + ' ' + v.slot,
          '■お電話番号:' + (v.phone || '未入力'),
          '■ご相談内容:' + (v.message || 'なし'),
          '■写真:' + (photoUrl ? '1枚お預かりしました' : 'なし'),
          '',
          '――――――――――――――――――',
          '※このメールは、合同会社ライズカラーの見本ページ(塗装店の問い合わせ自動受付デモ)から自動で送られています。',
          '　実際のホームページでは、貴社の店名・文面でお客様に届きます。',
          '　ご不明な点は、このメールにそのままご返信ください。',
        ].join('\n'),
      });
      p.setProperty(key, String(sent + 1));
      autoReply = true;
    }

    // ④ 親方(見本ではライズカラー)への通知
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      name: 'デモ受付通知',
      subject: '【新しいお問い合わせ】' + v.name + '様 / ' + dateLabel + ' ' + v.slot + '(送信元:' + (v.ref || '直接') + ')',
      body: [
        '見本ページのフォームから、お問い合わせが入りました。',
        '',
        '台帳 No.' + no,
        'お名前:' + v.name,
        'ご相談:' + v.kind,
        '電話:' + (v.phone || '未入力'),
        'メール:' + v.email,
        '現地調査の希望:' + dateLabel + ' ' + v.slot,
        '内容:' + (v.message || 'なし'),
        '写真:' + (photoUrl || 'なし'),
        '送信元:' + (v.ref || '直接'),
        '自動返信:' + (autoReply ? '送信済み' : '本日の上限のため未送信'),
        '',
        '台帳:' + SpreadsheetApp.openById(p.getProperty('SHEET_ID')).getUrl(),
      ].join('\n'),
    });

    return json_({
      ok: true,
      no: no,
      receivedAt: Utilities.formatDate(now, TZ, 'yyyy/MM/dd HH:mm'),
      kind: v.kind,
      name: v.name,
      phone: v.phone,
      date: v.date,
      dateLabel: dateLabel,
      slot: v.slot,
      message: v.message,
      photo: !!photoUrl,
      autoReply: autoReply,
    });
  } catch (err) {
    return json_({ ok: false, error: '受付でエラーが起きました。時間をおいてお試しください。' });
  } finally {
    lock.releaseLock();
  }
}

function validate_(d) {
  const str = (x, max) => String(x == null ? '' : x).trim().slice(0, max);
  const v = {
    kind: KINDS.indexOf(d.kind) >= 0 ? d.kind : 'その他',
    name: str(d.name, 40),
    email: str(d.email, 120),
    phone: str(d.phone, 20).replace(/[^\d\-+() ]/g, ''),
    date: str(d.date, 10),
    slot: str(d.slot, 20),
    message: str(d.message, 1000),
    ref: str(d.ref, 20).replace(/[^\w\-]/g, ''),
    photo: null,
  };
  if (!v.name) return { error: 'お名前を入力してください。' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return { error: 'メールアドレスをご確認ください。' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date)) return { error: '現地調査のご希望日を選んでください。' };
  const day = new Date(v.date + 'T00:00:00+09:00');
  const today = new Date(Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd') + 'T00:00:00+09:00');
  const diff = (day - today) / 86400000;
  if (!(diff >= 1 && diff <= 60)) return { error: 'ご希望日は、明日から60日以内でお選びください。' };
  if (!SLOTS[v.slot]) return { error: 'ご希望の時間帯を選んでください。' };
  if (d.photo && d.photo.data) {
    const type = String(d.photo.type || '');
    if (!/^image\/(jpeg|png|webp)$/.test(type)) return { error: '写真はJPEG・PNGでお送りください。' };
    if (String(d.photo.data).length > 4000000) return { error: '写真のサイズが大きすぎます。' };
    v.photo = { type: type, data: String(d.photo.data) };
  }
  return v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
