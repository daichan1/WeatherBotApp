// 天気関連の処理
const axios = require("axios");

// 初期座標(東京)
const defaultLat = 35.689499
const defaultLon = 139.691711
// 天気予報APIのURL
const apiUrl = "https://api.openweathermap.org/data/2.5/onecall";

module.exports.fetchDayWeather = (selectArea, message) => {
  let replyMessage = {}
  const res = axios.get(apiUrl, {
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
  res.then((res) => {
    let dayWeatherForecast = selectArea == null ? "東京の天気\n" : `${selectArea.name}の天気\n`
    if(message == "今日の天気") {
      dayWeatherForecast += responseMessage(res.data.daily[0])
    } else if(message == "明日の天気") {
      dayWeatherForecast += responseMessage(res.data.daily[1])
    }
    replyMessage = {
      type: 'text',
      text: dayWeatherForecast
    }
  })
  res.catch((err) => {
    console.log(err)
  })
  return replyMessage
}

module.exports.fetchWeekWeather = (selectArea) => {
  let replyMessage = {}
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
    let weekWeatherForecast = selectArea == null ? "東京の天気\n" : `${selectArea.name}の天気\n`
    for(i = 0; i < res.data.daily.length; i++) {
      if(i < res.data.daily.length - 1) {
        weekWeatherForecast += responseMessage(res.data.daily[i]) + "\n\n"
      } else {
        weekWeatherForecast += responseMessage(res.data.daily[i])
      }
    }
    replyMessage = {
      type: 'text',
      text: weekWeatherForecast
    }
  })
  .catch(err => {
    replyMessage = {
      type: 'text',
      text: "エラー発生"
    }
  })
  return replyMessage
}

function responseMessage(daily_data) {
  return `${unixtimeToDate(daily_data.dt)} ${getWeatherEmoji(daily_data.weather[0].main)}
最高気温：${kelvinToCelsius(daily_data.temp.max)}度
最低気温：${kelvinToCelsius(daily_data.temp.min)}度
降水確率：${Math.floor(daily_data.pop * 100)}%`
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