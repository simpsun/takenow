// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const curTime = Date.now();
  try {
  await db.collection('tn_user_a').add({
      data: {
        balance: 0,
        reward: 0,
        create_time:curTime
      }
    })
  } catch (e) {
    console.log("创建失败", e)
  }
}