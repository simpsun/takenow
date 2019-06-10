// pages/my/taker/taker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sImage: "",
    date: '2017-09',
    steps: 0,
    idCard_name: "",
    idCard_code: "",
    idCard_gender: 0,
    studentCard_code: "",
    studentCard_schoolId: null,
    studentCard_schoolName: null,
    studentCard_faculty: "",
    studentCard_major: "",
    numList: [{
      name: '阅读需知'
    }, {
      name: '实名认证'
    }, {
      name: '学生认证'
    }, {
      name: '手机认证'
    }],
    num: 0,
  },
  tap: function(e) {
    console.log(e)
  },
  radioChange: function(e) {
    this.setData({
      idCard_gender: e.detail.value
    })
  },
  nameBlur: function(e) {
    this.setData({
      idCard_name: e.detail.value
    })
  },
  codeBlur: function(e) {
    console.log(e)
    this.setData({
      idCard_code: e.detail.value
    })
    console.log(this.data.idCard_code)
  },
  sNameBlur: function(e) {
    console.log(e)
    this.setData({
      studentCard_schoolName: e.detail.value
    })
    console.log(this.data.idCard_code)
  },
  sNameBlur: function (e) {
    console.log(e)
    this.setData({
      studentCard_schoolName: e.detail.value
    })
    console.log(this.data.idCard_code)
  },



  sCodeBlur: function (e) {
    console.log(e)
    this.setData({
      studentCard_schoolId: e.detail.value
    })
    console.log(this.data.studentCard_schoolId)
  },

  sFacultyBlur: function (e) {
    console.log(e)
    this.setData({
      studentCard_faculty: e.detail.value
    })
    console.log(this.data.studentCard_faculty)
  },
  sMajorBlur: function (e) {
    console.log(e)
    this.setData({
      studentCard_major: e.detail.value
    })
    console.log(this.data.studentCard_major)
  },















  nextStep: function() {
    this.setData({
      steps: this.data.steps + 1
    })
    console.log(this.data.idCard_code)
  },
  lastStep: function() {
    this.setData({
      steps: this.data.steps - 1
    })

  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  chooseImg() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          sImage: res.tempFilePaths
        })
      }
    })

  },

  /**
   * 
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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