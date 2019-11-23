// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()



  try {
    return await db.collection('todos').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        balance:0,
        availBalance:0,
        redEnvelopeCode:{},
        tBean:100,
        reward:0,
        comingReward:0,
        create_time: new Date(),
       
      }
    })
  } catch (e) {
    console.error(e)
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}