var data = {
  weightList: ['小于1Kg', '1Kg~2kg', '2Kg~3Kg', '3Kg~4Kg', '4Kg~5Kg', '5Kg~10Kg', '10Kg~20Kg', '20Kg~30Kg', '30Kg~50Kg', '50Kg以上'],
  orderLifeList: ['30分钟', '1小时', '2小时', '3小时', '4小时', '5小时', '7小时', '10小时', '15小时', '20小时', '24小时', '48小时', '一周'],
  statusList: ['未接单', '待送达', '待收货', '已过期', '未支付', '已取消', '退款中', '等待确认', '已完成', '用户申请取消','Taker同意取消订单'],
  timeTextList:{
    create_time: "用户提交订单",
    pay_time: "用户付款成功",
    grab_time: "Taker抢单成功",
    expire_time:"订单已过期",
    user_apply_cancel_time:'用户申请取消',
    taker_confirm_cancel_time: "Taker同意取消订单",
    taker_reject_cancel_time: "Taker拒绝用户请求",
    user_expire_time: "用户取消订单",
    user_cancel_time: "用户取消订单",
    cancel_time: "Taker取消订单",
    complete_time: "订单已完成!感谢您",
  },
  iconList: [{
      icon: 'cartfill',
      color: 'red',
      badge: 2,
      name: '待付款'
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 1,
      name: '待接单'
    }, {
      icon: 'deliver_fill',
      color: 'orange',
      badge: 100,
      name: '待配送'
    },
    {
      icon: 'presentfill',
      color: 'orange',
      badge: 3,
      name: '待收货'
    }
  ]
}
module.exports = {
  data: data,
}