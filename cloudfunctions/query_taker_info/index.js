// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = event.openid;
  try {
    const result = await db.collection('tn_taker').where({
      openid:openid
      }).get()
    return result
  } catch (e) {
    console.log('error:')
  }
}