'use strict';
// const { isObject } = require('@cl/utils')
class Package {
    constructor({ name, version, targetPath, storePath} = {}) {
        // package路径
        this.targetPath = targetPath
        // package存储路径
        this.storePath = storePath
        // package name
        this.packageName = name
        // package version
        this.packageVersion = version
        console.log('Package constructor')
    }
    /**
     * 判断package是否存在
     */
    exists() {

    }

    /**
     * 安装package
     */
    install() {}
    /**
     * 更新package
     */
    update () {}
    /**
     * 获取package入口文件路径
     */
    getRootFilePath() {}
}
module.exports = Package;
