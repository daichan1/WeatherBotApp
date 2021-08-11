// 地域リスト
const areaList = {
  1850144: {
    name: "東京",
    lat: 35.689499,
    lon: 139.691711
  },
  1848354: {
    name: "横浜",
    lat: 35.447781,
    lon: 139.642502
  }
}

// Areaクラス(地域クラス)
class Area {
  constructor(id) {
    this.id = id
    this.name = areaList[id].name
    this.lat = areaList[id].lat
    this.lon = areaList[id].lon
  }
}

export default Area