// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _id = event._id;
  try {
    const result = await db.collection('tn_order').doc(_id).update({
      data: {
        // 变为未抢单状态。去除taker_id,grab_time
        status: 0,
        grab_time:null,
        complete_time:null,
        taker_open_id:null,
        taker_phone:null
      }
    })
    return result
  } catch (e) {
    console.log('error:')
  }
}