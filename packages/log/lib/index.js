'use strict';


const log = require('npmlog')
// 判断debug模式
log.level = process.env.LOG_LEVEL || 'info'
// 修改前缀
log.heading = 'cl'
// 前缀样式
log.headingStyle = { fg: 'red', bg: 'white'}
// 自定义命令
log.addLevel('success', 2000, { fg: 'green', bold: true })
module.exports = log;