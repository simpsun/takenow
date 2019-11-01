var QQMap = require('/utils/qqmap.js');
var util = require('utils/util.js');

// 实例化API核心类
var qqmapsdk = new QQMap({
  key: 'BNIBZ-WINK5-DZUIM-QKZW6-ANGP7-UTBVX' // 开发者Key
});

App({
  onLaunch: function() {
// 初始化云服务
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'takenow-666',
        traceUser: true,
      })
    }
    const db = wx.cloud.database();

  
    // 获取OpenId
   wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      return new Promise((resolve, reject) => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid;
        resolve(res.result.openid);
      })
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err);
    }).then(res => {
      db.collection('tn_user').where({
        _openid: res // 填入当前用户openid
      }).get().then(res => {
        if (res.data.length > 0) {
          console.log("已存在用户", res)
          this.globalData.userInfo = res.data[0]
        } else {
          console.log("未授权用户，需要用户手动授权")
        }
      })
    });


    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.onGetUserInfo();
    db.collection('tn_campus_list').get().then(res => {
      return new Promise((resolve, reject) => {
        console.log("学校列表", res);
        this.globalData.campusList = res.data.map(({
          id,
          name,
          ename,
          location
        }) => {
          return {
            id,
            name,
            ename,
            location
          };
        });
        resolve();
      })
    }).then(() => {
      return this.getLocation()
    }).then(res => {
      return this.calculateDistance(res)
    })
  },


  getLocation() {
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
  },

  onGetUserInfo() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  calculateDistance(res) {

    var lat = res.latitude;
    var lon = res.longitude;
    this.globalData.latitude = lat;
    this.globalData.longitude = lon;
    var endList = this.globalData.campusList;
    console.log('lat:' + lat + 'lon:' + lon)
    // 将校区对象数组中的经纬度取出
    var llList = endList.map(({
      location
    }) => {
      return {
        longitude: location.longitude,
        latitude: location.latitude
      };
    });
    console.log("校区经纬度表:", llList)
    var that = this;
    //调用距离计算接口
    // 实例化API核心类

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
        this.globalData.distance = dis;

        if (dis != []) {
          this.globalData.nearCampus = this.globalData.campusList[this.indexOfSmallest(dis)].name;
          console.log("最近的校区为：" + this.globalData.nearCampus);
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(this.globalData.nearCampus)
          }
          wx.showToast({
            title: this.globalData.nearCampus,
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
  },
  indexOfSmallest(disList) {
    var lowest = 0;
    for (var i = 1; i < disList.length; i++) {
      if (disList[i] < disList[lowest]) lowest = i;
    }
    return lowest;
  },
  globalData: {
    userInfo: {},
    openid: null,
    distance: [],
    /*计算所得的当前经纬度与各个校区距离列表*/
    locationAuthorized: null,
    locationEnabled: null,
    userInfo: null,
    defaultAddress: [],
    latitude: null,
    longitude: null,
    isLocation: 0,
    nearCampus: '定位失败',
    campusList: []

  },

})

// // 获取系统状态栏信息
// wx.getSystemInfo({
//   success: e => {
//     this.globalData.StatusBar = e.statusBarHeight;
//     let custom = wx.getMenuButtonBoundingClientRect();
//     this.globalData.locationAuthorized = e.locationAuthorized || null,
//       this.globalData.locationEnabled = e.locationEnabled || null
//   }
// })
// {
//   id: 0,
//     name: "天津师范大学",
//       ename: 'tjnu',
//         latitude: 39.0651812870,
//           longitude: 117.1239566803
// }, {
//   id: 1,
//     name: "清华大学",
//       ename: 'tsinghua',
//         latitude: 40.0033480000,
//           longitude: 116.3261920000
// }, {
//   id: 2,
//     name: "天津工业大学",
//       ename: 'tjnu',
//         latitude: 39.0661142615,
//           longitude: 117.1075630188
// }, {
//   id: 3,
//     name: "天津理工大学",
//       ename: 'tjnu',
//         latitude: 39.0606960000,
//           longitude: 117.1420980000
// }