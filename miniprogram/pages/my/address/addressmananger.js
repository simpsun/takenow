var addressList = null;
var app = getApp();
Page({
  data: {
    nearCampus: "",
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
      if ("" == e.detail.value.nearCampus) wx.showToast({
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
        nearCampus = e.detail.value.nearCampus,
        exactAddress = e.detail.value.exactAddress,
        def = e.detail.value.def
      console.log("arr,{}", arr),
        addressList = {
          name: name,
          mobile: mobile,
          nearCampus: nearCampus,
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
    wx.navigateTo({
      url: `../../campus/campus?nearCampus=${this.data.nearCampus}`,
    })
  },

  onLoad: function(e) {
    console.log(app.globalData.nearCampus)
    this.setData({
      nearCampus: app.globalData.nearCampus
    })
    var that = this;
    if (e.index != undefined) {
      var arr = wx.getStorageSync("addressList");
      console.log(arr[e.index])
      this.setData({
        edit: e.index,
        name: arr[e.index].name,
        mobile: arr[e.index].mobile,
        nearCampus: arr[e.index].nearCampus,
        exactAddress: arr[e.index].exactAddress,
        default: arr[e.index].default
      });
    }
  }
});