// pages/graborder/itemOrderInfo/listOrderInfo.js
var util = require("../../../utils/util.js")
var DATA = require("../../../tn_config.js")
var leftTime = 1800000;
var app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cancelOrder: 'cancelOrder_0',
    canIcallTaker: false,
    cancelOrderText: "不要再等等嘛~Taker或许马上就来",
    orderList: [{
      createTime: '1571757909000',
      leftTime: '15:00',
      status: 0
    }],

    statusList: [],
    statusInfo: ['感谢您使用Take Now,如有疑问请联系taker或客服', '订单已过期，请返回主页重新发布订单哦~'],
    grabOrderGoodSortList: ['帮我买', '帮我送', '领包裹', '全能跑腿'],
    genderLimitList: ['限女生', '限男生', '不限性别'],
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
        name: '校区:'
      },
      {
        name: '备注信息:',
        value: '撒娇鲁大师卡打卡时口娇鲁大师卡打卡时口袋里卡塑料袋里来了的沙拉大说了输了第娇鲁大师卡打卡时口袋里卡塑料袋里来了的沙拉大说了输了第袋里卡塑料袋里来了的沙拉大说了输了第三轮'
      }
    ],
    isTakerView: false //taker视图和用户视图切换
  },
  callPhone(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenum //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 未支付订单倒计时
   */
  countDown: function() {
    var that = this;
    that.data.timer = setInterval(() => {
      var orders = this.data.orderList;
      for (var i = 0; i < orders.length; i++) {
        var status = orders[i].status;
        if (status == 4) {
          var createTime = orders[i].createTime;
          //计算剩余时间差值
          leftTime = (parseInt(createTime) + 30 * 60 * 1000) - new Date().getTime();
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
  orderTimer() {
    this.data.timer = setInterval(() => {
      var order = this.data.orderInfo;

      var status = order.status;
      if (status == 4) {
        var createTime = order.create_time;
        //计算剩余时间差值
        leftTime = (parseInt(createTime) + 30 * 60 * 1000) - new Date().getTime();

        if (leftTime > 0) {
          //计算剩余的分钟
          var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
          //计算剩余的秒数
          var seconds = util.formatNumber(parseInt(leftTime / 1000 % 60, 10));
          var leftTime = util.formatNumber(minutes + ":" + seconds);
          // console.log(minutes + ":" + seconds);
          order.leftTime = leftTime;
        } else {
          //移除超时未支付的订单
          order.status = 5;
          // db.collection('tn_order').doc(order._id).update({
          //   data: {
          //     status: 5
          //   }
          // }).then(res => {
          //   console.log('订单已取消', res)
          // }).catch(res => {
          //   console.log('订单未取消', res)
          // })
          wx.cloud.callFunction({
            name: 'expire_order',
            data: {
              _id: this.data.orderInfo._id,
            }
          }).then(res => {
            console.log("过期订单函数调用成功", res);
          }).catch(res => {
            console.log("过期订单函数调用失败", res);
          })
          clearInterval(this.data.timer);
        }
      }
      this.setData({
        orderInfo: order
      });
    }, 1000);
  },


  showModal: function(t) {
    let timeList = this.getOrderStatus()
    this.setData({
      modalName: t.currentTarget.dataset.target,
      timeList: timeList
    });
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //获取订单状态详情
  getOrderStatus() {
    let order = this.data.orderInfo;
    let status = order.status;
    let list = [{
        name: 'create_time',
        value: order.create_time
      }, {
        name: 'pay_time',
        value: order.pay_time || null
      }, {
        name: 'grab_time',
        value: order.grab_time || null
      }, {
        name: 'expire_time',
        value: order.expire_time || null
      }, {
        name: 'user_expire_time',
        value: order.user_expire_time || null
      },
      {
        name: 'cancel_time',
        value: order.cancel_time || null
      },
      {
        name: 'complete_time',
        value: order.complete_time || null
      }
    ];
    let timeList = [];
    list.forEach(item => {
      if (item.value != null)
        timeList.push(item)
    });
    return timeList
  },

  updateDate() {
    db.collection('tn_order').doc(this.data._id).get().then(res => {
      console.log('当前订单数据为：', res)
      let canIcallTaker = this.callTaker(res.data.status);
      this.setData({
        canIcallTaker: canIcallTaker,
        orderInfo: res.data,
        orderAttrList: [res.data.orderID, util.customFormatTime(res.data.create_time, 'Y年M月D日 h:m:s'), this.data.grabOrderGoodSortList[res.data.type], '￥' + res.data.deliverCost, res.data.goodsWeight, this.data.genderLimitList[res.data.genderLimit], res.data.nearCampus, res.data.goodsRemark]
      });
      if (res.data.status == 1) {
        wx.cloud.callFunction({
          name: 'get_take_code',
          data: {
           orderID: res.data.orderID
          }
        }).then(res=>{
         if(res.result.data.length==1)
         this.setData({
           takeCode: res.result.data[0].take_code
         })
        })
      }
      if (res.data.status == 4) {
        this.orderTimer();
      }
    })
  },
  // --------------------------------------------------取消订单窗口-------------------------------------------- 

  stopCancelEvent() {},
  //取消订单
  onCancelOrder() {
    let order = this.data.orderInfo
    let left_minute = (new Date().getTime() - order.grab_time) / 1000 / 60
    let cancelOrderText = this.data.cancelOrderText
    let cancelOrder = this.data.cancelOrder
    // 当 未抢单 或者 被接单后的前10分钟 无条件取消
    if (order.status == 1) {
      console.log('已过分钟数', left_minute)
      if (left_minute <= 10) {
        cancelOrderText = '订单前十分钟无条件取消，您确定要取消订单吗？'
      } else {
        cancelOrderText = '订单已超过无条件取消时间，需和Taker协商后，才能取消订单'
        cancelOrder = 'cancelOrder_1' // 用户申请取消订单
      }
    }
    this.setData({
      cancelOrder: cancelOrder,
      cancelOrderText: cancelOrderText,
      isCancel: true
    })
  },
  hideCancelDialog() {
    this.setData({
      isCancel: false
    })
  },
  //未接单取消订单
  cancelOrder_0() {
    const order = this.data.orderInfo;
    wx.cloud.callFunction({
      name: 'user_cancel_order',
      data: {
        _id: order._id
      }
    }).then(res => {
      console.log("订单取消成功", res)
      this.showToastAndBack("订单取消成功");
    })
    this.hideCancelDialog();
  },
  //申请取消订单
  cancelOrder_1() {

  },

  // ------------------------------------------------------------------------
  // 显示Toast并返回
  showToastAndBack(res) {
    wx.showToast({
      title: res,
      icon: 'none',
      duration: 2000
    })
    setTimeout(res => {
      wx.navigateBack({
        delta: 1
      })
    }, 2000)
  },

  // 是否能联系Taker
  callTaker(res) {
    let list = [1, 2, 6, 7, 8, 9];

    return (list.indexOf(res) != -1) ? true : false

  },
  /**
   * 
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    let _id = options.id
    console.log('options', options)

    await this.setData({
      statusList: DATA.data.statusList,
      timeTextList: DATA.data.timeTextList,
      openid: app.globalData.openid,
      isTaker: options.isTaker || '',
      _id: _id || '',
      isIphoneX: app.globalData.isIphoneX,
    })

    this.updateDate();
    // db.collection('tn_order').doc(_id).get().then(res => {
    //   return new Promise((reslove, reject) => {
    //     this.setData({
    //       orderInfo: res.data
    //     })
    //     reslove();
    //   })
    // }).then(res => {
    //   console.log('订单详情获取成功:', this.data.orderInfo)
    // })
  },
  //获取订单状态详情
  getOrderStatus() {
    let order = this.data.orderInfo;
    let status = order.status;
    let list = [{
        name: 'create_time',
        value: order.create_time
      }, {
        name: 'pay_time',
        value: order.pay_time || null
      }, {
        name: 'grab_time',
        value: order.grab_time || null
      }, {
        name: 'expire_time',
        value: order.expire_time || null
      }, {
        name: 'user_expire_time',
        value: order.user_expire_time || null
      },
      {
        name: 'user_cancel_time',
        value: order.user_cancel_time || null
      },
      {
        name: 'cancel_time',
        value: order.cancel_time || null
      },
      {
        name: 'complete_time',
        value: order.complete_time || null
      }
    ];
    let timeList = [];
    list.forEach(item => {
      if (item.value != null)
        timeList.push(item)
    });
    return timeList
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(new Date('2019-11-25 10:25:09').getTime())

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

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