// pages/order/order.js
const db = wx.cloud.database()
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    releaseList:[],
    deliveryList:[],
    statusColorList: ['orange', 'tnRed', 'tnRed','grey','pink','grey','orange','orange'],
    statusList: ['未接单', '待送达', '待收货', '已过期', '未支付', '已取消', '退款中', '等待确认'],
    TabCur: 0, //订单类型
    scrollLeft: 0,
    Tabs: [{
        index: 0,
        name: '我发布的'
      },
      {
        index: 1,
        name: '我跑腿的'
      }
    ]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  navOrder(e) {
    const id = e.currentTarget.dataset.id;
    let page = this.data.TabCur ? 'itemOrderInfo':'listOrderInfo';
    wx.navigateTo({
      url: `../../pages/graborder/itemOrderInfo/${page}?id=${id}`,
    })
  },
  // 查询我发布的订单
  queryReleaseList() {
    //查询我发布的订单
    db.collection('tn_order').where({
      user_openId: this.data.my_open_id
    }).get().then(res => {
      console.log("我发布的订单列表", res.data);
      this.setData({
        releaseList: res.data
      })
    }).catch(res => {
      wx.showToast({
        title: '网络异常,请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
    wx.stopPullDownRefresh();
  },
  queryDeliveryList() {
    //查询我发布的订单
    db.collection('tn_order').where({
      // taker_open_id: 'o5E4o5AdRmxpgB77JD4zI378Vbmo'
      taker_open_id: this.data.my_open_id
    }).get().then(res => {
      console.log("我跑腿的订单列表", res.data);
      this.setData({
        deliveryList: res.data
      })
    }).catch(res => {
      wx.showToast({
        title: '网络异常,请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
    wx.stopPullDownRefresh();
  },

  /**
   * ---------------------------------------------------------生命周期函数--监听页面加载-------------------------------------
   */
  onLoad: function(options) {
    this.setData({
      my_open_id:app.globalData.openid
    })
    if (options.e != undefined) {
      var that = this;
      that.setData({
        TabCur: options.TabCur
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.queryReleaseList();
    this.queryDeliveryList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.queryReleaseList();
    this.queryDeliveryList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})