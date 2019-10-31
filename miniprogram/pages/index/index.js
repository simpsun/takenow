// pages/newindex.js
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    demandInfo: "",
    nearCampus: '',
    ColorList: ['放楼下就行', '999感冒颗粒', '尽快送达', '配送注意安全', '谢谢', '煎饼果子'],
    funcList: ['帮我买', '帮我送', '领包裹', '全能超人'],
    funcImgSrc: '../../images/index/func',
    location:0
  },

  // -------- 事件响应函数--------

  // 切换功能
  selectFunc(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      location: index
    })
  },
  // 校区选择
  onCampusSelect() {
    wx.navigateTo({
      url: `../campus/campus?nearCampus=${this.data.nearCampus}`,
    })
  },
  // 快捷标签输入
  quickTag(e) {
    console.log(e);
    const tag = e.currentTarget.dataset.text;
    this.setData({
      demandInfo: this.data.demandInfo + " " + tag
    })
  },
  // 文本框输入监听
  demandInfoInput(e) {
    const value = e.detail.value;
    this.setData({
      demandInfo: value
    })
  },
  submitFormInfo(e) {
    console.log(e);
    const goodsInfo = e.detail.value.demandInfo;
    wx.navigateTo({
      url: `./takeNow?goodsInfo=${goodsInfo}&&index=${this.data.location}`
    })
  },

  // -----------------------------------------------------生命周期函数-----------------------------------------------
  onLoad: function() {
    app.userInfoReadyCallback = res => {
      console.log('获取成功');
      this.setData({
        nearCampus: res
      })
    };
  },
  onShow() {
    this.setData({
      nearCampus: app.globalData.nearCampus
    })
  },
  onShareAppMessage() {

  }
})