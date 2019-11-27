// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const _id = event._id;
  try {
    const result = await db.collection('tn_order').doc(_id).update({
      data: {
        status: 9,
        user_apply_cancel_time:new Date().getTime(),
        user_apply_cancel_order: true
      }
    })
    return result
  } catch (e) {
    console.log('error:', e)
  }
}