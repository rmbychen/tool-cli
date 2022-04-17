'use strict';

module.exports = core;
const path = require('path')
// require支持加载.json,.js,.node文件,其它任何文件当做.js解析
const pkg = require('../package.json')
const log = require('@cl/log')
const exec = require('@cl/exec')
const constant = require('./const')
const semver = require('semver')
const colors = require('colors/safe')
const os = require('os')
const commander = require('commander')
const pathExist = require('path-exists').sync

const program = new commander.Command()

async function core() {
    try {
        await prepare()
    } catch (e) {
        log.error(e.message)
    }
}

async function prepare() {
    checkEnv()
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    await checkUpdateVersion()
    registryCommand()
}
/**
 * 脚手架命令初始化
 */
function registryCommand() {
    program
            .name(Object.keys(pkg.bin)[0])
            .usage('<command> [options]')
            .version(pkg.version)
            .option('-d, --debug', "是否开启调试模式", false)
            .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '')
            

    // 命令注册
    program
            .command('init [projectName]')
            .option('-f, --force', "是否强制初始化项目", false)
            .action(exec)

    program.on('option:targetPath', () => {
        const options = program.opts()
        console.log('options', options)
        process.env.CLI_TARGET_PATH = options.targetPath
    })

    // 设置开启调试模式
    program.on('option:debug', () => {
        const options = program.opts()
        process.env.LOG_LEVEL = options.debug ? 'verbose' : 'info'
        // 改了才会生效， 不然入参检查需要在log引入之前执行
        log.level = process.env.LOG_LEVEL
        log.verbose('debug', '已开启debug模式')
    })

    // 对未知命令监听
    program.on('command:*', (obj) => {
        const availableCommands = program.commands.map(cmd => cmd.name())
        console.log(colors.red(`未知命令：${obj}, 可使用的命令：${availableCommands.join(',')}`))
    })

    program.parse(process.argv)

    if(!program.args.length) {
        program.outputHelp()
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
    const exist = pathExist(userHome)
    if(!userHome || !exist) {
        throw new Error(colors.red('当前用户主目录不存在'))
    }
}

/**
 * 检查环境变量，可以将一些账号密码敏感信息保存在本地，而不用集中在代码当中
 */
function checkEnv () {
    console.log('checkEnv')
    // 从.env中加载环境变量
    const dotEnv = require('dotenv')
    const dotEnvPath = path.resolve(os.homedir(), '.env')
    // 默认是当前目录下的.env查找
    // 放在env里的变量可以通过process.env.xxx找到
    createDefaultConfig()
    // if(!pathExist(dotEnvPath)) {
        
    // }
}

/**
 * 创建默认的主目录home配置
 * @returns
 */
function createDefaultConfig () {
    const home = os.homedir()
    const config = { home }
    const cliHome = process.env.CLI_HOME
    config['cliHome'] = path.resolve(home, cliHome || constant.DEFAULT_CLI_HOME)
    console.log('config.cliHome', config.cliHome)
    process.env.CLI_HOME_PATH = config.cliHome
}
/**
 * 检查是否需要更新版本
 */
async function checkUpdateVersion () {
    // 拿到当前版本号和模块名
    const { name, version } = pkg
    // 获取npm上最新的版本号
    const { getNpmLatestVersion } = require('@cl/get-npm-info')
    const latestVersion = await getNpmLatestVersion(version, name)
    if(latestVersion && semver.gt(latestVersion, version)){
        log.warn(colors.yellow('更新提示', `脚手架有最新的版本：${latestVersion}, 
        请手动更新：npm install -g ${name}`))
    }
}