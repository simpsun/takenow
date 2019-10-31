// pages/index/remark.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarkTextarea: "",
    ColorList: [{

        title: '放楼下就行',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '到店联系我',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '需要小票',
        name: 'orange',
        color: '#f37b1d'
      },

      {
        title: '饮料请拿吸管',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '请拿餐具',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '麻烦快点送到',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '慢慢送不着急',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '需要发票',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '配送注意安全',
        name: 'blue',
        color: '#0081ff'
      },

      {
        title: '谢谢',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
    ]
  },
  remarkTag(e) {
    this.setData({
      remarkTextarea: this.data.remarkTextarea + e.currentTarget.dataset.text + ","
    })

  },
  bindinput(e) {
    this.setData({
      remarkTextarea: e.detail.value

    })
    console.log(this.data.remarkTextarea)
  },
  remarkSubmit() {
    var that = this;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var prePage = pages[pages.length - 2];
    prePage.setData({
      remarkInput: this.data.remarkTextarea
    })
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      remarkTextarea: options.remarkInput
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})