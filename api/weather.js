const axios = require("axios");
const weather = require("../settings/weather");

exports.forecastData = function() {
  axios.get(weather.apiUrl, {
    params: {
      id: weather.cityId,
      appid: process.env.OPEN_WEATHER_API_APPID
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    responseType: 'json'
  })
  .then(res => {
    return "APIの実行に成功";
  })
  .catch(err => {
    return "APIの実行に失敗"
  })
}