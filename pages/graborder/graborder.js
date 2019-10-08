// pages/graborder/graborder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否通过跑腿认证
    isAuthenticate:0,  
    rewardHunterList: [{
      id: 0,
      avatar: '',
      name: '',
      reward: ''
    }, {
      id: 1,
      avatar: '',
      name: '',
      reward: ''}
 ],

 isFilterIcan:false,
    filterBarList:[
      {
        value:'最新',
        id:0
      },
      {
        value: '距离',
        id: 1
      },
      {
        value: '赏金',
        id: 2
      }
    ]
 },


  onFilterBarBtn(e){
    const index=e.currentTarget.dataset.findex
    
    this.setData({
      selectedFilterBtn:this.data.selectedFilterBtn==index?-1:index
    })
    console.log(this.data.selectedFilterBtn) 
  },
// ------------------------------------------------------------生命周期函数-----------------------------------------------------
  /**
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
  onFilterIcan() {
this.setData({
  isFilterIcan:!this.data.isFilterIcan
})
  },
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