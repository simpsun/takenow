// pages/campus/campus.js
var locUtil = require('../../utils/getLocation.js');
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

    campusList: []

  },

  showModal: function(t) {
    this.setData({
      modalName: t.currentTarget.dataset.target,
      addressIndex: t.currentTarget.dataset.id
    });
  },
  hideModal: function(t) {
    this.setData({
      modalName: null
    });
  },
  onSelectCampus(res){
    const name=res.currentTarget.dataset.cname;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var prePage = pages[pages.length - 2];
    app.globalData.nearCampus=name;
    this.setData({
      nearCampus:name
    })
    prePage.setData({
      nearCampus: name
    })
    wx.navigateBack({
      delta: 1
    })
  },

  // -------------------------------------------------------生命周期函数----------------------------------
  onLoad: function(options) {

    this.setData({
      campusList: app.globalData.campusList,
      nearCampus:options.nearCampus||'定位失败'
    })
   
  }
})