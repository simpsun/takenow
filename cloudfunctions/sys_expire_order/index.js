// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _=db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await db.collection('tn_order').where({
      status:0,
      orderLife:_.lt(new Date().getTime())
    }).update({
      data: {
        status: 3,
        expire_time: new Date().getTime()
      }
    }).get()
    return result
    console.log('过期的订单',res)
  } catch (e) {
    console.log('error:')
  }
}