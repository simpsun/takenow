// pages/campus/campus.js

var QQMap = require('../../utils/qqmap.js');
var app = getApp();
// 实例化API核心类
var qqmapsdk = new QQMap({
  key: 'BNIBZ-WINK5-DZUIM-QKZW6-ANGP7-UTBVX' // 开发者Key
});
Page({

  /**
   * 页面的初始数据
   */


  data: {
    distance: [],
    latitude: 39.0620900000,
    longitude: 117.1270600000,
    nearCampus: "未定位",
    campusList: [{
      id: 0,
      name: "天津师范大学",
      ename: 'tjnu',
      latitude: 39.0620900000,
      longitude: 117.1270600000
    }, {
      id: 1,
      name: "清华大学",
      ename: 'tsinghua',
      latitude: 40.0033480000,
      longitude: 116.3261920000
    }, {
      id: 2,
      name: "天津工业大学",
      ename: 'tjnu',
      latitude: 39.0655200000,
      longitude: 117.1141500000
    }, {
      id: 3,
      name: "天津理工大学",
      ename: 'tjnu',
      latitude: 39.0606960000,
      longitude: 117.1420980000
    }]
  },





  indexOfSmallest(a) {
    var lowest = 0;
    for (var i = 1; i < a.length; i++) {
      if (a[i] < a[lowest]) lowest = i;
    }
    return lowest;
  },
  //在Page({})中使用下列代码
  //事件触发，调用接口
  calculateDistance(lat, lon, endList) {
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
    qqmapsdk.calculateDistance({
      //mode: walking',
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: {
        latitude: lat,
        longitude: lon
      }, //若起点有数据则采用起点坐标，若为空默认当前地址
      to: llList, //终点坐标
      success: function(res) { //成功后的回调
        var res = res.result;
        var dis = [];
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
        }
        that.setData({ //设置并更新distance数据
          distance: dis
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  showModal: function (t) {
    this.setData({
      modalName: t.currentTarget.dataset.target,
      addressIndex: t.currentTarget.dataset.id
    });
  },
  hideModal: function (t) {
    this.setData({
      modalName: null
    });
  },
  getLocation: function (t) {
    this.setData({
      modalName: null
    });
    var that = this;
    if (t.detail.authSetting["scope.userLocation"]) {
      app.globalData.isLocation=1;
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          app.globalData.latitude = res.latitude,
          app.globalData.longitude = res.longitude;
          console.log("经纬度:" + app.globalData.latitude + "," + app.globalData.longitude);
        }
      })
    } else {
      that.setData({
        isLocation: 0
      });
    }
  },
  reGetLocation(){

    this.onReady();
  },
  // -------------------------------------------------------生命周期函数----------------------------------
  onReady: function() {
    if (app.globalData.nearCampus == "") {
      if (app.globalData.isLocation) {
        const lat = app.globalData.latitude;
        const lon = app.globalData.longitude;
        this.calculateDistance(lat, lon, this.data.campusList);
        if (this.data.distance != []) {
          var index = this.indexOfSmallest(this.data.distance);
          console.log("最近的学校是:" + this.data.campusList[index].name)
          const nearCampus = this.data.campusList[index].name;
          app.globalData.nearCampus = nearCampus;
          this.setData({
            nearCampus: nearCampus
          })
        }
      } else {
        wx.getSetting({
          success: res=> {
            if (!res.authSetting['scope.userLocation']) {
              console.log("-------------不满足scope.userLocation权限----------");
              //申请授权
              this.setData({
                modalName:'DialogModal'
              })
            }
          }
        })
      }
    } else {
      this.setData({
        nearCampus: app.globalData.nearCampus
      })
    }
  }


})