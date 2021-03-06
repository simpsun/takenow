const db = wx.cloud.database();
var util = require("../../../utils/util.js")
var DATA = require("../../../tn_config.js")
const app = getApp();
Page({

  data: {
    isExp: false,
    inputLength: 4,
    inputValue: '', //输入的验证码
    isFocus: false, //聚焦
    hideTip: true,
    cancelOrderText: '前15分钟可无条件取消订单(一天只能取消三次）',
    statusList: [],
    orderStatus: -1,
    grabOrderGoodSortList: ['帮我买', '帮我送', '领包裹', '全能跑腿'],
    isSucceedGrab: 0,
    attrList: [{
      icon: 'redpacket',
      context: '赏金',
      color: 'orange',
      attr: '￥34.7'
    }, {
      icon: 'goods',
      context: '重量',
      color: 'blue',
      attr: '1~2Kg'
    }, {
      icon: 'present',
      context: '跑腿类型',
      color: 'tnRed',
      attr: '帮我买'
    }],
    orderDetailList: [{
        name: '订单编号:',
        value: '2019102200001'
      },
      {
        name: '下单时间:',
        value: '2019年10月16日 23:02'
      },
      {
        name: '抢单时间',
        value: '2019年10月16日 23:02'
      },
      {
        name: '备注信息:',
        value: '撒娇鲁大师卡打卡时口娇鲁大师卡打卡时口袋里卡塑料袋里来了的沙拉大说了输了第娇鲁大师卡打卡时口袋里卡塑料袋里来了的沙拉大说了输了第袋里卡塑料袋里来了的沙拉大说了输了第三轮'
      }
    ]
  },
  // ----------------------------------------------------------窗体显示函数------------------------------------------------
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
  // 加载加载窗口
  loadLoadingModal() {
    this.setData({
      loadModal: true
    })
  },
  //取消订单
  onCancelOrder() {
    this.setData({
      isCancel: true
    })
  },
  hideCancelDialog() {
    this.setData({
      isCancel: false
    })
  },
  hideLoadingModal() {
    this.setData({
      loadModal: false
    })
  },
  showDialog() {
    this.setData({
      istrue: true
    })
  },
  showCodeModal() {
    this.setData({
      isFocus: true,
      modalName: 'codeModal'
    })
  },
  closeCodeModal() {
    this.setData({
      modalName: ''
    })
    this.mySlider.resetSlider(1);
  },
  showModal: function(t) {
    let timeList = this.getOrderStatus()
    this.setData({
      modalName: t.currentTarget.dataset.target,
      timeList: timeList
    });
  },
  hideModal: function(t) {
    this.setData({
      modalName: null
    });
  },
  stopEvent() {},
  closeDialog() {
    this.mySlider.resetSlider();

    this.setData({
      istrue: false
    })
  },
  // ----------------------------------------------------------事件响应函数------------------------------------------------
  myEventListener: function(e) {
    //获取到组件的返回值，并将其打印

    console.log('是否验证通过:' + e.detail.msg)
    if (e.detail.msg) {
      if (this.data.isExp) {
        wx.showToast({
          title: '您为体验用户不能抢单哦(｡･ω･｡)',
          icon: "none"
        })
        this.mySlider.resetSlider();
        return;
      }

      this.loadLoadingModal();
      let _id = this.data.orderInfo._id
      db.collection('tn_order').doc(_id).get().then(res => {
        console.log(res);
        const my_open_id = app.globalData.openid;
        console.log('openid', res.data.taker_open_id)
        switch (res.data.taker_open_id) {
          case null:
            if (res.data.user_openId == my_open_id) {
              wx.showToast({
                title: '您不能抢自己发布的订单哦ヾ(●´∀｀●)',
                icon: "none"
              })
              return;
            }
            if (this.data.gender != null) {
                if(this.data.gender!=res.data.genderLimit&&res.data.genderLimit!=2)
            {
                  wx.showToast({
                    title: '您不满足该订单性别限制哦(｡･ω･｡)',
                    icon: "none"
                  })
                  return;
            }
            }
            this.handleOrderStatus(res.data.status)
            break;
          case my_open_id:
            this.handleOrderStatus(res.data.status)
            break;
          default:
            this.showToastAndBack('别人抢先了,去看看其他订单吧~')
            setTimeout(function() {
              that.setData({
                animation: ''
              })
            }, 2000)
            break;
        }
      })
      this.hideLoadingModal();
    }
  },
  //取消订单
  cancelOrder() {
    const order = this.data.orderInfo;
    wx.cloud.callFunction({
      name: 'cancel_order',
      data: {
        _id: order._id
      }
    }).then(res => {
      console.log("订单取消成功", res)
      this.showToastAndBack("订单取消成功");
    })
    this.hideCancelDialog();
  },
  // 跳转列表显示模式
  navDetails() {
    wx.navigateTo({
      url: `listOrderInfo?id=${this.data.orderInfo._id}&&isTaker=true`
    })
  },
  handleInputTap() {
    this.setData({
      isFocus: true
    });
  },
  // 验证码错误动画
  toggle() {
    var anmiaton = 'shake';
    var that = this;
    that.setData({
      hideTip: false,
      animation: anmiaton
    })
    setTimeout(function() {
      that.setData({
        animation: ''
      })
    }, 1500)
  },
  // 验证码输入监听
  handleInputChange(ev) {
    let val = ev.detail.value;
    //判断用户是否已经输入
    let result = Boolean(val.length);
    this.setData({
      isLight: result,
      inputValue: val
    });
    if (val.length == 4) {
      wx.cloud.callFunction({
        name: 'check_take_code',
        data: {
          orderID: this.data.orderInfo.orderID,
          code: parseInt(val)
        }
      }).then(res => {
        if (res.result) {
          this.closeCodeModal();
          wx.showToast({
            title: '验证成功',
            duration: 2e3
          })
          this.updateDate();
          console.log('status:', this.data.orderInfo.status)

        } else if (res.result == false) {
          this.toggle();
        }
        console.log(res)
      }).catch(res => {
        console.log(res)
      })

    } else {
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


  // ----------------请求结果处理--------------
  handleOrderStatus(res) {
    switch (res) {
      //请求成功弹出窗口
      case 0:
        this.showDialog();
        break;
      case 1:
        this.showCodeModal();
        break;

    }

  },

  // 拨打电话
  callPhone() {

    wx.makePhoneCall({
      phoneNumber: this.data.orderInfo.deliverAddress.mobile
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
  grabOrder() {
    let _id = this.data.orderInfo._id
    wx.cloud.callFunction({
      name: 'grab_order',
      data: {
        _id: _id
      }
    }).then(res => {
      if (res.result.stats) {
        wx.showToast({
          title: '抢单成功',
          icon: 'success',
          duration: 2e3
        })
        this.updateDate();
        this.setData({
          isSucceedGrab: 1
        })
        this.mySlider.resetSlider(1);
      }
      if (res.result == 'otherGrabed') {
        this.showToastAndBack('订单信息已变动，请稍后再试')
        this.mySlider.resetSlider();
      }
    }).catch(res => {
      console.log('error:', res)
      wx.showToast({
        title: '服务器异常，请稍后再试',
        icon: 'none',
        duration: 2e3
      })
      this.mySlider.resetSlider();
    })
    this.closeDialog();
  },

  updateDate() {
    console.log('订单号：', this.data.id)
    db.collection('tn_order').where({
      _id: this.data.id
    }).get().then(res => {
      console.log('当前订单数据为：', res)
      if (res.data[0].status == 0)
        this.mySlider.resetSlider();
      if (res.data[0].status == 1)
        this.mySlider.resetSlider(1);
      this.setData({
        isSucceedGrab: res.data[0].status ? true : false,
        openid: app.globalData.openid,
        orderInfo: res.data[0],
        orderAttrList: [res.data[0].deliverCost + '元', res.data[0].goodsWeight, this.data.grabOrderGoodSortList[res.data[0].type], res.data[0].orderID, util.customFormatTime(res.data[0].create_time, 'Y年M月D日 h:m:s'), util.customFormatTime(res.data[0].grab_time, 'Y年M月D日 h:m:s'), res.data[0].goodsRemark ? res.data[0].goodsRemark : '无']
      })
    })
  },
  // ----------------------------------------------------------生命周期函数------------------------------------------------
  /* 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mySlider = this.selectComponent('#mySlider')
  },
  async onLoad(options) {

    console.log(options);
    await this.setData({
      statusList: DATA.data.statusList,
      timeTextList: DATA.data.timeTextList,
      isIphoneX: app.globalData.isIphoneX,
      id: options.id,
      gender:options.gender || null
    })
    await this.updateDate();
  },
  onShow() {

  }

})