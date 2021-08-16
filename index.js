// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk");
const axios = require("axios");
const areaModule = require("./src/area")
const weatherModule = require("./src/weather")

// パラメーターの設定(LINE)
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

// 初期座標(東京)
const defaultLat = 35.689499
const defaultLon = 139.691711
// 天気予報APIのURL
const apiUrl = "https://api.openweathermap.org/data/2.5/onecall";

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
          events_processed.push(bot.replyMessage(event.replyToken, {
            type: 'text',
            text: `天気予報表示地域を${selectArea.name}に設定しました`
          }))
          break
        case "横浜":
          selectArea = new areaModule.Area(areaModule.yokohamaAreaId)
          events_processed.push(bot.replyMessage(event.replyToken, {
            type: 'text',
            text: `天気予報表示地域を${selectArea.name}に設定しました`
          }))
          break
        case "川崎":
          selectArea = new areaModule.Area(areaModule.kawasakiAreaId)
          events_processed.push(bot.replyMessage(event.replyToken, {
            type: 'text',
            text: `天気予報表示地域を${selectArea.name}に設定しました`
          }))
          break
        case "地域設定":
          events_processed.push(bot.replyMessage(event.replyToken, {
            "type":"message",
            "label":"hello",
            "text":"hello",
            "area":{
                "x":520,
                "y":0,
                "width":520,
                "height":1040
            }
          }))
          break
        case "今日の天気":
          axios.get(apiUrl, {
            params: {
              lat: selectArea == null ? defaultLat : selectArea.lat,
              lon: selectArea == null ? defaultLon : selectArea.lon,
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
            let today_weather = selectArea == null ? "東京の天気\n" : `${selectArea.name}の天気\n`
            today_weather += weatherModule.responseMessage(res.data.daily[0])
            events_processed.push(bot.replyMessage(event.replyToken, {
              type: 'text',
              text: today_weather
            }))
          })
          .catch(err => {
            // エラーメッセージを設定してユーザーに送信
            events_processed.push(bot.replyMessage(event.replyToken, {
              type: 'text',
              text: '今日の天気の取得に失敗'
            }))
          })
          break
        case "明日の天気":
          axios.get(apiUrl, {
            params: {
              lat: selectArea == null ? defaultLat : selectArea.lat,
              lon: selectArea == null ? defaultLon : selectArea.lon,
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
            let tomorrow_weather = selectArea == null ? "東京の天気\n" : `${selectArea.name}の天気\n`
            tomorrow_weather += weatherModule.responseMessage(res.data.daily[1])
            events_processed.push(bot.replyMessage(event.replyToken, {
              type: 'text',
              text: tomorrow_weather
            }))
          })
          .catch(err => {
            // エラーメッセージを設定してユーザーに送信
            events_processed.push(bot.replyMessage(event.replyToken, {
              type: 'text',
              text: '今日の天気の取得に失敗'
            }))
          })
          break
        case "週間予報":
          axios.get(apiUrl, {
            params: {
              lat: selectArea == null ? defaultLat : selectArea.lat,
              lon: selectArea == null ? defaultLon : selectArea.lon,
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
            let week_weather = selectArea == null ? "東京の天気\n" : `${selectArea.name}の天気\n`
            for(i = 0; i < res.data.daily.length; i++) {
              if(i < res.data.daily.length - 1) {
                week_weather += weatherModule.responseMessage(res.data.daily[i]) + "\n\n"
              } else {
                week_weather += weatherModule.responseMessage(res.data.daily[i])
              }
            }
            events_processed.push(bot.replyMessage(event.replyToken, {
              type: 'text',
              text: week_weather
            }))
          })
          .catch(err => {
            // エラーメッセージを設定してユーザーに送信
            events_processed.push(bot.replyMessage(event.replyToken, {
              type: 'text',
              text: 'APIの実行に失敗'
            }))
          })
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