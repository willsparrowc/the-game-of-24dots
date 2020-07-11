var util = require('./util.js')

function Expression(period) {
  this.size = 4
  this.period = period
} 

Expression.prototype = {
  /**
   * 生成计算的表达式
   * 核心中的核心！！！
  */
  /* -----------运算符号部分------------- */
  isGoodTokens: function (tokens) {
    var isGood = true
    for (var i = 0; i < util.badTokens.length; ++i)
      if (util.badTokens[i] == tokens) {
        isGood = false
        break
      }
    return isGood
  },
  getTokens: function () {
    var tokens = ""
    var tokensTemplate = util.tokenTemplate
    var period = this.period
    //var period = 'D'
    if (period == util.periods[0]) {
      // 简单模式下的运算符选择，{+, -} 中按照3:7选择
      for (var i = 0; i < this.size - 1; ++i) {
        var randomIndex = Math.random()
        if (randomIndex > 0.7) tokens += tokensTemplate[1]
        else tokens += tokensTemplate[0]
      }
    } else if (period == util.periods[1]) {
      // 中等模式下的～，{+, -，*} 中按照 3:3:4 的比例选择
      for (var i = 0; i < this.size - 1; ++i) {
        var randomIndex = Math.random()
        if (randomIndex > 0.6) tokens += tokensTemplate[2]
        else if (randomIndex > 0.3) tokens += tokensTemplate[1]
        else tokens += tokensTemplate[0]
      }
    } else {
      // 复杂模式下的～，{+-*/}中按照 2:2:3:3 的比例选择
      for (var i = 0; i < this.size - 1; ++i) {
        var randomIndex = Math.random()
        if (randomIndex > 0.5) tokens += tokensTemplate[3]
        else if (randomIndex > 0.2) tokens += tokensTemplate[2]
        else if (randomIndex > 0.1) tokens += tokensTemplate[1]
        else tokens += tokensTemplate[0]
      }
    }

    if (this.isGoodTokens(tokens)) return tokens
    else return this.getTokens()
  },

  /* ----------获取运算树的ID----------- */
  getOperatorTreeID: function () {
    var treeID = -1
    var treeIndex = Math.random()
    var period = this.period
    //var period = 'M'
    if (period == util.periods[0]) {
      // 简单模式下的树结构选择，{I, II, III} 4:3:3 
      if (treeIndex > 0.7) treeID = util.operatorTreeIDs[2]
      else if (treeIndex > 0.4) treeID = util.operatorTreeIDs[1]
      else treeID = util.operatorTreeIDs[0]
    } else if (period == util.periods[1]) {
      // 中等模式下的～，{I, II, III, IV} 1:2:2:5
      if (treeIndex > 0.5) treeID = util.operatorTreeIDs[3]
      else if (treeIndex > 0.3) treeID = util.operatorTreeIDs[2]
      else if (treeIndex > 0.1) treeID = util.operatorTreeIDs[1]
      else treeID = util.operatorTreeIDs[0]
    } else {
      // 复杂模式下的～，{I, II, III, IV, V} 1:1:1:3:4
      if (treeIndex > 0.6) treeID = util.operatorTreeIDs[4]
      else if (treeIndex > 0.3) treeID = util.operatorTreeIDs[3]
      else if (treeIndex > 0.2) treeID = util.operatorTreeIDs[2]
      else if (treeIndex > 0.1) treeID = util.operatorTreeIDs[1]
      else treeID= util.operatorTreeIDs[0]
    }
    return treeID
  },

  /* --------------数字处理部分------------ */
  isFloat: function (n) {
    return parseInt(n) < parseFloat(n)
  },
  calculate: function (num1, num2, t) {
    var n = 0
    if (t == '+') {
      n = num1 + num2
    } else if (t == '-') {
      n = num1 - num2
    } else if (t == '*') {
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
  getResult: function (T, N, treeID) {
    var tempt = 0

    if (treeID == util.operatorTreeIDs[0]) {
      tempt = this.calculate(N[0], N[1], T[0])
      tempt = this.calculate(tempt, N[2], T[1])
      tempt = this.calculate(tempt, N[3], T[2])
    } else if (treeID == util.operatorTreeIDs[1]) {
      tempt = this.calculate(N[1], N[2], T[1])
      tempt = this.calculate(N[0], tempt, T[0])
      tempt = this.calculate(tempt, N[3], T[2])
    } else if (treeID == util.operatorTreeIDs[2]) {
      tempt = this.calculate(N[0], N[1], T[0])
      var tempt_ = this.calculate(N[2], N[3], T[2])
      tempt = this.calculate(tempt, tempt_, T[1])
    } else if (treeID == util.operatorTreeIDs[3]) {
      tempt = this.calculate(N[1], N[2], T[1])
      tempt = this.calculate(tempt, N[3], T[2])
      tempt = this.calculate(N[0], tempt, T[0])
    } else {
      tempt = this.calculate(N[2], N[3], T[2])
      tempt = this.calculate(N[1], tempt, T[1])
      tempt = this.calculate(N[0], tempt, T[0])
    }

    return tempt
  },
  productNums: function () {
    var numSeries = []
    for (var i = 1; i < 10; ++i)
      for (var j = 1; j < 10; ++j)
        for (var k = 1; k < 10; ++k)
          for (var l = 1; l < 10; ++l) {
            var nums = []
            nums.push(i)
            nums.push(j)
            nums.push(k)
            nums.push(l)
            numSeries.push(nums)
          }
    return numSeries
  },
  getNums: function (tokens, treeID, numSeries) {
    var nums = []
    for (var i = 0; i < numSeries.length; ++i) 
      if (this.getResult(tokens, numSeries[i], treeID) == 24) {
        nums.push(numSeries[i])
      }
    if(nums.length > 0){
      var index = Math.floor(Math.random()*nums.length)
      return nums[index]
    } else return nums
  },
  /**
   * 启发：根据运算符集和树结构编号
   */
  getNewExpression: function () {
    var nums = []     // expression 的数字集
    var tokens = ''   // expression 的运算符集
    var treeID = ''   // expression 的运算树结构编号

    var numSeries = this.productNums() 

    do{
      tokens = this.getTokens()
      treeID = this.getOperatorTreeID()
      nums = this.getNums(tokens, treeID, numSeries)
    } while (nums.length == 0)
    console.log(nums)
    console.log(tokens)
    console.log(treeID)
    this.nums = nums
    this.tokens = tokens
    this.treeID = treeID
  },

  /**
   * 其他部分
   */
  toString: function () {
    var expressionTemplate = util.operatorTrees[this.treeID]
    var string = ''
    var numIndex = 0
    var tokenIndex = 0
    for (var i = 0; i < expressionTemplate.length; ++i){
      if (expressionTemplate[i] == 'a'){
        string += this.nums[numIndex++]
      } else if (expressionTemplate[i] == '#'){
        string += this.tokens[tokenIndex++]
      } else {
        string += expressionTemplate[i]
      }
    }
    string += '=24'
    return string
  }
}

module.exports = Expression