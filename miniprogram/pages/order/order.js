// pages/order/order.js
const db = wx.cloud.database()
var DATA = require("../../tn_config.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nomore: false,
    releaseList: [],
    deliveryList: [],
    statusColorList: ['orange', 'tnRed', 'tnRed', 'grey', 'pink', 'grey', 'orange', 'orange'],
    statusList: [],
    TabCur: 0, //订单类型
    scrollLeft: 0,
    Tabs: [{
        index: 0,
        name: '我发布的'
      },
      {
        index: 1,
        name: '我跑腿的'
      }
    ]
  },
  tabSelect(e) {
    this.setData({
      nomore:false,
      page:0,
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    e.currentTarget.dataset.id == 0 ? this.queryReleaseList():this.queryDeliveryList
  },
  navOrder(e) {
    const id = e.currentTarget.dataset.id;
    let page = this.data.TabCur ? 'itemOrderInfo' : 'listOrderInfo';
    wx.navigateTo({
      url: `../../pages/graborder/itemOrderInfo/${page}?id=${id}`,
    })
  },
  // 查询我发布的订单
  queryReleaseList() {
    //查询我发布的订单
    wx.cloud.callFunction({
        name: 'sys_expire_order',
        data: {}
      }),
      db.collection('tn_order').where({
        user_openId: this.data.my_open_id
      }).orderBy('create_time', 'desc').limit(20).get().then(res => {
        console.log("我发布的订单列表", res.data);
        if (res.data.length == 0) {
          this.setData({
            nomore: true,
            releaseList: [],
          })
        }
        if (res.data.length < 20) {
          this.setData({
            nomore: true,
            page: 0,
            releaseList: res.data,
          })
        } else {
          this.setData({
            page: 0,
            releaseList: res.data,
            nomore: false,
          })
        }

      }).catch(res => {
        console.log('error', res)
        wx.showToast({
          title: '网络异常,请稍后再试',
          icon: 'none',
          duration: 2000
        })
      })
    wx.stopPullDownRefresh();
  },
  queryDeliveryList() {

    db.collection('tn_order').where({
      taker_open_id: this.data.my_open_id,

    }).orderBy('grab_time', 'desc').limit(20).get().then(res => {
      console.log("我跑腿的订单列表", res.data);
      if (res.data.length == 0) {
        this.setData({
          nomore: true,
          deliveryList: [],
        })
      }
      if (res.data.length < 20) {
        this.setData({
          nomore: true,
          page: 0,
          deliveryList: res.data,
        })
      } else {
        this.setData({
          page: 0,
          deliveryList: res.data,
          nomore: false,
        })
      }
    }).catch(res => {
      wx.showToast({
        title: '网络异常,请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
    wx.stopPullDownRefresh();
  },
  more() {
    let that = this
    let listType = this.data.TabCur == 0 ? this.data.releaseList : this.data.deliveryList
    if (that.data.nomore || ((listType.length < 20))) {
      wx.hideLoading();
      wx.showToast({
        title: '别拉了,到底啦φ(>ω<*) ',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let page = (this.data.TabCur == 0 ? that.data.page : that.data.page) + 1;
    let openid = this.data.TabCur == 0 ? {
      user_openId: this.data.my_open_id
    } : {
      taker_open_id: this.data.taker_open_id
    }
    let timeType = this.data.TabCur == 0 ? 'create_time' : 'grab_time'
   
    db.collection('tn_order').where(openid).orderBy(timeType, 'desc').skip(page * 20).limit(20).get().then(
      res => {
        return new Promise((resolve, reject) => {
          console.log('触底更新数据成功', res)
          wx.hideLoading();
          resolve();
          if (res.data.length == 0) {
            this.setData({
              nomore: true
            })
            return false;
          }
          if (res.data.length < 20) {
            this.setData({
              nomore: true
            })
          }
          let listTypeJson = this.data.TabCur == 0 ? {
            page: page,
            releaseList: [...this.data.releaseList, ...res.data]
          } : {
              page: page,
              deliveryList: [...this.data.deliveryList, ...res.data]
            }
            console.log(listTypeJson)
          this.setData(listTypeJson)
     
          console.log('最新列表',listType)
        })
      }).catch(res => {
      wx.showToast({
        title: '获取失败',
        icon: 'none'
      })
    })
  },
  /**
   * ---------------------------------------------------------生命周期函数--监听页面加载-------------------------------------
   */
  async onLoad(options) {
    await this.setData({
      statusList: DATA.data.statusList,
      my_open_id: app.globalData.openid
    })
    if (options.e != undefined) {
      var that = this;
      that.setData({
        TabCur: options.TabCur
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.queryReleaseList();
    this.queryDeliveryList();
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
    this.queryReleaseList();
    this.queryDeliveryList();

  },
  onReachBottom() {
    wx.showLoading({
      title: '加载数据中···',
    })
    this.more()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})