// pages/campus/campus.js
var locUtil = require('../../utils/getLocation.js');
var QQMap = require('../../utils/qqmap.js');
var pinyin = require('../../utils/pinyin.js');
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
    campusNameList: [],
    dynaList: [],
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
  onSelectCampus(res) {
    const name = res.currentTarget.dataset.cname;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var prePage = pages[pages.length - 2];
    app.globalData.nearCampus = name;
    this.setData({
      nearCampus: name
    })
    prePage.setData({
      nearCampus: name
    })
    wx.navigateBack({
      delta: 1
    })
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
    var lastList = [];
    if (this.data.campusNameList != []) {
      this.data.campusNameList.forEach((item, index) => {
        for (var attr in item) {
          if (item[attr].indexOf(this.data.inputVal) >= 0) {
            lastList.push({
              'index': index,
              'priority': item[attr].indexOf(this.data.inputVal)
            })
            break;
          }
        }
      })
      this.setData({
        dynaList: lastList.sort(function(a, b) {
          return a.priority - b.priority;
        })
      })
    }

  },
  // -------------------------------------------------------生命周期函数----------------------------------
  onLoad: function(options) {
    this.setData({
      campusList: app.globalData.campusList,
      nearCampus: options.nearCampus || '定位失败'
    })
    //将校区列表中简写和名称提取出来，获取拼音和字母简写，并存在campusNameList中
    if (this.data.campusList != []) {
      const cList = this.data.campusList
      var llList = cList.map(({
        name,
        ename
      }) => {
        let py = pinyin.getPinYin(name, '');
        let pyfc = pinyin.getPinYinFirstCharacter(name);
        return {
          name,
          ename,
          py,
          pyfc
        }
      });
      this.setData({
        campusNameList: llList
      })
    }
  }
})