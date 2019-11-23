// pages/graborder/graborder.js
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nomore: false,
    orderAttr: 'create_time', // 按照什么排序
    list: [],
    genderLimitList: ['限女生', '限男生', '不限性别'],
    //  抢单列表
    grabOrderList: [],
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
      avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg',
      name: '王安',
      college:'软件学院',
      reward: '580'
    }, {
      id: 1,
        avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg',
      name: '李伟',
        college: '管理学院',
      reward: '499'
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
    const my_open_id = app.globalData.openid;
    const user_open_id = e.currentTarget.dataset.order_open_id;
    const id = e.currentTarget.dataset.orderid;
    // 检验是否自己下的订单
    if (my_open_id != user_open_id) {
      wx.navigateTo({
        url: `itemOrderInfo/itemOrderInfo?orderid=${id}`,
      })
    } else {
      wx.showToast({
        title: '不能抢自己发布的订单',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onFilterBarBtn(e) {
    const index = e.currentTarget.dataset.findex
    const before_index = this.data.selectedFilterBtn
    this.setData({
      selectedFilterBtn: this.data.selectedFilterBtn == index ? -1 : index
    })
    if (before_index != index) {
      switch (index) {

        case 0:
          break;
        case 1:
          break;
        case 2:
          this.setData({
            orderAttr: 'deliverCost'
          })
          this.getList();
          break;
      }
    } else {
      this.setData({

        orderAttr: 'create_time'

      })
      this.getList();
    }
  },
  rewardBarNav() {
    wx.navigateTo({
      url: '../../pages/my/taker/taker'
    })
  },
  // 我能接的
  filterICan() {
    return new Promise((resolve, reject) => {
      if (this.data.isFilterIcan) {
        var newList = [];
        if (this.data.list != []) {
          // 筛选出性别为我的性别或者不限性别的且未接单的订单 且不是我发布的订单
          this.data.list.forEach(item => {
            if ((item.genderLimit == this.data.gender || item.genderLimit == 2) && item.status == 0 && (item.user_openId != app.globalData.openid)) {
              newList.push(item)
            }
          })
        }
        this.setData({
          list: newList
        })
        resolve();
        // 将筛选的数据提取出来并渲染到页面
      }
      resolve();
    })
  },
  // 筛选我能接的单
  onFilterIcan() {
    this.setData({
      isFilterIcan: !this.data.isFilterIcan
    })
    this.filterICan().then(res => {
      this.dealData()
    });
    if (!this.data.isFilterIcan) {
      // 如果取消按钮,执行刷新页面
      this.getList();
    }
  },
  //   db.collection('tn_order').where({
  //     status: 0,
  //     gender:this.data.gender || '不限性别',
  //     nearCampus: this.data.nearCampus,
  //     orderLife: _.gt(new Date().getTime()),
  //   }).orderBy('create_time', 'desc').limit(20).get()
  // 

  // 获取数据库最新数据
  getList() {
    let that = this;
    db.collection('tn_order').where({
      status: 0,
      nearCampus: this.data.nearCampus,
      orderLife: _.gt(new Date().getTime()),
    }).orderBy(`${this.data.orderAttr}`, 'desc').limit(20).get().then(res => {
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
      console.log('订单信息提取中···')
      this.dealData();
    })
  },
  dealData() {
    var orderList = this.data.list.map((item, index) => {
      return {
        id: index,
        orderID: item.orderID,
        orderGoodInfo: item.goodsInfo,
        orderGoodSort: item.type,
        orderReleaseTime: util.commentTimeHandle(item.create_time),
        orderDeliverTime: item.genderLimit,
        orderReward: item.deliverCost,
        orderStatus: item.status,
        orderGoodSort: item.type,
        userOpenId: item.user_openId
      }
    })
    this.setData({
      grabOrderList: orderList
    })
  },
  more() {
    let that = this;
    if (that.data.nomore || ((that.data.list.length < 20) && (!this.data.isFilterIcan))) {
      wx.hideLoading();
      wx.showToast({
        title: '别拉了,到底啦φ(>ω<*) ',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    let page = that.data.page + 1;

    db.collection('tn_order').where({
      status: 0,
      nearCampus: this.data.nearCampus,
      orderLife: _.gt(new Date().getTime())
    }).orderBy(`${this.data.orderAttr}`, 'desc').skip(page * 20).limit(20).get().then(
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
            list: [...that.data.list, ...res.data]
          })
        })
      }).catch(res => {
      wx.showToast({
        title: '获取失败',
        icon: 'none'
      })
    }).then(res => {
      this.filterICan().then(res => {
        this.dealData()
      });
    })
  },
  // ------------------------------------------------------------生命周期函数-----------------------------------------------------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    db.collection('tn_user').get().then(res => {
      console.log(res)
      this.setData({
        gender: res.data[0].wxUserInfo.gender,
        nearCampus: res.data[0].nearCampus
      })
    }).catch(res => {
      console.log(res)
    }).then(res => {
      this.getList()
    });
  },
  onPullDownRefresh: function() {
    this.setData({
      selectedFilterBtn: -1,
      isFilterIcan: false
    })
    this.getList()
  },
  onReachBottom() {
    wx.showLoading({
      title: '加载数据中···',
    })
    this.more()
  }
})





// {
//   id: 0,
//     orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
//       orderGoodSort: 2,
//         orderReleaseTime: '一小时前',
//           orderDeliverTime: '即刻送达',
//             orderReward: 25,
//               orderStatus: 0
// }, {
//   id: 1,
//     orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
//       orderGoodSort: 0,
//         orderReleaseTime: '20分钟前前',
//           orderDeliverTime: '即刻送达',
//             orderReward: 0.25,
//               orderStatus: 2
// }, {
//   id: 2,
//     orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
//       orderGoodSort: 1,
//         orderReleaseTime: '1年前',
//           orderDeliverTime: '即刻送达',
//             orderReward: 2.5,
//               orderStatus: 0
// }, {
//   id: 3,
//     orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
//       orderGoodSort: 2,
//         orderReleaseTime: '2分钟前',
//           orderDeliverTime: '即刻送达',
//             orderReward: 25,
//               orderStatus: 1
// }, {
//   id: 4,
//     orderGoodInfo: '【菜鸟驿站】您的申通包裹已到天津师范大学一食堂旁菜鸟驿站了，请20:00前凭23-4-1004及时取，询18526227847',
//       orderGoodSort: 3,
//         orderReleaseTime: '4小时前',
//           orderDeliverTime: '明天14:20',
//             orderReward: 445,
//               orderStatus: 2
// }, {
//   id: 5,
//     orderGoodInfo: '【菜0前凭23-4-1004及时取，询18526227847',
//       orderGoodSort: 1,
//         orderReleaseTime: '一小时前',
//           orderDeliverTime: '即刻送达',
//             orderReward: 25,
//               orderStatus: 0
// }]


// this.setData({
//   grabOrderList: this.data.grabOrderList.sort(function(a, b) {
//     return b.orderReward - a.orderReward;
//   })
// });