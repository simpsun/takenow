// pages/myorder/myorder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
         TabCur: 0,
        scrollLeft:0,
        Tabs:[
          {
            index: 0,
            name: '全部'
          },
          {
            index:1,
            name:'待付款'
          },
          {
            index: 2,
            name: '待接单'
          },
          {
            index: 3,
            name: '待配送'
          },
          {
            index: 4,
            name: '待收货'
          }

        ]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 var that=this;
that.setData({
  TabCur:options.TabCur
 })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})