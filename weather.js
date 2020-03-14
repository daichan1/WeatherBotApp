const axios = require("axios");
const weatherApi = require("./settings/weatherApi");

exports.fetchForecastData = function() {
  let resText = '';
  axios.get(weatherApi.apiUrl, {
    params: {
      id: weatherApi.cityId,
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