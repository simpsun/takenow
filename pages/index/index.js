// pages/newindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    demandInfo: "",
    location: 0,
    ColorList: ['放楼下就行', '999感冒颗粒', '尽快送达', '配送注意安全', '谢谢', '煎饼果子'],
    funcList: ['帮我买', '帮我送', '领包裹', '全能超人'],
    funcImgSrc: '../../images/index/func'
  },

  // -------- 事件响应函数--------

  // 切换功能
  selectFunc(e) {
    let index = e.currentTarget.dataset.index;
    if (index == 3) {
      index++;
      wx.navigateTo({
        url: '2',
      })
    }
    this.setData({
      location: index
    })
  },
  // 快捷标签输入
  quickTag(e) {
    console.log(e);
    const tag = e.currentTarget.dataset.text;
    this.setData({
      demandInfo: this.data.demandInfo + " "+tag
    })
  },
  // 文本框输入监听
  demandInfoInput(e) {
    const value = e.detail.value;
    this.setData({
      demandInfo: value
    })
  },
submitFormInfo(e){
console.log(e);
  const goodsInfo=e.detail.value.demandInfo;
  wx.navigateTo({
    url: `./takeNow?goodsInfo=${goodsInfo}`
  })
}
})