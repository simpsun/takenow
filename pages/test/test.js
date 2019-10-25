// pages/test/test.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    isShow:'DialogModal',
    dialogContent: '我将遵循"Take Now跑腿协议",并遵照法律、法规及学校规定，安全快速的送达',
    dialogTitle:'同意用户协议',
		noticeList: [{
			id: 0,
			color: 'blue',
			content: '吕佳平'
		},
		{
			id: 1,
			color: 'white',
			content: '孙诗奇'
		}],
	},
asd(){
  this.selectComponent('#myTnDialog').showModal();
  
},
	/**
	 * 生命周期函数--监听页面加载
	 */

  consolo(){
      console.log("123");
  },
	onLoad: function (options) {

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