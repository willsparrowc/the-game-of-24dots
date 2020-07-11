var Card = require('./card.js')

function Box(size) {
  this.size = size
  this.cards = this.create()
}

Box.prototype = {
  /**
   * 卡片的操作
   */
  // 新建
  create: function () {
    var cards = []

    for (var i = 0; i < this.size; ++i)
      cards.push(null)

    return cards
  },
  // 插入卡片
  insertCard: function (card) {
    this.cards[card.position] = card
  },
  // 获取 隐藏卡片的数量
  getHiddenCardsNum: function () {
    var num = 0
    for (var i = 0; i < this.cards.length; ++i)
      if (this.cards[i].isHidden()) ++num
    return num 
  },
  /**
   * 拆分卡片
   */
  split: function (position1, position2) {
    this.cards[position1].goback()
    this.cards[position2].appear()
  },
  /**
   * 合并卡片
   */
  isFloat: function (n) {
    return parseInt(n) < parseFloat(n)
  },
  _calculate: function (num1, num2, operator) {
    var n = 0
    // 交换顺序，保证 num1 - num2
    if (num2 > num1) {
      var tempt = num1
      num1 = num2
      num2 = tempt
    }   
    if (operator == '+') {
      n = num1 + num2
    } else if (operator == '-') {
      n = num1 - num2
    } else if (operator == '*') {
      n = num1 * num2
    } else {
      // 除法除数为0
      if (num2 != 0) {
        n = num1 / num2
        if (this.isFloat(n)) n = 0
      }
    }
    return n
  },
  join: function (selectedCards, operator) {
    var position1 = selectedCards[0]
    var position2 = selectedCards[1]

    var num1 = this.cards[position1].value
    var num2 = this.cards[position2].value
    var num3 = this._calculate(num1, num2, operator)

    this.cards[position1].saveValue()
    this.cards[position1].updateValue(num3)
    this.cards[position2].hide()

    return num3
  }

}

module.exports = Box