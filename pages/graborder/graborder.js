// pages/graborder/graborder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    const id=e.currentTarget.dataset.orderid;
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
  // 筛选我能接的单
  onFilterIcan() {
    this.setData({
      isFilterIcan: !this.data.isFilterIcan
    })
  },
  // ------------------------------------------------------------生命周期函数-----------------------------------------------------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onPullDownRefresh: function() {
    wx.request({
      url: 'test',
      data: {},
      method: 'GET',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {
        wx.stopPullDownRefresh();
      }
    })
  }


})