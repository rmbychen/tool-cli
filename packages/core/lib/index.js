'use strict';

module.exports = core;
// require支持加载.json,.js,.node文件,其它任何文件当做.js解析
const pkg = require('../package.json')
const log = require('@cl/log')
const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')

function core() {
    try {
        checkPkgVersion()
         checkNodeVersion()
    } catch (e) {
        log.error(e.message)
    }
}

/**
 * 检查脚手架版本号
 */
function checkPkgVersion () {
    log.notice('当前脚手架版本：', pkg.version)
}

/**
 * 检查node版本，有的API可能版本不支持，需设置最低版本号
 */
function checkNodeVersion () {
    // 获取当前Node版本号
    const currentVersion = process.version
    // 获取最低版本号
    const lowestVersion = constant.LOWEST_NODE_VERSION
    // 比对最低版本号
    if(!semver.gte(currentVersion, lowestVersion)){
        throw new Error(colors.red(`tool-cli 需要安装v${lowestVersion}以上版本的Node`))
    }


}