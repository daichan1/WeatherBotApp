const axios = require("axios");

// パラメーターの設定(天気予報API)
const cityId = 1850147;
const apiUrl = "https://samples.openweathermap.org/data/2.5/forecast";

exports.forecastData = function() {
  let resText = '';
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
    resText = "APIの実行に成功";
  })
  .catch(err => {
    resText = "APIの実行に失敗";
  })
  return resText;
}