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
  const openid = wxContext.OPENID;
  const orderInfo = await db.collection('tn_order').doc(_id).get();
  const takerInfo = await db.collection('tn_user').where({_openid:openid}).get();
  
  if (orderInfo.data.status == 0) {

    try {
     const result= await db.collection('tn_order').doc(_id).update({
        data: {
          status: 1,
          taker_open_id: openid,
          grab_time:new Date().getTime(),
          taker_phone: takerInfo.phone
        }
      })
        await db.collection('tn_take_code').add({
          data: {
            orderID: orderInfo.data.orderID,
            take_code: Math.floor(Math.random() * 9999 + 1000)
          }
        })
      return result
    } catch (e) {
      console.log('error:', 
      )
    }
  }

  if (orderInfo.data.taker_open_id != null && orderInfo.data.taker_open_id != openid) {
    return 'otherGrabed'
  }
  console.log('res:', orderInfo)

}

// let _id = this.data.orderInfo._id
// db.collection('tn_order').doc(_id).get().then(res => {
//   if (res.data.status == 0) {
//     const my_open_id = app.globalData.openid;
//     db.collection('tn_order').doc(_id).update({
//       data: {
//         status: 1,
//         taker_open_id: my_open_id
//       }
//     }).then(res => {
//       console.log('抢单成功:', res);
//       wx.showToast({
//         title: '抢单成功',
//         icon: 'success',
//         duration: 2e3
//       })
//     }).catch(res => {
//       console.log('抢单失败', res)
//       wx.showToast({
//         title: `抢单失败:${res}`,
//         icon: 'none',
//         duration: 2e3
//       })
//     })
//   }
//   else {
//     this.showToastAndBack('订单信息已变动，请稍后再试')
//   }
// }).catch(res => {
//   conso.log('数据库查询失败:', res);
//   wx.showToast({
//     title: `数据库查询失败:${res}`,
//     icon: 'none',
//     duration: 2e3
//   });