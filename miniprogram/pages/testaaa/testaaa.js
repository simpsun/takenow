// miniprogram/pages/testaaa/testaaa.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputLength: 4,
    inputValue: '', //输入的验证码
    isFocus: true, //聚焦
    hideTip: true
  },
  handleInputTap() {
    this.setData({
      isFocus: true
    });
  },
  toggle() {

    var anmiaton = 'shake';
    var that = this;
    that.setData({
      hideTip: false,
      animation: anmiaton
    })
    setTimeout(function() {
      that.setData({
        animation:''
      })
    }, 1500)

  },
  showCodeModal(){
    this.setData({
      modalName: 'codeModal'
    })
  },
  closeCodeModal(){
this.setData({
  modalName: ''
})
  },
  handleInputChange(ev) {

    let val = ev.detail.value;
    //判断用户是否已经输入
    let result = Boolean(val.length);

    this.setData({
      isLight: result,
      inputValue: val
    });
    if (val.length == 4) {
      if (val == '1234') {
        wx.showToast({
          title: '验证成功',
        })

      } else {
       this.toggle();
      }
    }
    else{
      this.setData({
  hideTip: true
      })
    }
  },
  // input 点击  聚焦
  handleInputTap() {
    this.setData({
      isFocus: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      modalName: 'codeModal'
    })
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