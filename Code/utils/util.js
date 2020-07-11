/**
 * 游戏状态，简单 E、中等 M、困难一级 D1、困难二级 D2、困难三级 D3
 */
var periods = ['E', 'M', 'D1', 'D2', 'D3']
/**
 * 改变状态参数，升级和降级，结束游戏和游戏的胜利
 */    
var upgradeTime = {normal: 3, quick: 1}     
var downgradeTime = {normal: 2, difficult:1 }
var overTime = 7
var winTime = 12
/**
 * 操作台数据源
 */ 
var menuList = [{ deg: 0, operator: '/', src: '/images/divide.png' },
  { deg: 90, operator: '*', src: '/images/multiply.png' },
  { deg: 180, operator: '-', src: '/images/minus.png' },
  { deg: 270, operator: '+', src: '/images/plus.png' }]
/**
 * 标示语
 */
var banners = {'E': "可能有点简单，先试试手！",
  'M': "中等难度，小意思！",
  'D1': "困难一级，正戏开始！",
  'D2': "可以啊，困难二级来了！",
  'D3': "终极模式，加油，奥利给！！！",
  'error': "啊欧，出现了一点小问题！",
  'short': "时间所剩无几，且行且珍惜！"}
/**
 * 计时器时间
 */
var timers = {'E': 44,
  'M': 44,
  'D1': 33,
  'D2': 22,
  'D3': 11,
  'error': -1}

/**
 * 运算树结构，
 * 此处规定 size = 4，不同的 size 需要修改代码
 */
var operatorTreeIDs = [0, 1, 2, 3, 4]
var operatorTrees = ['((a#a)#a)#a', '(a#(a#a))#a',
'(a#a)#(a#a)', 'a#((a#a)#a)', 'a#(a#(a#a))']


/**
 * 非法运算符组合，一共17个
 */
var tokenTemplate = '+-*/'
var badTokens = ['+-/', '+/-', '+//',
'-+-', '-+/', '--/', '-/+', '-/-', '-//',
'/+-', '/+/', '/-+', '/--', '/-/', '//+', '//-', '///']

/**
 * 卡片的颜色变化
 */
var cardColors = ['#444', '#000']

/**
 * 名言
 */
var motto = '我会住在其中的一颗星星上面，在某一颗星星上微笑着，每当夜晚你仰望星空的时候，就会像是看到所有的星星都在微笑一般。(《小王子》)'

module.exports = {
  periods: periods,
  upgradeTime: upgradeTime,
  downgradeTime: downgradeTime,
  overTime: overTime,
  winTime: winTime,
  menuList: menuList,
  banners: banners,
  timers: timers,
  operatorTreeIDs: operatorTreeIDs,
  operatorTrees: operatorTrees,
  tokenTemplate: tokenTemplate,
  badTokens: badTokens,
  cardColors: cardColors,
  motto: motto
}
