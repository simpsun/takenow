Page({

  data: {
    isGrabOrderSliderBar: true,

  },
  // ----------------------------------------------------------事件响应函数------------------------------------------------
  myEventListener: function(e) {
    //获取到组件的返回值，并将其打印
    console.log('是否验证通过:' + e.detail.msg)
    if (e.detail.msg) {
      this.loadModal().then(res => {
        console.log(res);
        this.handleRequestResult(res);
      })
    };
    //request，并返回请求结果requestResult
    /* requestResult: S666  successedGrabOrder
                      E101  networkError
                      E102  orderError
                      E103  failedGrabOrderFailed
                      E104  otherError
     */
    //  var requestResult = ['S666', 'E101', 'E102', 'E103', 'E104']



    // this.mySlider.resetSlider();
    // 1.检验网络是否通畅
    // 2.弹出同意协议窗口
    // this.setData({
    //   modalName: e.detail.msg ? 'DialogModal':null
    // })

  },
  // ----------------请求结果处理--------------
  handleRequestResult(res) {
    switch (res) {
      //请求成功弹出窗口
      case 'S666':
        this.setData({
          modalName:'DialogModal'
        })
        break;
      case 'E101':
        wx.showToast({
          title: "E101网络异常，请检查网络后重新提交",
          icon: "none",
          duration: 2e3
        });
        this.mySlider.resetSlider();
        break;
      case 'E102':
        wx.showToast({
          title: "E101订单异常，请稍后再试",
          icon: "none",
          duration: 3000
        });
        this.mySlider.resetSlider();
        break;
      case 'E103':
        wx.showToast({
          title: "抢单失败，您被别人抢先了。可以看看其他订单哦",
          icon: "none",
          duration: 2e3,
          complete:()=>{
            setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })},2000)
          }
        });
      
        this.mySlider.resetSlider();
        break;
      case 'E104':
        wx.showToast({
          title: "E104未知异常，请联系管理员解决",
          icon: "none",
          duration: 2e3
        });
        this.mySlider.resetSlider();
        break;
    }

  },
  //  -----------加载中-----------

  loadModal: function() {
    var p = new Promise((resolve, reject) => {
      this.setData({
        loadModal: true
      })
      setTimeout(() => {
        this.setData({
          loadModal: false
        })
        resolve('E103')
      }, 2000)
    })
    return p;
  },

  //   loadModal(callback) {
  //     this.setData({
  //       loadModal: true
  //     })

  //     setTimeout(() => {
  //       this.setData({
  //         loadModal: false
  //       })
  //     }, 2000)
  // var ljp='S666'
  //   callback(ljp);
  //   },
  showModal: function(t) {
    this.setData({
      modalName: t.currentTarget.dataset.target
    });
  },
  hideModal: function(t) {
    this.setData({
      modalName: null
    });
  },
  changeBottomBar() {
    this.setData({
      isGrabOrderSliderBar: false
    })

    this.hideModal();
    wx.showToast({
      title: "抢单成功",
      icon: "success",
      duration: 2e3
    });
  },

  // ----------------------------------------------------------生命周期函数------------------------------------------------
  /* 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mySlider = this.selectComponent('#mySlider')
  },
  onLoad: function (options) {
 console.log(options);
  }
})