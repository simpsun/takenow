// pages/index/takeNow.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfoArea: '',
    latitude: 39.14111,
    longitude: 117.00739,
    isLoaction: 0,
    remarkInput: "",
    AddressList: [],
    receivingAddressList: [],
    receivingAddress: "",
    switchTakeTag: 0,
    switchTakeList: ['指定地点', '就近购买'],
    addrDeliverText: '送到哪里去',
    addrPurchaseText: '在哪里购买',
    selectedCostTag: 2,
    userDeterminedCost: undefined,
    userFilledOtherCost: 0,
    OtherCostInputStaus: 0,
    focusedOtherCost: false,
    selectedGenderLimit: undefined,
    genderLimitList: ['不限性别', '限女生', '限男生'],
    selectedWeight: '小于1Kg',
    weightList: ['小于1Kg', '1Kg~2kg', '2Kg~3Kg', '3Kg~4Kg', '4Kg~5Kg', '5Kg~10Kg', '10Kg~20Kg', '20Kg~30Kg', '30Kg~50Kg', '50Kg以上'],
    orderLifeList: ['30分钟', '1小时', '2小时', '3小时', '4小时', '5小时', '7小时', '10小时', '15小时', '20小时', '24小时', '48小时', '一周'],
    userDeterminedWeight: undefined,
    userDeterminedOrderLife:undefined,
    selectedOrderLife: 10,
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
  }


  ,
  // -----=---------------------------------------事件监听函数------------------------------------------------------------------

  // 指定和就近地点标签转换
  switchTakeBtn(e) {
    this.setData({
      switchTakeTag: e.currentTarget.dataset.sindex,
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
  // 失去焦点时，存储用户填写的其他金额
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
      itemColor: '#f6275c',
      success: (res) => {
        this.setData({
          selectedGenderLimit: this.data.genderLimitList[res.tapIndex]
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
      selectedOrderLife:e.detail.value
    })
},
  determineOrderLife(){
    this.setData({
      userDeterminedOrderLife:this.data.orderLifeList[this.data.selectedOrderLife]
    })
    this.hideModal();
  },




abandonOrder(t) {
  this.setData({
    modalName: null
  });
  wx.navigateBack({
    delta: 1
  })
},
selectAddressTap(e) {
  var that = this;
  if (e.currentTarget.dataset.aindex == 0) {
    if (this.data.isLocation == true) {
      wx.chooseLocation({
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        scale: 18,
        success: function(e) {
          that.setData({
            addrPurchaseText: e.name

          })
        }
      })
    } else {
      this.setData({
        modalName: "DialogModal"
      });
    }
  } else {
    wx.navigateTo({
      url: '../../pages/my/address/address?ismanage=false'
    })
  }
},
getMyLocation: function(t) {
  this.setData({
    modalName: null
  });
  var that = this;
  if (t.detail.authSetting["scope.userLocation"]) {
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
onLoad: function(e) {
  if (!!e.goodsInfo) {
    console.log('接收到数据:' + e.goodsInfo);
    this.setData({
      goodsInfoArea: e.goodsInfo
    })
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
  if (!!this.data.receivingAddress)
    this.setData({
      addrDeliverText: this.data.receivingAddress

    })
},
onUnload: function() {
  this.setData({
    modalName: "BackDialogModal"
  })
}
})