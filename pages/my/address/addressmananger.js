var addressList = null;
Page({
  data: {
    defaultAddress: "",
    latitude: 39.14111,
    longitude: 117.00739,
    isLoaction: !1,
    edit: -1
  },
  formSubmit: function(e) {
    if ("" == e.detail.value.name) wx.showToast({
      title: "请填写收货人",
      icon: "none",
      duration: 1e3
    });
    else if ("" == e.detail.value.mobile) wx.showToast({
      title: "请填写收货电话",
      icon: "none",
      duration: 1e3
    });
    else if (/^1(3|4|5|7|8|9)\d{9}$/.test(e.detail.value.mobile))
      if ("" == e.detail.value.defaultAddress) wx.showToast({
        title: "请选择收货地址",
        icon: "none",
        duration: 1e3
      });
      else if ("" == e.detail.value.exactAddress) wx.showToast({
      title: "请填写详细地址",
      icon: "none",
      duration: 1e3
    });
    else {
      var arr = wx.getStorageSync("addressList") || [],
         name = e.detail.value.name,
         mobile = e.detail.value.mobile,
          defaultAddress = e.detail.value.defaultAddress,
          exactAddress = e.detail.value.exactAddress,
          def = e.detail.value.def
      console.log("arr,{}", arr),
        addressList = {
          name: name,
          mobile: mobile,
          defaultAddress: defaultAddress,
          exactAddress: exactAddress,
          default: def
        }
      if (def == true) {
        if (arr[0].default != undefined) {
          arr[0].default = false
        }
        if (this.data.edit != -1) {
          arr.splice(this.data.edit, 1)
        }
			
        arr.unshift(addressList)
      } else {
        this.data.edit == -1 ? arr.push(addressList) : arr[this.data.edit] = addressList
      }
      try {
        wx.setStorageSync("addressList", arr);
      } catch (e) {}
      wx.showToast({
        title: "保存成功",
        icon: "success",
        duration: 1e3,
        success: function() {
          console.log(addressList)
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            });
          }, 1e3);
        }
      });
    } else wx.showToast({
      title: "手机号码格式不对",
      icon: "none",
      duration: 1e3
    });
  },
  judgeGrant: function() {
    var that = this;
    if (this.data.isLocation == true) {
      wx.chooseLocation({
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        scale: 18,
        success: function(e) {
          console.log(e),
            that.setData({
              defaultAddress: e.name
            })
        }
      })
    } else {
      this.setData({
        modalName: "DialogModal"
      });
    }
  },
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
  getMyLocation: function(t) {
	
    this.setData({
      modalName: null
    });
    var that = this;
    if (t.detail.authSetting["scope.userLocation"]) {
      that.setData({
        isLocation: !0
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
                defaultAddress: t.name
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
  onLoad: function(e) {
    console.log(e.index)
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
      if(e.index!=undefined) {
      var arr= wx.getStorageSync("addressList");
      console.log(arr[e.index]),
   
      this.setData({
        edit: e.index,
        name: arr[e.index].name,
        mobile: arr[e.index].mobile,
        defaultAddress: arr[e.index].defaultAddress,
        exactAddress: arr[e.index].exactAddress,
        default: arr[e.index].default
      });
    }
  }
});