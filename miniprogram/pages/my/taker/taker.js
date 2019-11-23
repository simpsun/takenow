// pages/my/taker/taker.js
var authList = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkBox: 1,
    authTag: null,
    sec: 2,
    timer: '',
    sImage: "",
    // studentCard_date: '2017-09',
    steps: 3,
    idCard_name: "",
    idCard_code: "",
    idCard_gender: 0,
    studentCard_code: "",
    studentCard_schoolId: null,
    studentCard_schoolName: null,
    studentCard_faculty: "",
    // studentCard_major: "",
    numList: [{
      name: '阅读需知'
    }, {
      name: '实名认证'
    }, {
      name: '学生认证'
    }, {
      name: '手机认证'
    }],

    num: 0,
  },
  tap: function(e) {
    console.log(e)
  },
  radioChange: function(e) {
    console.log(e)
    this.setData({
      idCard_gender: e.detail.value
    })
    console.log("更新性别信息成功")
  },

  Blur(e) {
    var that = this
    switch (e.currentTarget.dataset.update) {
      case "0":
        that.setData({
          idCard_name: e.detail.value
        })
        console.log("更新姓名成功")
        break;

      case "1":
        that.setData({
          idCard_code: e.detail.value
        })
        console.log("更新身份证号成功")
        break;
      case "2":
        that.setData({
          studentCard_schoolName: e.detail.value
        })
        console.log("更新学校成功")
        break;
      case "3":
        that.setData({
          studentCard_schoolId: e.detail.value
        })
        console.log("更新学号成功")
        break;
      case "4":
        that.setData({
          studentCard_faculty: e.detail.value
        })
        console.log("更新学院成功")
        break;


    }


  },

  nextStep: function() {

    switch (this.data.steps) {
      case 0:
        if (this.data.sec > 5) {
          wx.showToast({
            title: "认真读一读吧~",
            icon: "none",
            duration: 1e3
          })
        } else if (this.data.sec > 0) {
          wx.showToast({
            title: "再坚持一下~挺住",
            icon: "none",
            duration: 1e3
          })
        } else if (this.data.checkBox == 0) {
          wx.showToast({
            title: "请阅读并勾选跑腿协议",
            icon: "none",
            duration: 1e3
          })
        } else {
          this.setData({
            steps: this.data.steps + 1
          })
        }
        break;
      case 1:
        if (this.data.idCard_name == "") {
          wx.showToast({
            title: "名字不能为空哦~",
            icon: "none",
            duration: 1e3
          })
        } else if (this.data.idCard_gender == 0) {
          wx.showToast({
            title: "受累选一下性别~",
            icon: "none",
            duration: 1e3
          })
        } else if (this.data.idCard_code == '') {

          wx.showToast({
            title: "身份证号别忘啦~ps:我们不会告诉别人的",
            icon: "none",
            duration: 1e3
          })
        } else if (this.data.idCard_code.length < 17 || this.data.idCard_code.length > 18) {
          wx.showToast({
            title: "身份证号格式不对(⊙o⊙)",
            icon: "none",
            duration: 1e3
          })
        } else {
          this.setData({
            steps: this.data.steps + 1
          })
        }
        break;
      case 2:

        if (!!!this.data.studentCard_schoolName) {
          console.log(!!!this.data.studentCard_schoolName)
          wx.showToast({
            title: "学校不能为空哦~",
            icon: "none",
            duration: 1e3
          })
        } else if (!!!this.data.studentCard_schoolId) {
          wx.showToast({
            title: "忘了填学号啦~",
            icon: "none",
            duration: 1e3
          })
        } else if (!!!this.data.studentCard_faculty) {

          wx.showToast({
            title: "学院填一下吧~",
            icon: "none",
            duration: 1e3
          })
        } else if (!!!this.data.sImage) {
          wx.showToast({
            title: "记得上传证件哦(⊙o⊙)",
            icon: "none",
            duration: 1e3
          })
        } else {
          this.setData({
            steps: this.data.steps + 1
          })
        }
        break;
      case 3:
        authList = {
          idCard_name: this.data.idCard_name,
          idCard_code: this.data.idCard_code,
          idCard_gender: this.data.idCard_gender,
          studentCard_schoolId: this.data.studentCard_schoolId,
          studentCard_schoolName: this.data.studentCard_schoolName,
          studentCard_faculty: this.data.studentCard_faculty,
          // studentCard_major: this.data.studentCard_major,
          // studentCard_date: this.data.studentCard_date,
          sImage: this.data.sImage
        }
        wx.setStorageSync("authList", authList)
        this.setData({
          steps: this.data.steps + 1
        })
        console.log(authList)
        break;
    }
  },
  lastStep: function() {
    this.setData({
      steps: this.data.steps - 1
    })

  },

  chooseImg() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          sImage: res.tempFilePaths
        })
      }
    })

  },
  DelImg(e) {
    wx.showModal({
      title: '尊敬的用户',
      content: '确定要删除证件照吗？',
      cancelText: '点错啦',
      confirmText: '给我删',
      confirmColor: '#F6275C',
      success: res => {
        if (res.confirm) {
          this.setData({
            sImage: ""
          })
        }
      }
    })
  },
  checkboxChange(e) {
    if (e.detail.value != "aRead")
      this.setData({
        checkBox: 0
      })
    else
      this.setData({
        checkBox: 1
      })
  },
  /**
   * 
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      authTag: wx.getStorageSync("authList") || null
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    console.log(new Date())
    this.setData({
      timer: setInterval(function() {
        that.setData({
          sec: that.data.sec - 1
        })
        if (that.data.sec == 0) {
          // 读秒结束 清空计时器
          clearInterval(that.data.timer)
        }
      }, 1000)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
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
//  else if (!!!this.data.studentCard_major) {
//   wx.showToast({
//     title: "专业也要填呃(⊙o⊙)",
//     icon: "none",
//     duration: 1e3
//   })
// }