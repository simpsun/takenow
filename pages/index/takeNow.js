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
    goodsAddressTypeSelected: 0,
    AddressList: [],
    receivingAddressList: [],
    receivingAddress: "",
    switchTakeTag: 0,
    switchTakeList: ['指定地点', '就近购买'],
    addrDeliverText: '送到哪里去',
    addrPurchaseText: '在哪里购买',



  },
  // -----=---------------------------------------事件监听函数------------------------------------------------------------------

  radioChange(e) {
    this.setData({
      goodsAddressTypeSelected: e.detail.value
    })
  },
  // 指定和就近地点标签转换
  switchTakeBtn(e) {
    this.setData({
      switchTakeTag: e.currentTarget.dataset.sindex,

    })

  },
  showModal: function(t) {
    this.setData({
      modalName: t.currentTarget.dataset.target
    });
  },

  hideModal: function(t) {
    this.setData({
      modalName: null
    });
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