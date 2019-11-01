// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const orderInfo = event.orderInfo
  orderInfo.user_openId=wxContext.OPENID
  console.log('这是我的订单信息', orderInfo)
  try {
    return await db.collection('tn_order').add({
      data: orderInfo
    })
  } catch (e) {
    console.error(e)
  }

}