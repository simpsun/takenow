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
    location: 0
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
    let list = [] //校区列表
    if (app.globalData.campusList) {
      app.globalData.campusList.forEach(item => {
        list.push(item.name)
      })
      //如果已经选择了校区，把校区名传给下单 页面
      if (list.indexOf(this.data.nearCampus) >= 0) {
        console.log(e);
        const goodsInfo = e.detail.value.demandInfo;
        wx.navigateTo({
          url: `./takeNow?goodsInfo=${goodsInfo}&&index=${this.data.location}&&nearCampus=${this.data.nearCampus}`
        })
      }
      // 如果没选校区，提醒用户
      else {
        wx.showToast({
          title: '还没选择校区哦o((⊙﹏⊙))o',
          icon: 'none',
          duration: 2000
        })
      }
    } else { //列表不存在，就等待
      wx.showToast({
        title: '获取校区列表失败，请稍微再试',
        icon: 'none',
        duration: 2000
      })
    }

  },

  // -----------------------------------------------------生命周期函数-----------------------------------------------
  onLoad: function() {
    app.userInfoReadyCallback = res => {
      console.log('获取成功');
      this.setData({
        nearCampus: res
      })
    };
    wx.showToast({
      title: '我猜你是' + app.globalData.nearCampus + '的小可爱(❁´ω`❁)',
      icon: 'none',
      duration: 3000
    })
  },
  onShow() {
    this.setData({
      nearCampus: app.globalData.nearCampus
    })
   
  },
  onShareAppMessage() {
    return {
      title:'天津师范大学校园跑腿',
      imageUrl: "../../images/share.png",
      path: '/pages/start/start'
    }
  }
})