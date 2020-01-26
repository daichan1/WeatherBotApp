// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIをインポート

// パラメーターの設定
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンを設定
  channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretを設定
};

// Webサーバーの設定
server.listen(process.env.PORT || 3000);

// ルーターの設定
server.post('bot/webhook', line.middleware(line_config), (req, res, next) => {
  res.sendStatus(200);
  console.log(rew.body);
});