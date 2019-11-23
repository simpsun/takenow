// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await db.collection('tn_take_code').where({
      orderID: event.orderID
    }).get()
    if (result.data[0].take_code == event.code) {
    const updateResult=  await db.collection('tn_order').where({
        orderID: event.orderID
      }).update({
        data: {
          status: 2
        }
      })
      console.log(updateResult)
      return true
    } else {
      return false
    }
  } catch (e) {
    console.log(e)
    return false;
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}