//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
const tn_data = require("../../tn_config.js")
Page({
  data: {
    motto: 'I\'m Take Now',
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    iconList: [{
        icon: 'cartfill',
        color: 'red',
        badge: 2,
        name: '待付款'
      }, {
        icon: 'recordfill',
        color: 'orange',
        badge: 1,
        name: '待接单'
      }, {
        icon: 'deliver_fill',
        color: 'orange',
        badge: 100,
        name: '待配送'
      },
      {
        icon: 'presentfill',
        color: 'orange',
        badge: 3,
        name: '待收货'
      }
    ]

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow() {
    if (app.globalData.userInfo) {
      console.log("用户信息", app.globalData.userInfo);
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      this.setData({
        istrue: true
      })
    }
  },
  openDialog: function() {
    this.setData({
      istrue: true
    })
  },
  closeDialog: function() {
    this.setData({
      istrue: false
    })
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },
  stopEvent() {},
  navToLogin() {
    this.setData({
      istrue: false
    });
    wx.navigateTo({
      url: '../../pages/login/login',
    })
  }
})