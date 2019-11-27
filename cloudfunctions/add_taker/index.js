// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const info = event.authList;
try{

    await db.collection('tn_taker').add({
      data: {
        idCard_name: info.idCard_name,
        idCard_code: info.idCard_code,
        idCard_gender: info.idCard_gender,
        studentCard_schoolId: info.studentCard_schoolId,
        nearCampus: info.nearCampus,
        studentCard_faculty: info.studentCard_faculty,
        sImage: info.sImage,
        openid: info.openid,
        code: info.code,
        phone: info.phone,
        create_time : new Date().getTime()
      }
    })
}catch(e){
  console.log('error',e)
}
}