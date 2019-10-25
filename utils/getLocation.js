var app = getApp();

var QQMap = require('qqmap.js');
// 实例化API核心类
var qqmapsdk = new QQMap({
  key: 'BNIBZ-WINK5-DZUIM-QKZW6-ANGP7-UTBVX' // 开发者Key
});

// Promise获取位置信息，成功后把经纬度存在globalData，失败showToast打印错误日志
const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: "gcj02",
      success: resolve,
      fail: res => {
        console.log("地址获取失败：" + res.errMsg);
        wx.showToast({
          title: 'ERROR:' + res.errMsg,
          icon: 'none',
          duration: 2000
        })
        reject;
      }
    })
  })
}





// 根据经纬度计算与各个校区的距离
//参数分别为：经度、维度、校区经纬度列表
const calculateDistance = (res) => {
  console.log(this)
  var lat = res.latitude;
  var lon = res.longitude;
  app.globalData.latitude = lat;
  app.globalData.longitude = lon;
  var endList = app.globalData.campusList;
  console.log('lat:' + lat + 'lon:' + lon)
  // 将校区对象数组中的经纬度取出
  var llList = endList.map(({
    latitude,
    longitude
  }) => {
    return {
      latitude,
      longitude
    };
  });
  var that = this;
  //调用距离计算接口
  var QQMap = require('qqmap.js');
  // 实例化API核心类
  var qqmapsdk = new QQMap({
    key: 'BNIBZ-WINK5-DZUIM-QKZW6-ANGP7-UTBVX' // 开发者Key
  });
  qqmapsdk.calculateDistance({
    //mode: walking',
    //获取表单提交的经纬度并设置from和to参数（示例为string格式）
    from: {
      latitude: lat,
      longitude: lon
    }, //若起点有数据则采用起点坐标，若为空默认当前地址
    to: llList, //终点坐标列表
    success: res => { //成功后的回调
      var res = res.result;
      var dis = [];
      for (var i = 0; i < res.elements.length; i++) {
        dis.push(res.elements[i].distance); //将返回数据存入dis数组，
      }
      //设置并更新distance数据
      app.globalData.distance = dis;
      console.log(dis)
      if (dis != []) {
        app.globalData.nearCampus = app.globalData.campusList[indexOfSmallest(dis)].name;
        console.log("最近的校区为：" + app.globalData.nearCampus);
        wx.showToast({
          title: app.globalData.nearCampus,
          icon: 'none',
          duration: 2000
        })

      } else
        console.log("校区距离列表有误")
    },
    fail: function(error) {
      console.error(error);
    }
  });
}



//  计算返回的列表中距离最近的校区的序号
const indexOfSmallest = disList => {
  var lowest = 0;
  for (var i = 1; i < disList.length; i++) {
    if (disList[i] < disList[lowest]) lowest = i;
  }
  return lowest;
}

module.exports = {
  getLocation: getLocation,
  indexOfSmallest: indexOfSmallest,
  calculateDistance: calculateDistance
}