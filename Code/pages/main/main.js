// pages/main.js
var app = getApp()
var util = require('../../utils/util.js')
var GameManager = require('./game_manager.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: "/images/sky1.jpg",
    gobackPng: "/images/goback.png",
    menuList: util.menuList,
    hiddenLoading: false,
    /* 以下数据为变化数据 */
    over: false,
    banner: '',
    timer: null,
    remainTime: '--',
    cards: [],
    selectedCards: [],  // 储存将要进行运算的数字，length 小于等于 2
    preCards: []        // 储存已经操作的卡片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 几个图片的转码显示 */
    var that = this
    if(Math.random() > 0.5) that.setData({
      background: '/images/sky2.jpg'
    })
    let base64_1 = wx.getFileSystemManager().readFileSync(this.data.background, 'base64')
    let base64_2 = wx.getFileSystemManager().readFileSync(this.data.gobackPng, 'base64')
    that.setData({
      background: 'data:image/jpg;base64,' + base64_1,
      gobackPng: 'data:image/jpg;base64,' + base64_2
    })
  
    this.gameManager = new GameManager()
    this.gameManager.setup()
    this.setData({
      banner: this.gameManager.getBanner(),
      cards: this.gameManager.getCards(),
    })
    this.startTimer()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.setData({
      hiddenLoading: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*====== 自定义函数 ========*/
  /**
   * 更新游戏数据
   */
  updateGame: function (data) {
    this.setData(data)
  },
  /**
   * 按钮操作的结果
   */
  // 撤回
  goback: function () {
    //console.log("Goback")
    // 撤回键发挥作用的前提是前面已经有操作的卡片
    if (this.data.preCards.length >= 2) {
      var position1 = this.data.preCards.pop()
      var position2 = this.data.preCards.pop()
      var that = this
      that.gameManager.goback(position1, position2)
      
      this.emptySelectedCards()     // 清空选择的卡片
      this.selectCard(position1)
      this.selectCard(position2)
    
      that.setData({
        cards: that.gameManager.getCards()
      })
    }
  },
  // 卡片
  touchCard: function (e) {
    ///console.log(e)
    var position = e.currentTarget.dataset.cardPosition
    this.selectCard(position)
    this.setData({
      cards: this.gameManager.getCards()
    })
  },
  // 计时器
  touchTimer: function () {
    var that = this
    that.setData({
      remainTime: 'Hi'
    })
  },
  keepTouchTimer: function () {
    wx.showToast({
      title: 'TIMER',
      icon: 'loading',
      duration: 1500
    })
  },
  // 运算符
  touchOperator: function (e) {
    //console.log(e.currentTarget.dataset.operator)
    var operator = e.currentTarget.dataset.operator
    // 运算符按钮发挥作用的前提只有当前已经选中 2 张卡片
    if(this.data.selectedCards.length == 2){
      var isKO = this.gameManager.calculate(this.data.selectedCards, operator)
      // 选中卡片处理和记录历史记录
      var popPosition = this.data.selectedCards.pop()
      //this.gameManager.unlockCard(popPosition)
      this.data.preCards.push(popPosition)
      this.data.preCards.push(this.data.selectedCards[0])

      this.setData({
        cards: this.gameManager.getCards()
      })

      //=========== 计算正确！！！ ========//
      if (isKO) {
        this.gameManager.restartSuccess(this.data.remainTime)
        // 更新 banner、cards、timer、
        var that = this
        that.setData({
          banner: this.gameManager.getBanner(),
          cards: this.gameManager.getCards(),
          selectedCards: [],
          preCards: []
        })
        that.endTimer()
        that.startTimer()
      }
    }
  },
  /**
   * 其他函数
   */
  // 卡片的选择
  selectCard: function (position) {
    var that = this
    var color = this.gameManager.getCardColor(position)

    if (color == util.cardColors[0]) {          // 选中卡片为颜色1
      this.gameManager.lockCard(position)
      if (this.data.selectedCards.length == 2) {
        var shiftPosition = this.data.selectedCards.shift()
        this.gameManager.unlockCard(shiftPosition)
      }
      this.data.selectedCards.push(position)
    } else if (color == util.cardColors[1]) { // 选中卡片为颜色2
      this.gameManager.unlockCard(position)
      if(position == this.data.selectedCards[0]) this.data.selectedCards.shift()
      else this.data.selectedCards.pop() 
    }
  },
  emptySelectedCards: function () {
    for (var i = 0; i < this.data.selectedCards.length; ++i){
      var shiftPosition = this.data.selectedCards.shift()
      this.gameManager.unlockCard(shiftPosition)
    }
  },
  /**
   * 计时器相关函数
   */
  startTimer: function() {
    var that = this
    that.setData({
      timer: setInterval(function() {
        var remainTime = that.gameManager.timer.getRemainTime()
        that.setData({
          remainTime: remainTime
        })
        if (remainTime == 0) {
          that.endTimer()
          var over = that.gameManager.restartFail()
          that.setData({
            banner: that.gameManager.getBanner(),
            cards: that.gameManager.getCards(),
            over: over
          })
          if(!over) that.startTimer()
        }
      }, 1000)
    })
  },
  endTimer: function() {
    var that = this
    clearInterval(that.data.timer)
    console.log("MAIN TIMER 成功关闭")
  }

})