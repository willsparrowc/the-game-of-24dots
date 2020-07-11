var util = require('./util.js')

function Timer(period) {
  this.period = period
  this.startTime = this.setStartTime()
  this.remainTime = this.startTime
  this.timer = null
}

Timer.prototype = {
  // 确定计时器初试时间
  setStartTime: function() {
    var startTime = 0
    var period = this.period

    if(period == 'E'){
      startTime = util.timers.E
    } else if (period == 'M') {
      startTime = util.timers.M
    } else if (period == 'D1') {
      startTime = util.timers.D1
    } else if (period == 'D2') {
      startTime = util.timers.D2
    } else if (period == 'D3') {
      startTime = util.timers.D3
    } else {
      startTime = util.timers.error
    }

    return startTime
  },

  // 计时器的开始和停止
  startTimer: function() {
    this.isQuit = false

    var that = this
    var remainTime = this.remainTime

    this.timer = setInterval(function() {
      --remainTime
      that.setRemainTime(remainTime)
      //console.log(that.remainTime)
      if(remainTime == 0 || that.isQuit) that.endTimer()
    }, 1000)
  },
  endTimer: function() {
    clearInterval(this.timer)
    this.timer = null
    this.isQuit = true
    console.log("TIMER 安全关闭") 
  },

  // 返回解决当前的问题时间是否快速
  isQuick: function(time) {
    if (time >= this.startTime * 0.8) return true
    else return false
  },

  /**
   * 其他
   */
  getRemainTime: function() {
    return this.remainTime
  },
  setRemainTime: function(time) {
    this.remainTime = time
  },
  getStartTime: function () {
    return this.startTime
  }
}

module.exports = Timer
