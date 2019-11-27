// pages/my/taker/taker.js
var authList = null
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFocusId: false,
    checkBox: 1,
    authTag: null,
    sec: 2,
    timer: '',
    sImage: "",
    steps: 0,
    idCard_name: "",
    idCard_code: "",
    idCard_gender: 0,
    studentCard_code: "",
    studentCard_schoolId: null,
    nearCampus: null,
    studentCard_faculty: "",
    code: '',
    phone: '',
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
  navGrab() {
    wx.switchTab({
      url: '../../../pages/graborder/graborder',
    })
  },
  focusID() {
    this.setData({
      isFocusId: true
    })
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
          nearCampus: e.detail.value
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
      case "5":
        that.setData({
          phone: e.detail.value
        })
        console.log("更新手机号成功")
        break;
      case "6":
        that.setData({
          code: e.detail.value
        })
        console.log("更新验证码成功")
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
            title: "认真读一读吧~",
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
        this.setData({
          isFocusId: false
        })
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

        if (this.data.nearCampus == '定位失败') {
          console.log(!!!this.data.nearCampus)
          wx.showToast({
            title: "没选学校呀~",
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
        if (!!!this.data.phone) {
          wx.showToast({
            title: "手机号不能为空~",
            icon: "none",
            duration: 1e3
          })
          return
        } else if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(this.data.phone))) {
          wx.showToast({
            title: "手机号格式不对~",
            icon: "none",
            duration: 1e3
          })
          return
        } else if (!!!this.data.code) {
          wx.showToast({
            title: "验证码不能为空~",
            icon: "none",
            duration: 1e3
          })
          return
        }

        authList = {
          idCard_name: this.data.idCard_name,
          idCard_code: this.data.idCard_code,
          idCard_gender: this.data.idCard_gender,
          studentCard_schoolId: this.data.studentCard_schoolId,
          nearCampus: this.data.nearCampus,
          studentCard_faculty: this.data.studentCard_faculty,
          // studentCard_major: this.data.studentCard_major,
          // studentCard_date: this.data.studentCard_date,
          sImage: this.data.sImage,
          code: this.data.code,
          phone: this.data.phone,
          openid: app.globalData.openid
        }
        wx.showLoading({
          title: '提交中',
        })
        wx.cloud.callFunction({
          name: 'add_taker',
          data: {
            authList: authList
          }
        }).then(res => {
          console.log('信息提交成功')
          wx.hideLoading()
          this.setData({
            steps: this.data.steps + 1
          })
        }).catch(res => {
          wx.hideLoading()
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 2000
          })
        })


        break;
    }
  },
  //验证码生成
  randomCode() {
    this.setData({
      code: Math.floor(Math.random() * 9999 + 1000)
    })
  },
  lastStep: function() {
    this.setData({
      steps: this.data.steps - 1
    })

  },
  // 选择学校
  chooseCampus() {
    wx.navigateTo({
      url: `../../campus/campus?nearCampus=${this.data.nearCampus}`,
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
      confirmColor: '#5a87f7',
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
  /**
   * 
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.showLoading({
      title: '加载中···',
    })
    await wx.cloud.callFunction({
      name: 'query_taker',
      data: {
        openid: app.globalData.openid
      }
    }).then(res=>{
      wx.hideLoading()
      console.log('查询Taker',res)
      if(res.result.data.length==1){
        this.setData({
          steps:4
        })
      }
      else if (res.result.data.length == 0){

      }
      else{
        this.showToastAndBack('信息异常，请联系客服')
      }
    })
   await this.setData({
      authTag: wx.getStorageSync("authList") || null
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
 
    var that = this
    this.setData({
      nearCampus: app.globalData.nearCampus,
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