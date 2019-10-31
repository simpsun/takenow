const WeValidator = require('../../utils/we-validator.js');
const app = getApp();
const db = wx.cloud.database();
Page({
  data: {

    wxUserInfo: null,
    isAgree: false, //是否同意用户协议
    checkboxItems: [{
        name: 'standard is dealt for u.',
        value: '0',
        checked: true
      },
      {
        name: 'standard is dealicient for u.',
        value: '1'
      }
    ],
    userInfo: ['name', 'stuID', 'campus', 'phone', ],
    showDialog: true,
    nearCampus: '',
  },

  selectCampus() {
    wx.navigateTo({
      url: '../../pages/campus/campus',
    })
  },
  bindAgreeChange: function(e) {
    console.log(e)
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  openDialog: function() {
    this.setData({
      istrue: true
    })
  },
  closeDialog: function() {
    this.setData({
      istrue: false
    })
  },
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      var currentUserInfo = {
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        gender: e.detail.userInfo.gender,
        province: e.detail.userInfo.province,
        city: e.detail.userInfo.city,
        country: e.detail.userInfo.country
      }
    } else {
      console.log("用户授权失败！！！")

    }
    this.setData({
      wxUserInfo: currentUserInfo != undefined ? currentUserInfo : null,
      istrue: false
    })
  },
  submitUserInfo(e) {
    console.log(e)
    let {
      value
    } = e.detail

    console.log(value)
    if (!this.validatorInstance.checkData(value)) return
    if (this.data.isAgree) {
      // 开始提交表单
      wx.showLoading({
        title: '正在提交···',
      })


      db.collection('tn_user').add({
        data: {
          name: value.name,
          nearCampus: value.nearCampus,
          create_time: db.serverDate(),
          stuId: value.stuId,
          phone: value.phone,
          wxUserInfo: this.data.wxUserInfo,
          isTaker: false
        }
      }).then(res => {
        wx.cloud.callFunction({
          name: 'create_account'}).then(res => {
            console.log("创建账户成功：", res)
          }).catch(res=>{
            wx.showToast({
              title: '创建失败，请及时反馈或稍后再试',
              icon: 'none',
              duration:2000
            })
          }) 
        return db.collection('tn_user').doc(res._id).get()
      }).then(res => {
        app.globalData.userInfo = res.data;
        app.globalData.openid = res.data._openid;
        wx.navigateBack({})
      }).catch(res => {
        wx.hideLoading();
        wx.showToast({
          title: '注册失败，请重新提交',
          icon: 'none',
        })
      })



    } else {
      wx.showToast({
        title: '请阅读并同意用户协议',
        icon: 'none',
        duration: 2000
      })
    }
  },
  initValidator() {
    this.validatorInstance = new WeValidator({
      rules: {
        name: {
          required: true
        },
        nearCampus: {
          required: true
        },
        stuId: {
          required: true
        },
        phone: {
          required: true,
          mobile: true
        }
      },
      messages: {
        name: {
          required: '请输入用户名'
        },
        nearCampus: {
          required: '请选择校区'
        },
        stuId: {
          required: '请输入学号'
        },
        phone: {
          required: '请输入手机号',
          mobile: '手机号格式不正确'
        }
      },
    })
  },
  // ---------------------------------------------生命周期函数----------------------------------------------
  onShow() {

  },

  onReady() {
    this.initValidator();
  },
  onLoad() {
    this.setData({
      istrue: true,
      nearCampus: app.globalData.nearCampus
    })
  },
});