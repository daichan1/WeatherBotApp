// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk");
const axios = require("axios");
import Area from "./src/area"

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
      if(event.message.text == 1) {
        let tokyo = new Area(1850144)
        const testStr = `${tokyo.id}\n${tokyo.name}\n${tokyo.lat}\n${tokyo.lon}`
        events_processed.push(bot.replyMessage(event.replyToken, {
          type: 'text',
          text: testStr
        }))
      }
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
          for(i = 0; i < res.data.daily.length; i++) {
            if(i < res.data.daily.length - 1) {
              week_weather += responseMessage(res.data.daily[i]) + "\n\n"
            } else {
              week_weather += responseMessage(res.data.daily[i])
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

function responseMessage(daily_data) {
  return `${unixtimeToDate(daily_data.dt)} ${getWeatherEmoji(daily_data.weather[0].main)}
最高気温：${kelvinToCelsius(daily_data.temp.max)}度
最低気温：${kelvinToCelsius(daily_data.temp.min)}度
降水確率：${daily_data.pop * 100}%`
}

// unix時間の変換
function unixtimeToDate(unixtime) {
  let date = new Date(unixtime * 1000)
  return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`
}

// 気温の変換
function kelvinToCelsius(kelvin) {
  const kelvinDegree = 273.15
  return Math.floor(kelvin - kelvinDegree)
}

// 天気の絵文字を取得
function getWeatherEmoji(main) {
  let result = ""
  const emojiList = {
    "Clear": "\uDBC0\uDCA9",
    "Clouds": "\uDBC0\uDCAC",
    "Rain": "\uDBC0\uDCAA",
    "Snow": "\uDBC0\uDCAB"
  }
  if (emojiList[main] != null) {
    result = emojiList[main]
  }
  return result
}