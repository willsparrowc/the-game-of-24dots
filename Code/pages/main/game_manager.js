var app = getApp()
var util = require('../../utils/util.js')
var Card = require('../../utils/card.js')
var Box = require('../../utils/box.js')
var Banner = require('../../utils/banner.js')
var Timer = require('../../utils/timer.js')
var Expression = require('../../utils/expression.js')

function GameManager() {
  this.size = 4
  this.periodIndex = 0
  this.period = util.periods[this.periodIndex]      // 初试状态为简易E
  this.failExpressions = []                         // 失败的表达式记录
  this.overTime = 0
  this.winTime = 0
}

GameManager.prototype = {
  setup: function() {
    this.failTimes = 0      // 当前超时次数
    this.solveTimes = 0     // 当前解决次数
    this.quickSolveTimes = 0 // 当前快速解决次数

    this.banner = new Banner(this.period)
    this.timer = new Timer(this.period) 
    this.box = new Box(this.period)
    this.expression = new Expression(this.period)

    this.expression.getNewExpression()
    this.timer.startTimer()
    this.addCards(this.expression.nums) 
  },

  /**
   * 重新启动函数
   */
  restartSuccess: function (remainTime) {
    this.timer.endTimer()
    var solveTimes = this.solveTimes + 1
    // 暗藏模式
    if(++(this.winTime) == util.winTime && this.overTime == 0){
      this.final()
    }

    // 快速完成
    var quickSolveTimes = this.quickSolveTimes
    if(this.timer.isQuick(remainTime)) ++quickSolveTimes

    if(solveTimes == util.upgradeTime.normal || quickSolveTimes == util.upgradeTime.quick){
      // 达到一般升级的次数
      wx.showToast({
        title: 'PASS!',
        image: '../../images/upgrade.png',
        duration: 5000
      })
      console.log("升级")
      this.upgrade()
      this.setup()
    } else {
      // 没有达到升级的次数
      wx.showToast({
        title: 'RIGHT!',
        icon: 'success',
        duration: 5000
      })
      console.log('======成功重启=====')
      this.solveTimes = solveTimes
      this.quickSolveTimes = quickSolveTimes
      this.restart()
    }
  },
  // 超时重启，返回值用来判断是否游戏结束
  restartFail: function () {
    this.timer.endTimer()
    this.failExpressions.push(this.expression)
    
    var failTimes = this.failTimes + 1
    this.overTime += 1

    // 最高优先级 overTime
    if (this.overTime == util.overTime){
      this.final()
      return true
    } 

    // 简易状态的重启和结束游戏
    if(this.period == util.periods[0]){
      if(failTimes == util.downgradeTime.normal){
        this.final()
        return true
      } else {
        this.failA(failTimes)
      }
    } else if (this.period == util.periods[1]) {
    // 中等状态的重启和降级
      if(failTimes == util.downgradeTime.normal){
        this.failB()
      } else {
        this.failA(failTimes)
      }
    } else {
    // 三种困难状态的重启和降级
      if (failTimes == util.downgradeTime.difficult) {
        this.failB()
      } else {
        this.failA(failTimes)
      }
    }
    return false
  },
  // 重启的一些小函数
  restart: function () {
    /* 更新卡片和计时器 */
    this.emptyBox()
    this.expression = new Expression(this.period)
    this.timer.setRemainTime(this.timer.getStartTime())

    this.expression.getNewExpression()
    this.addCards(this.expression.nums)
    this.timer.startTimer()
  },
  final: function () {
    app.globalData.expressions = this.getFailExpressions()
    wx.redirectTo({
      url: '../index/index',
    })
  },
  failA: function (failTimes) {
    wx.showToast({
      title: 'TIME OUT!',
      image: '../../images/fail.png',
      duration: 5000
    })
    console.log('========失败重启========')
    this.failTimes = failTimes
    this.restart()
  },
  failB: function () {
    wx.showToast({
      title: 'FAIL!',
      image: '../../images/downgrade.png',
      duration: 5000
    })
    console.log('====降级====')
    this.downgrade()
    this.setup()
  },
  /**
   *  卡片操作
   */
  lockCard: function (position) {
    this.box.cards[position].lock()
  },
  unlockCard: function (position) {
    this.box.cards[position].unlock()
  },
  getCardColor: function (position) {
    return this.box.cards[position].getColor()
  },
  addCards: function (nums) {
    for (var i = 0; i < this.size; ++i) {
      var card = new Card(i, nums[i])
      this.box.insertCard(card)
    }
  },
  emptyBox: function (){
    this.box.cards = this.box.create()
  },
  calculate: function (selectedCards, operator) {
    // 当合并卡片结果为24，且为最后一张卡片
    if (this.box.join(selectedCards, operator) == 24)
      if (this.box.getHiddenCardsNum() == this.size-1)
        return true
    return false
  },

  /**
   *  状态的改变
   */ 
  upgrade: function() {
    var index = this.periodIndex
    if(index + 1 < util.periods.length) ++index
    this.period = util.periods[index]
    this.periodIndex = index
  },
  downgrade: function() {
    var index = this.periodIndex
    if(index - 1 >= 0) --index
    this.period = util.periods[index]
    this.periodIndex = index
  },

  /**
   *  其他函数
   */
  goback: function (position1, position2) {
    this.box.split(position1, position2)
  },
  getCards: function () {
    return this.box.cards
  },
  getBanner: function () {
    return this.banner.getBanner()
  },
  getFailExpressions: function () {
    var expressionsToString = ''
    for (var i = 0; i < this.failExpressions.length; ++i){
      expressionsToString += this.failExpressions[i].toString()
      expressionsToString += '\n'
    }
    return expressionsToString
  }
}

module.exports = GameManager