var util = require('./util.js')

function Banner(period) {
  this.period = period
  this.banner = this.setBanner(period)
}

Banner.prototype = {
  // 设定滚动字幕的内容
  setBanner: function(period, extra=0) {
    var banner = ""

    // extra 用来设定倒计时提示
    if(extra == 0) {
      if (period == 'E') {
        banner = util.banners.E
      } else if (period == 'M') {
        banner = util.banners.M
      } else if (period == 'D1') {
        banner = util.banners.D1
      } else if (period == 'D2') {
        banner = util.banners.D2
      } else if (period == 'D3') {
        banner = util.banners.D3
      } else {
        banner = util.banners.error
      }
    } else {
      banner = util.banners.short
    }
    return banner
  },

  // 获取滚动字幕
  getBanner: function() {
    return this.banner
  }

}

module.exports = Banner