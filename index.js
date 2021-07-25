// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk");
const axios = require("axios");

// パラメーターの設定(LINE)
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

// 天気予報APIのパラメーター
const lat = 35.689499
const lon = 139.691711
const apiUrl = "https://api.openweathermap.org/data/2.5/onecall";

// Webサーバーの設定
server.listen(process.env.PORT || 3000);

const bot = new line.Client(line_config);

// ルーターの設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
  res.sendStatus(200);
  let events_processed = [];
  // イベントオブジェクトを順次処理
  req.body.events.forEach((event) => {
    if(event.type == 'message' && event.message.type == 'text') {
      if(event.message.text == '週間予報'){
        axios.get(apiUrl, {
          params: {
            lat: lat,
            lon: lon,
            lang: "ja",
            appid: process.env.OPEN_WEATHER_API_APPID
          },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          responseType: 'json'
        })
        .then(res => {
          // 返信内容を設定してユーザーに送信
          let week_weather = ""
          // for(i = 0; i < res.daily.length; i++) {
            // let one_day_weather = `
            //   日付：${res.daily[i].dt}
            //   天気：${res.daily[i].weather[0].main}
            //   最高気温：${res.daily[i].temp.max}
            //   最低気温：${res.daily[i].temp.min}
            //   降水確率：${res.daily[i].pop}
            //   ¥n
            //   `
            //   week_weather += one_day_weather
          // }
          events_processed.push(bot.replyMessage(event.replyToken, {
            type: 'text',
            text: "test"
          }))
          
        })
        .catch(err => {
          // エラーメッセージを設定してユーザーに送信
          events_processed.push(bot.replyMessage(event.replyToken, {
            type: 'text',
            text: 'APIの実行に失敗'
          }))
        })
      }
    }
  });
  // 全てのイベント処理が終了したら何個のイベントが処理されたかをログに出力
  Promise.all(events_processed).then(
    (response) => {
      console.log(`${response.length} event(s) processed`);
    }
  )
});