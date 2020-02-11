// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIをインポート
const weather = require("./api/weather");
const axios = require("axios");

// パラメーターの設定(LINE)
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンを設定
  channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretを設定
};

// パラメーターの設定(天気予報API)
const cityId = 1850147;
const apiUrl = "https://samples.openweathermap.org/data/2.5/forecast";

// Webサーバーの設定
server.listen(process.env.PORT || 3000);

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// ルーターの設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
  // 先行してLINE側に200を送る
  res.sendStatus(200);
  // 全てのイベント処理のプロミスを格納する配列
  let events_processed = [];
  // イベントオブジェクトを順次処理
  req.body.events.forEach((event) => {
    //イベントのタイプがメッセージかつテキストだったら
    if(event.type == 'message' && event.message.type == 'text') {
      if(event.message.text == 'こんにちは'){
        // const resData = weather.forecastData();
        axios.get(apiUrl, {
          params: {
            id: cityId,
            appid: process.env.OPEN_WEATHER_API_APPID
          },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          responseType: 'json'
        })
        .then(res => {
          // replyMessage()で返信し、そのプロミスをevents_processedに追加。
          events_processed.push(bot.replyMessage(event.replyToken, {
            type: 'text',
            text: "APIの実行に成功"
          }))
        })
        .catch(err => {
          // replyMessage()で返信し、そのプロミスをevents_processedに追加。
          events_processed.push(bot.replyMessage(event.replyToken, {
            type: 'text',
            text: "APIの実行に失敗"
          }))
        })
        // // replyMessage()で返信し、そのプロミスをevents_processedに追加。
        // events_processed.push(bot.replyMessage(event.replyToken, {
        //   type: 'text',
        //   text: resData
        // }))
      }
    }
  });
  // 全てのイベント処理が終了したら何個のイベントが処理されたかを出力
  Promise.all(events_processed).then(
    (response) => {
      console.log(`${response.length} event(s) processed`);
    }
  )
});