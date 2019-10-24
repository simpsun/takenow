// pages/graborder/itemOrderInfo/listOrderInfo.js
var util = require("../../../utils/util.js")
var leftTime = 1800000
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [{ createTime: '1571757909000', leftTime: '15:00', status:0}],
    attrList: [{
        name: '订单编号:',
        value: '2019102200001'
      },
      {
        name: '下单时间:',
        value: '2019年10月16日 23:02'
      },
      {
        name: '订单类型:',
        value: '帮我买'
      },
      {
        name: '赏金:',
        value: '￥34.7'
      },
      {
        name: '重量:',
        value: '10~20Kg'
      },
      {
        name: '性别限制:',
        value: '不限男女'
      },
      {
        name: '备注信息:',
        value: '撒娇鲁大师卡打卡时口娇鲁大师卡打卡时口袋里卡塑料袋里来了的沙拉大说了输了第娇鲁大师卡打卡时口袋里卡塑料袋里来了的沙拉大说了输了第袋里卡塑料袋里来了的沙拉大说了输了第三轮'
      }
    ],
    isTakerView: false //taker视图和用户视图切换
  },
  /**
   * 未支付订单倒计时
   */
  countDown: function () {
    var that = this;
    that.data.timer = setInterval(function () {
      var orders = that.data.orderList;
      for (var i = 0; i < orders.length; i++) {
        var status = orders[i].status;
        if (status == 0) {
          var createTime = orders[i].createTime;
          //计算剩余时间差值
          leftTime =(parseInt(createTime) + 30 * 60 * 1000) - new Date().getTime();
          console.log(leftTime)
          if (leftTime > 0) {
            //计算剩余的分钟
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
            //计算剩余的秒数
            var seconds = util.formatNumber(parseInt(leftTime / 1000 % 60, 10));
            var leftTime = util.formatNumber(minutes + ":" + seconds);
            // console.log(minutes + ":" + seconds);
            orders[i].leftTime = leftTime;
          } else {
            //移除超时未支付的订单
            orders.splice(i, 1);
          }
        }
      }
      that.setData({
        orderList: orders
      });
    }, 1000);
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.countDown();
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
    console.log(new Date('2019-10-22 23:25:09').getTime())
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
    clearInterval(this.data.timer);
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