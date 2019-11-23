// pages/index/takeNow.js
const util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // orderInfo: {
    //   orderID: null,
    //   user_open_id: null,
    //   taker_open_id: null,
    //   orderPayID: null,
    //   type: null,
    //   goods: null,
    //   purchAddr: null,
    //   delAddr: null,
    //   remark: null,
    //   weight: null,
    //   gender: null,
    //   cost: null,
    //   create_time: null,
    //   expire_time: null,
    // },
    istrue: false,
    isSwitchTakeBtn: true, //控制能不能点就近购买
    dialogTitle: '未授权位置信息',
    dialogContent: 'Take Now需要获取您的位置信息，以便您快速的设置收货地址，请点击确认，并在授权页面开启位置信息授权，即可使用',
    goodsInfoArea: '',
    remarkInput: "",
    AddressList: [],
    //从地址管理页面选择的信息
    receivingAddressList: undefined,
    receivingAddress: null,
    purchAddressList: null,
    purchAddress: null,


    switchTakeTag: 0,
    nearPurchaseText: 'Taker会在附近区域购买',
    switchTakeList: ['指定地点', '就近购买'],
    addrDeliverText: '送到哪里去',
    addrPurchaseText: '在哪里购买',
    selectedCostTag: 2,
    userDeterminedCost: undefined,
    userFilledOtherCost: 0,
    OtherCostInputStaus: 0,
    focusedOtherCost: false,
    selectedGenderLimit: null,
    genderLimitList: ['限女生', '限男生', '不限性别'],
    selectedWeight: '小于1Kg',
    weightList: ['小于1Kg', '1Kg~2kg', '2Kg~3Kg', '3Kg~4Kg', '4Kg~5Kg', '5Kg~10Kg', '10Kg~20Kg', '20Kg~30Kg', '30Kg~50Kg', '50Kg以上'],
    orderLifeList: ['30分钟', '1小时', '2小时', '3小时', '4小时', '5小时', '7小时', '10小时', '15小时', '20小时', '24小时', '48小时', '一周'],
    orderLifeSecList: [1800000, 3600000, 7200000, 10800000, 14400000, 18000000, 25200000, 36000000, 54000000, 72000000, 86400000, 172800000, 604800017],
    userDeterminedWeight: undefined,
    userDeterminedOrderLife: undefined,
    selectedOrderLife: 10,
    OrderInfoList: {},
    checkbox: [{
      value: 0,
      money: 1,
      hot: true,
    }, {
      value: 1,
      money: 3,
      hot: false,
    }, {
      value: 2,
      money: 5,
      hot: true,
    }, {
      value: 3,
      money: 10,
      hot: false,
    }, {
      value: 4,
      money: 20,
      hot: false,
    }, {
      value: 5,
      money: 100,
      hot: false,
    }]
  },



  // -----=---------------------------------------事件监听函数------------------------------------------------------------------
  //  支付订单
  onPayOrder() {
    wx.showLoading({
      title: '提交中',
    })
    this.closeDialog();
    if (!this.data.orderInfo) {
      wx.showToast({
        title: '订单信息错误o(╥﹏╥)o',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.cloud.callFunction({
        name: 'submit_order',
        data: {
          orderInfo: this.data.orderInfo
        }
      }).then(res => {
        wx.hideLoading();
        console.log("创建订单成功：", res)
        wx.redirectTo({
          url: 'paySuccess/paySuccess',
        })
      }).catch(res => {
        wx.hideLoading();
        wx.showToast({
          title: '创建失败，请及时反馈或稍后再试(ಥ_ಥ) ',
          icon: 'none',
          duration: 2000
        })
      })
    }
  },

  // 关闭支付窗口
  closeDialog: function() {
    this.setData({
      istrue: false
    })
  },

  // 指定和就近地点标签转换
  switchTakeBtn(e) {
    if (this.data.isSwitchTakeBtn) {
      this.setData({
        switchTakeTag: e.currentTarget.dataset.sindex,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '如需就近购买，请重新选择跑腿类型',
        duration: 2000,
      })
    }
  },

  //  商品信息输入监听
  onGoodsInfo(e) {
    this.setData({
      goodsInfoArea: e.detail.value
    })

  },
  // ---------------------------------------------跑腿费用窗口-------------------------------------------------------------
  // 选择跑腿费用Tag
  ChooseCheckbox(e) {
    this.setData({
      selectedCostTag: e.currentTarget.dataset.value
    })
  },
  // 只是为了阻止冒泡，不需要实现
  forStopBubbles() {},
  showModal: function(t) {
    this.setData({
      modalName: t.currentTarget.dataset.target
    });
  },
  // 按下确定键
  determineCost() {

    this.setData({
      userDeterminedCost: this.data.selectedCostTag == 6 ? this.data.userFilledOtherCost : this.data.checkbox[this.data.selectedCostTag].money
    })
    this.hideModal();
  },
  hideModal: function(t) {
    this.setData({
      modalName: null
    });
  },
  // 按下其他金额
  onOtherCost() {
    this.setData({
      OtherCostInputStaus: 1,
      selectedCostTag: 6,
      focusedOtherCost: true
    })
  },
  // 输入时，存储用户填写的其他金额
  filledOtherCost(e) {
    console.log(e);
    this.setData({
      userFilledOtherCost: e.detail.value
    })
  },

  // ------------------------------性别限制------------------------------

  onGenderLimit() {
    wx.showActionSheet({
      itemList: this.data.genderLimitList,
      itemColor: '#5a87f7',
      success: (res) => {

        this.setData({
          // selectedGenderLimit: this.data.genderLimitList[res.tapIndex]
          selectedGenderLimit: res.tapIndex
        })
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  // -------------------------------商品重量------------------------------
  onWeightChange(e) {
    this.setData({
      selectedWeight: this.data.weightList[e.detail.value]
    })
  },
  determineWeight() {
    this.setData({
      userDeterminedWeight: this.data.selectedWeight
    })
    this.hideModal();
  },
  // -----------------------------------订单过期------------------------------
  onOrderLifeChange(e) {
    this.setData({
      selectedOrderLife: e.detail.value
    })
  },
  determineOrderLife() {
    this.setData({
      userDeterminedOrderLife: this.data.orderLifeList[this.data.selectedOrderLife]
    })
    this.hideModal();
  },

  submitOrder() {

    const t = this.data
    // purchaseStyleTag  ===>switchTakeList[index]
    // purchaseAddress   ===>purchaseAddress 
    //  deliverAddress   ===>receivingAddressList[]
    //  goodsInfo        ===>goodsInfoArea
    //  goodsRemark      ===>remarkInput
    //  goodsWeight      ===>userDeterminedWeight
    //  genderLimit      ===>selectedGenderLimit
    //  deliverCoset     ===>userDeterminedCost
    //  orderLife        ===>userDeterminedOrderLife
    if ((t.switchTakeTag == 0) && ((!t.purchaseAddress) && (!t.purchAddress))) {
      wx.showToast({
        title: "请填写购买地址",
        icon: "none",
        duration: 1e3
      });

    } else if (!t.receivingAddressList) {

      wx.showToast({
        title: "请填写配送地址",
        icon: "none",
        duration: 1e3
      });
    } else if (t.goodsInfoArea == '') {

      wx.showToast({
        title: "请填写要购买的商品",
        icon: "none",
        duration: 1e3
      });
    } else if (!t.userDeterminedCost) {
      wx.showToast({
        title: "请填写跑腿费",
        icon: "none",
        duration: 1e3
      });
    } else {

      // 构建订单参数
      let orderInfo = {
        status: 0,
        addrStyleTag: t.switchTakeTag,
        purchaseAddress: t.purchAddress != null ? t.purchAddressList : (t.purchaseAddress ? t.purchaseAddress : '就近购买'),
        deliverAddress: t.receivingAddressList,
        goodsInfo: t.goodsInfoArea,
        goodsRemark: t.remarkInput || '无',
        goodsWeight: t.userDeterminedWeight || t.selectedWeight,
        genderLimit: t.selectedGenderLimit != null ? t.selectedGenderLimit : 2,
        deliverCost: t.userDeterminedCost,
        orderLife: t.userDeterminedOrderLife || t.orderLifeList[10],
        create_time: new Date().getTime(),
        type: t.location,
        taker_open_id: null,
        orderID: util.tnFormatTime(new Date()) + Math.floor(Math.random() * 9999 + 1000),
        orderPayID: null,
        nearCampus: t.nearCampus,
        version: 1 //乐观锁
      }
      const sindex = t.orderLifeList.indexOf(orderInfo.orderLife);
      const timeStamp = (parseInt(orderInfo.create_time) + t.orderLifeSecList[sindex]);
      orderInfo.orderLife = timeStamp
      this.setData({
        orderInfo: orderInfo,
        istrue: true
      })
    }
    // } else if (!remarkInput) {
    //   goodsRemark: '无'
    // }
    // else if (!userDeterminedWeight) {
    //   goodsWeight: '小于1Kg'
    // }
    // else if (!selectedGenderLimit){
    //   genderLimit:'不限男女'
    // }
  },




  // 调用窗口
  abandonOrder(t) {
    this.setData({
      modalName: null
    });
    wx.navigateBack({
      delta: 1
    })
  },
  // ------------------------------------------------地址选择-----------------------------------------------------------------
  selectAddressTap(e) {
    var that = this;
    // 判断是购买地址还是配送地址
    if (e.currentTarget.dataset.aindex == 0 && this.data.location != 1) {
      if (this.data.isLocation == true) {
        wx.chooseLocation({
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          scale: 18,
          success: function(e) {
            console.log(e)
            that.setData({
              addrPurchaseText: e.name,
              purchaseAddress: e.name + '(' + e.address + ')'
            })
          }
        })
      } else {
        that.selectComponent('#tnLocation').showModal();
      }
    } else {
      wx.navigateTo({
        url: `../../pages/my/address/address?ismanage=false&&addrStyle=${e.currentTarget.dataset.aindex}`
      })
    }
  },
  getMyLocation: function(t) {
    console.log(t)
    var that = this;
    if (t.detail.detail.authSetting["scope.userLocation"]) {
      that.setData({
        isLocation: 1
      }), wx.getLocation({
        type: "gcj02",
        success: function(t) {
          var a = t.latitude,
            o = t.longitude;
          that.setData({
            latitude: a,
            longitude: o
          }), wx.chooseLocation({
            latitude: a,
            longitude: o,
            scale: 18,
            success: function(t) {
              console.log(t),
                that.setData({
                  addrPurchaseText: t.name
                });
            }
          });
        }
      })
    } else {
      that.setData({
        isLocation: 0
      });
    }
  },
  getDefaultAddressList() {
    var arr = wx.getStorageSync("addressList") || [];
    if (arr != '') {

      if (arr[0].default == true) {
        this.setData({
          receivingAddress: arr[0].defaultAddress + arr[0].exactAddress
        })
      }
    }
  },
  // -------------------------------------------------------生命周期函数------------------------------------------------------------
  onLoad: function(e) {
    this.setData({
      isIphoneX: app.globalData.isIphoneX
    })
    if (e.index && e.nearCampus) {
      this.setData({
        location: parseInt(e.index),
        nearCampus: e.nearCampus
      })
    }
    console.log('接收到数据:', e);
    if (!!e.goodsInfo) {
      console.log('接收到数据:' + e.goodsInfo);
      this.setData({
        goodsInfoArea: e.goodsInfo
      })
    }

    switch (e.index) {
      case '1': //帮我送
        this.setData({
          isSwitchTakeBtn: false, // 不能点就近购买
          addrDeliverText: '去哪里配送',
          addrPurchaseText: '去哪里取货'
        })
        break;
      case '2': //领包裹
        this.setData({
          switchTakeList: ['指定地点', '本校领取'],
          addrDeliverText: '送到哪里去',
          nearPurchaseText: 'Taker会在当前校区快递处领取',
          switchTakeTag: 1
        })
        break;

    }
    this.getDefaultAddressList();
    var that = this;
    wx.getLocation({
      type: "gcj02",
      success: function(t) {
        console.log(t);
        var latitude = t.latitude,
          longitude = t.longitude;
        that.setData({
          isLocation: 1,
          latitude: latitude,
          longitude: longitude
        });
      },
      fail: function(t) {
        console.log("拒绝授权"), that.setData({
          isLocation: 0
        });
      }
    })

  },
  onShow: function() {
    if (this.data.receivingAddress != null || this.data.purchAddress != null)
      this.setData({
        addrDeliverText: this.data.receivingAddress != null ? this.data.receivingAddress : this.data.addrDeliverText,
        addrPurchaseText: this.data.purchAddress != null ? this.data.purchAddress : this.data.addrPurchaseText
      })
  },
  onUnload: function() {
    this.setData({
      modalName: "BackDialogModal"
    })
  }
})