// pages/graborder/graborder.js
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nomore: false,
    list: [],
    //  抢单列表
    grabOrderList: [{
      id: 0,
      orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
      orderGoodSort: 2,
      orderReleaseTime: '一小时前',
      orderDeliverTime: '即刻送达',
      orderReward: 25,
      orderStatus: 0
    }, {
      id: 1,
      orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
      orderGoodSort: 0,
      orderReleaseTime: '20分钟前前',
      orderDeliverTime: '即刻送达',
      orderReward: 0.25,
      orderStatus: 2
    }, {
      id: 2,
      orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
      orderGoodSort: 1,
      orderReleaseTime: '1年前',
      orderDeliverTime: '即刻送达',
      orderReward: 2.5,
      orderStatus: 0
    }, {
      id: 3,
      orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
      orderGoodSort: 2,
      orderReleaseTime: '2分钟前',
      orderDeliverTime: '即刻送达',
      orderReward: 25,
      orderStatus: 1
    }, {
      id: 4,
      orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
      orderGoodSort: 3,
      orderReleaseTime: '4小时前',
      orderDeliverTime: '明天14:20',
      orderReward: 445,
      orderStatus: 2
    }, {
      id: 5,
      orderGoodInfo: '【菜0前凭23-4-1004及时取，询18526227847',
      orderGoodSort: 1,
      orderReleaseTime: '一小时前',
      orderDeliverTime: '即刻送达',
      orderReward: 25,
      orderStatus: 0
    }],
    // 配送分类Tag列表
    grabOrderGoodSortList: [{
        id: 0,
        name: '帮我买',
        color: 'pink'
      }, {
        id: 1,
        name: '帮我送',
        color: 'yellow'
      },
      {
        id: 2,
        name: '领包裹',
        color: 'blue'
      }, {
        id: 3,
        name: '全能',
        color: 'purple'
      }
    ],

    // 抢单订单状态
    grabOrderStatusList: [{
      id: 0,
      name: '未接单',
      color: 'orange',
    }, {
      id: 1,
      name: '已接单',
      color: 'tnRed',
    }, {
      id: 2,
      name: '已完成',
      color: 'grey',
    }],
    // 是否通过跑腿认证
    isAuthenticate: 0,
    rewardHunterList: [{
      id: 0,
      avatar: '',
      name: '',
      reward: ''
    }, {
      id: 1,
      avatar: '',
      name: '',
      reward: ''
    }],
    loadmore() {
      console.log('loadmore')
    },
    isFilterIcan: false,
    filterBarList: [{
        value: '最新',
        id: 0
      },
      {
        value: '距离',
        id: 1
      },
      {
        value: '赏金',
        id: 2
      }
    ]
  },
  // 跳转至抢单页面
  navigateGrabOrder(e) {
    console.log(e);
    const id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `itemOrderInfo/itemOrderInfo?id=${id}`,
    })
  },

  onFilterBarBtn(e) {
    const index = e.currentTarget.dataset.findex

    this.setData({
      selectedFilterBtn: this.data.selectedFilterBtn == index ? -1 : index
    })
    switch (index) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        this.setData({
          grabOrderList: this.data.grabOrderList.sort(function(a, b) {
            return a.orderReward - b.orderReward;
          })
        });
        break;
    }
  },
  rewardBarNav() {
    wx.navigateTo({
      url: '../..'
    })
  },
  // 筛选我能接的单
  onFilterIcan() {
    this.setData({
      isFilterIcan: !this.data.isFilterIcan
    })
  },

  getList() {
    let that = this;
    db.collection('tn_order').where({
      status: 0,
      orderLife: _.gt(new Date().getTime()),
    }).orderBy('create_time', 'asc').limit(20).get().then(res => {
      return new Promise((resolve, reject) => {
        console.log('当前列表：', res)
        resolve();
        wx.stopPullDownRefresh(); //暂停刷新动作
        if (res.data.length == 0) {
          that.setData({
            nomore: true,
            list: [],
          })
          return false;
        }
        if (res.data.length < 20) {
          that.setData({
            nomore: true,
            page: 0,
            list: res.data,
          })
        } else {
          that.setData({
            page: 0,
            list: res.data,
            nomore: false,
          })
        }
      })
    }).then(res => {
      console.log('处理数据')
      this.dealData();
    })
  },
  dealData() {
    var orderList = this.data.list.map((item, index) => {
      return {
        id: index,
        orderGoodInfo: item.goodsInfo,
        orderGoodSort: item.type,
        orderReleaseTime: util.commentTimeHandle(item.create_time),
        orderDeliverTime: item.genderLimit,
        orderReward: item.deliverCost,
        orderStatus: item.status,
        orderGoodSort: item.type
      }
    })
    this.setData({
      grabOrderList: orderList
    })
  },
  more() {
    let that = this;
    if (that.data.nomore || that.data.list.length < 20) {
      wx.hideLoading();
      wx.showToast({
        title: '别拉了,到底啦φ(>ω<*) ',
        icon:'none',
        duration:2000
      })
      return false
    }
    let page = that.data.page + 1;
    db.collection('tn_order').where({
      status: 0,
      orderLife: _.gt(new Date().getTime())
    }).orderBy('creat_time', 'asc').skip(page * 20).limit(20).get().then(
      res => {
        return new Promise((resolve, reject) => {
          console.log('触底更新数据成功', res)
          wx.hideLoading();
          resolve();
          if (res.data.length == 0) {
            that.setData({
              nomore: true
            })
            return false;
          }
          if (res.data.length < 20) {
            that.setData({
              nomore: true
            })
          }
          that.setData({
            page: page,
            list: [...that.data.list,...res.data]
          })
        })
      }).catch(res => {
      wx.showToast({
        title: '获取失败',
        icon: 'none'
      })
    }).then(res=>{
      this.dealData();
    })
  },
  // ------------------------------------------------------------生命周期函数-----------------------------------------------------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();
  },
  onPullDownRefresh: function() {
    this.getList()
  },
  onReachBottom() {
    wx.showLoading({
      title: '加载数据中···',
    })
    this.more()
  }
})