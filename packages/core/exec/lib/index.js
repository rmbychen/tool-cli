'use strict';

const log = require('@cl/log')
const Package = require('@cl/package')

function exec() {
    const targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    log.verbose('targetPath:', targetPath)
    log.verbose('homePath:', homePath)
    const cmdObj = arguments[arguments.length -1]
    const cmdName = cmdObj._name
    console.log('exec', cmdObj._name),
    const pkg = new Package({targetPath, name: cmdName})
    // 1、targetPath -> modulePath
    // 2、modulePath -> package
    // 3、获取入口文件
    // 4、安装/更新
}
module.exports = exec;