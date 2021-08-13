// 天気関連の処理
module.exports.responseMessage = (daily_data) => {
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