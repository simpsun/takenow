// components/tnDialog/tnDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  title: { // 属性名
      type: String,
      value: ''
    },
    details: { // 属性名
      type: String,
      value: ''
    },
    isLocation: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal: function () {
      console.log("打开窗口")
      this.setData({
        modalName: 'DialogModal'
      });
    },
    hideModal: function () {
      this.setData({
        modalName: null
      });
    },
    onConfirm(t){
      this.triggerEvent('customEvent', t);
      this.hideModal();
    }
  },
  options: {
    addGlobalClass: true,
  }
})
