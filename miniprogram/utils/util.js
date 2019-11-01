const formatTime = date => {
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
  commentTimeHandle: commentTimeHandle
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