// pages/test/test.js
var pinyin=require('../../utils/pinyin.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    campusNameList: [],
    dynaList: [],
    campusList: [{
      id: 0,
      name: "天津师范大学",
      ename: 'tjnu',
      latitude: 39.0651812870,
      longitude: 117.1239566803
    }, {
      id: 1,
      name: "清华大学",
      ename: 'tsinghua',
      latitude: 40.0033480000,
      longitude: 116.3261920000
    }, {
      id: 2,
      name: "天津工业大学",
      ename: 'tjnu',
      latitude: 39.0661142615,
      longitude: 117.1075630188
    }, {
      id: 3,
      name: "天津理工大学",
      ename: 'tjnu',
      latitude: 39.0606960000,
      longitude: 117.1420980000
    }],
    isShow: 'DialogModal',
    dialogContent: '我将遵循"Take Now跑腿协议",并遵照法律、法规及学校规定，安全快速的送达',
    dialogTitle: '同意用户协议',
    noticeList: [{
        id: 0,
        color: 'blue',
        content: '吕佳平'
      },
      {
        id: 1,
        color: 'white',
        content: '孙诗奇'
      }
    ],
    inputShowed: false,
    inputVal: ""
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });

    var lastList = [];
    if (this.data.campusNameList != []) {
      this.data.campusNameList.forEach((item, index) => {
        for (var attr in item) {
          if (item[attr].indexOf(this.data.inputVal) >= 0) {
            lastList.push({
              'index': index,
              'priority': item[attr].indexOf(this.data.inputVal)
            })
            break;
          }
        }
      })
      this.setData({
        dynaList: lastList.sort(function(a, b) {
          return a.priority - b.priority;
        })
      })
    }
  },
  asd() {
    this.selectComponent('#myTnDialog').showModal();

  },
  /**
   * 生命周期函数--监听页面加载
   */

  consolo() {
    console.log("123");
  },
  onLoad: function(options) {

    //将校区列表中简写和名称提取出来，获取拼音和字母简写，并存在campusNameList中
    if (this.data.campusList != []) {
      const cList = this.data.campusList
      var llList = cList.map(({
        name,
        ename
      }) => {
        let py = pinyin.getPinYin(name, '');
        let pyfc = pinyin.getPinYinFirstCharacter(name);
        return {
          name,
          ename,
          py,
          pyfc
        }
      });
      this.setData({
        campusNameList: llList
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