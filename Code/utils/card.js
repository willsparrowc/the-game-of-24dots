var util = require('./util.js')

function Card(position, value){
  this.position = position  // card的位置 0、1、2、3、4... size-1
  this.value = value
  this.hidden = false
  this.color = util.cardColors[0]
  this.preValues = []
}

Card.prototype = {
  saveValue: function(){
    this.preValues.push(this.value)
  },
  updateValue: function(value){
    this.value = value
  },
  goback: function () {
    if(this.preValues.length > 0)
      this.value = this.preValues.pop()
    //console.log("I go back!")
  },
  /**
   * 隐藏和显现
   */
  hide: function() {
    this.hidden = true
    this.unlock()
  },
  appear: function(){
    this.hidden = false
    this.unlock()
    //console.log("I appear!")
  },
  isHidden: function () {
    return this.hidden
  },
  /**
   * 锁定和解锁
   */
  lock: function () {
    this.color = util.cardColors[1]
  },
  unlock: function () {
    this.color = util.cardColors[0]
  },
  /**
   * 其他
   */
  getColor: function () {
    return this.color
  }
}

module.exports = Card