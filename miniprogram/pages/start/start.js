const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 3,
  },
  onLoad() {
    this.getimg();
    this.countDown();
    // 获取用户信息
    // this.getuserdetail();
  },
  onUnload() {
    clearInterval();
  },
  go() {
    wx.switchTab({
      url: '/pages/index/index',
    })
    clearInterval(this.interval)
  },

  countDown: function() {
    let that = this;
    let total = 3;
    this.interval = setInterval(function() {
      total > 0 && (total--, that.setData({
        count: total
      })), 0 === total && (that.setData({
        count: total
      }), wx.switchTab({
        url: "/pages/index/index"
      }), clearInterval(that.interval));
    }, 1e3);
  },
  //为了数据安全可靠，每次进入获取一次用户信息
  getuserdetail() {
    if (!app.openid) {
      wx.cloud.callFunction({
        name: 'regist', // 对应云函数名
        data: {
          $url: "getid", //云函数路由参数
        },
        success: re => {
          db.collection('user').where({
            _openid: re.result
          }).get({
            success: function(res) {
              if (res.data.length !== 0) {
                app.openid = re.result;
                app.userinfo = res.data[0];
                console.log(app)
              }
              console.log(res)
            }
          })
        }
      })
    }
  },
  //获取背景图
  getimg() {
    let that = this;
    // db.collection('start').where({}).get({
    //       success: function (res) {
    //             console.log(res)
    //             that.setData({
    //                   bgurl: res.data[0].url
    //             })
    //       },
    //       fail(){
    //             that.setData({
    //                   bgurl: bgurl,
    //             })
    //       }
    // })
    that.setData({
      // bgurl: '../../images/startBg.jpg'
      bgurl: '../../images/bg.png'
    })
  },
})