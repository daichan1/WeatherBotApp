// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk");
const areaModule = require("./src/area")
const weatherModule = require("./src/weather")

// パラメーターの設定(LINE)
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

// 天気予報表示設定地域
let selectArea = null

// Webサーバーの設定
server.listen(process.env.PORT || 3000);

const bot = new line.Client(line_config);

// ルーターの設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
  res.sendStatus(200)
  let events_processed = []
  // イベントオブジェクトを順次処理
  req.body.events.forEach((event) => {
    if(event.type == 'message' && event.message.type == 'text') {
      switch(event.message.text) {
        case "東京":
          selectArea = new areaModule.Area(areaModule.tokyoAreaId)
          events_processed.push(bot.replyMessage(event.replyToken, selectArea.replyMessage()))
          break
        case "横浜":
          selectArea = new areaModule.Area(areaModule.yokohamaAreaId)
          events_processed.push(bot.replyMessage(event.replyToken, selectArea.replyMessage()))
          break
        case "川崎":
          selectArea = new areaModule.Area(areaModule.kawasakiAreaId)
          events_processed.push(bot.replyMessage(event.replyToken, selectArea.replyMessage()))
          break
        case "地域設定":
          events_processed.push(bot.replyMessage(event.replyToken, areaModule.setAreaReplyMessage()))
          break
        case "今日の天気":
          events_processed.push(bot.replyMessage(event.replyToken, weatherModule.fetchDayWeather(selectArea, event.message.text)))
          break
        case "明日の天気":
          events_processed.push(bot.replyMessage(event.replyToken, weatherModule.fetchDayWeather(selectArea, event.message.text)))
          break
        case "週間予報":
          events_processed.push(bot.replyMessage(event.replyToken, weatherModule.fetchWeekWeather(selectArea)))
          break
        default:
      }
    }
  });
  // 全てのイベント処理が終了したら何個のイベントが処理されたかをログに出力
  Promise
    .all(events_processed)
    .then((response) => {
      console.log(`${response.length} event(s) processed`);
    })
    .catch((err) => {
      console.log(err)
    })
});