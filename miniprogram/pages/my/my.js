//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
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

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }

  },

  onGetUserInfo: function(e) {

    if (e.detail.userInfo) {
      const db = wx.cloud.database();
      var DATE = util.formatTime(new Date());
      let tnUserInfo = {
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        gender: e.detail.userInfo.gender,
        province: e.detail.userInfo.province,
        city: e.detail.userInfo.city,
        country: e.detail.userInfo.country,
        create_data: DATE,
        phone: ''
      }
      console.log("用户授权信息成功：", tnUserInfo);
      this.setData({
        userInfo: tnUserInfo
      })
      db.collection('tn_user').add({
        // data 字段表示需新增的 JSON 数据
        data: tnUserInfo
      }).then(res => {
        console.log("数据库添加用户成功")
      }).catch(res => {
        console.log("数据库添加数据失败")
      })
      app.globalData.userInfo = tnUserInfo;
    } else {
      console.log("用户拒绝授权")
    }
  }



})

// queryUserInfo() {
//   return new Promise((resolve, reject) => {
//     const db = wx.cloud.database()
//     // 查询当前用户的信息
//     db.collection('counters').where({
//       _openid: this.data.openid
//     }).get({
//       success: res => {
//         this.setData({
//           queryResult: JSON.stringify(res.data, null, 2)
//         })
//         console.log('[数据库] [查询记录] 成功: ', res)
//       },
//       fail: err => {
//         wx.showToast({
//           icon: 'none',
//           title: '查询记录失败'
//         })
//         console.error('[数据库] [查询记录] 失败：', err)
//       }
//     })
//   })
// },