function getDateDiff(dateStr) {
  var publishTime = getDateTimeStamp(dateStr) / 1000,
    timeNow = parseInt(new Date().getTime() / 1000),
    d_seconds,
    d_minutes,
    d_hours,
    d_days,
    d,

    date = new Date(publishTime * 1000),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();

  // 小于10的在前面补0
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }

  d = timeNow - publishTime;
  d_days = parseInt(d / 86400);
  d_hours = parseInt(d / 3600);
  d_minutes = parseInt(d / 60);
  d_seconds = parseInt(d);

  if (d_days > 0 && d_days < 3) {
    return d_days + '天前';
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前';
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前';
  } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚';
    } else {
      return d_seconds + '秒前';
    }
  } else if (d_days >= 3 && d_days < 30) {
    return M + '-' + D + ' ' + H + ':' + m;
  } else if (d_days >= 30) {
    return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
  }
}

function getDateTimeStamp(input) {
  if (input instanceof Date) {
    return input;
  } else if (!isNaN(input)) {
    return new Date(toInt(input));
  } else if (/^\d+$/.test(input)) {
    return new Date(toInt(input, 10));
  } else {
    var s = (input || '').trim();
    s = s.replace(/\.\d+/, '') // remove milliseconds
      .replace(/-/, '/').replace(/-/, '/')
      .replace(/T/, ' ').replace(/Z/, ' UTC')
      .replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2'); // -04:00 -> -0400
    return new Date(s);
  }
}

module.exports = getDateDiff
