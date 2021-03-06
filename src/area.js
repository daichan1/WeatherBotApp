// 地域ID
const tokyoAreaId = 1850144
const yokohamaAreaId = 1848354
const kawasakiAreaId = 1859642

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
  },
  1859642: {
    name: "川崎",
    lat: 35.520561,
    lon: 139.717224
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

  replyMessage() {
    const result = {
      type: 'text',
      text: `天気予報表示地域を${this.name}に設定しました`
    }
    return result
  }
}

function setAreaReplyMessage() {
  const result = {
    type: "template",
    altText: "地域設定",
    template: {
        type: "buttons",
        title: "地域設定",
        text: "天気予報を表示したい地域を選択してください",
        actions: [
            {
              type: "message",
              label: "東京",
              text: "東京"
            },
            {
              type: "message",
              label: "横浜",
              text: "横浜"
            },
            {
              type: "message",
              label: "川崎",
              text: "川崎"
            }
        ]
    }
  }
  return result
}

module.exports = {
  Area: Area,
  setAreaReplyMessage: setAreaReplyMessage,
  tokyoAreaId: tokyoAreaId,
  yokohamaAreaId: yokohamaAreaId,
  kawasakiAreaId: kawasakiAreaId
}