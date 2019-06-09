Page({
  data: {
    index: null,
    source: 0,
    addressList: []
  },
  onLoad: function(t) {
    var arr = wx.getStorageSync("addressList") || [];
    console.info("缓存数据：" + arr), this.setData({
      addressList: arr
    });
  },
  onReady: function() {},
  onShow: function() {
    this.onLoad();
  },
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  showModal: function(t) {
    this.setData({
      modalName: t.currentTarget.dataset.target,
      addressIndex: t.currentTarget.dataset.id
    });
  },
  hideModal: function(t) {
    this.setData({
      modalName: null
    });
  },
  deleteAddress: function(t) {
    console.log(this.data.addressList)
    if (this.data.addressList[t.target.dataset.dd].default == true) {
      wx.showToast({
        title: "不能删除默认地址",
        icon: "none",
        duration: 1e3
      })
    } else {
      this.data.addressList.splice(t.target.dataset.dd, 1),
        wx.showToast({
          title: "删除成功",
          icon: "success",
          duration: 1e3,
          success: function() {
            setTimeout(function() {}, 1e3);
          }
        })
    }
    if (this.data.addressList.length > 0) {
      this.setData({
        addressList: this.data.addressList
      });
      try {
        wx.setStorageSync("addressList", this.data.addressList);
      } catch (t) {}
    } else {
      this.setData({
        addressList: this.data.addressList
      });
      try {
        wx.setStorageSync("addressList", []);
      } catch (t) {}
    }
    this.setData({
      modalName: null
    });
  },
  newAddress: function() {
    wx.navigateTo({
      url: "addressmananger",
      success: function(t) {
        console.log(t);
      },
      fail: function(t) {
        console.log(t);
      }
    });
  },
  ListTouchStart: function(t) {
    this.setData({
      ListTouchStart: t.touches[0].pageX
    });
  },
  ListTouchMove: function(t) {
    this.setData({
      ListTouchDirection: t.touches[0].pageX - this.data.ListTouchStart > 0 ? "right" : "left"
    });
  },
  ListTouchEnd: function(t) {
    "left" == this.data.ListTouchDirection ? this.setData({
      modalName: t.currentTarget.dataset.target
    }) : this.setData({
      modalName: null
    }), this.setData({
      ListTouchDirection: null
    });
  }
});