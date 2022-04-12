'use strict';

module.exports = core;
// require支持加载.json,.js,.node文件,其它任何文件当做.js解析
const pkg = require('../package.json')
const log = require('@cl/log')
const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')
const os = require('os')
// const minimist = require('minimist')
const pathExist = require('path-exists').sync
// import pkg from '../package.json'
// import constant from './const'
// import log from '@cl/log'
// import semver from 'semver'
// import colors from 'colors/safe'
// import os from 'os'
// import { pathExists } from 'path-exists'



function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        // checkRoot()
        checkUserHome()
        checkInputArgs()
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

/**
 * 检查是否root启动,防止没有权限更改文件，需要进行降级
 * 根据process.geteuid判断的
 */
function checkRoot() {
    require('root-check')()
}

/**
 * 检查用户主目录， 没有主目录很多缓存啥的没法做
 */
function checkUserHome () {
    const userHome = os.homedir()
    if(userHome || !pathExist(userHome)) {
        throw new Error(colors.red('当前用户主目录不存在'))
    }
}

/**
 * 检查入参，开启调试模式
 */
function checkInputArgs () {}