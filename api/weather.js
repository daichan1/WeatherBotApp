const axios = require("axios");
const weather = require("../settings/weather");

exports.forecastData = function() {
  let resText = '';
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
    resText = "APIの実行に成功";
  })
  .catch(err => {
    resText = "APIの実行に失敗";
  })
  return resText;
}