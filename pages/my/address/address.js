// pages/my/address/address.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
        index:null,
        source: 0,
        addressList: []
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var arr = wx.getStorageSync('addressList') || [];

    console.info("缓存数据：" + arr);

    // 更新数据  

    this.setData({

      addressList: arr

    });

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
    this.onLoad();
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

  },
  // 显示对话框
  showModal(e) {
  
    this.setData({
      modalName: e.currentTarget.dataset.target,
      addressIndex:e.currentTarget.dataset.id
    })

  },
  // 关闭对话框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 删除地址
  deleteAddress(e){
    console.log(this.data.addressList[e.target.dataset.dd].default);
    if (this.data.addressList[e.target.dataset.dd].default)
    {
      wx.showModal({
        content:'不能删除默认地址',
         showCancel: false,
        confirmColor:'#F6275C'
      })

    }
    else
    {
    this.data.addressList.splice(e.target.dataset.dd,1);
    }
    if (this.data.addressList.length > 0) 
    {
      this.setData({ addressList: this.data.addressList});
      wx.setStorageSync('addressList', this.data.addressList);

    } else {

      this.setData({addressList: this.data.addressList });
      wx.setStorageSync('addressList', []);

    }
    this.setData({ modalName: null })
  
    },
  newAddress(){
    wx.navigateTo({
      url: 'addressmananger',
      success: function(res) {console.log(res);},
      fail: function(res) {console.log(res);},
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
        
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  }
})