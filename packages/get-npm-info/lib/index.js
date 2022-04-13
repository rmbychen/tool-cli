'use strict';

const aixos = require('axios')
// url做拼装
const urlJoin = require('url-join')
const semver = require('semver');
const { default: axios } = require('axios');

function getNpmInfo(name, registry) {
    if(!name) { return }
    const registryUrl = registry || getDefaultRegistry()
    const npmInfoUrl = urlJoin(registryUrl, name)
    // const npmInfoUrl = urlJoin(registryUrl, 'semver')
    return axios.get(npmInfoUrl).then(res =>{
        console.log('res', res)
        if(res.status === 200) {
            return res.data
        }
        return
    }).catch((e) => {
        console.log(`npm 请求错误: ${e.response.status}`, )
        return Promise.reject(e)
    })
}

/**
 * 获取默认的仓库地址
 * @param {*} isOrigin 
 * @returns 
 */
function getDefaultRegistry (isOrigin = false) {
    if(isOrigin) {
        return 'https://registry.npmjs.org/'
    }
    return 'https://registry.npm.taobao.org/'
}


/**
 * 获取npm的所有版本号
 * @param {*} name 
 * @param {*} registry 
 * @returns 
 */
async function getNpmVersions (name, registry) {
    const data = await getNpmInfo(name, registry)
    if(!data) { 
        return []
    }
    return Object.keys(data.versions)
}

/**
 * 从版本数组中获取大于当前版本号的版本,并排序
 * @param {*} baseVersion 
 * @param {*} versions 
 * @returns 
 */
function getNpmSemverVersion (baseVersion, versions) {
   return versions
          .filter(item => semver.gt(item, baseVersion))
          .sort((a, b) => semver.gt(b,a))
}

/**
 * 获取npm包的最新版本号
 * @param {*} baseVersion 
 * @param {*} npmName 
 * @param {*} registry 
 * @returns 
 */
async function getNpmLatestVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersions(npmName, registry)
    const satisfiesVersions = getNpmSemverVersion(baseVersion, versions)
    if (satisfiesVersions && satisfiesVersions.length > 0) {
        return satisfiesVersions[0]
    }
    return ''
}
module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmLatestVersion
};