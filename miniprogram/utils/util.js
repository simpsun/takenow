const formatTime = date => {
  var date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const tnFormatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + '' + [hour, minute, second].map(formatNumber).join('')
}

module.exports = {
  tnFormatTime: tnFormatTime,
  formatTime: formatTime,
  formatNumber: formatNumber,
  commentTimeHandle: commentTimeHandle,
  customFormatTime: customFormatTime
}

function commentTimeHandle(timeStamp) {

  var nowTime = new Date().getTime(), //获取此时此刻日期的秒数
    diffValue = (nowTime - timeStamp) / 1000, // 获取此时 秒数 与 要处理的日期秒数 之间的差值
    diff_days = parseInt(diffValue / 86400), // 一天86400秒 获取相差的天数 取整
    diff_hours = parseInt(diffValue / 3600), // 一时3600秒
    diff_minutes = parseInt(diffValue / 60),
    diff_secodes = parseInt(diffValue);
  if (diff_days > 0) { //相差天数 0 < diff_days < 3 时, 直接返出
    return diff_days + "天前";
  } else if (diff_days <= 0 && diff_hours > 0) {
    return diff_hours + "小时前";
  } else if (diff_hours <= 0 && diff_minutes > 0) {
    return diff_minutes + "分钟前";
  } else {
      return "刚刚";
  }
}


/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳  customFormatTime(timeStamp,'M.D h:m' )
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function customFormatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}