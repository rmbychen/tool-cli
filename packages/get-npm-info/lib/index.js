'use strict';

const aixos = require('axios')
// url做拼装
const urlJoin = require('url-join')
const semver = require('semver');
const { default: axios } = require('axios');

function getNpmInfo(name, registry) {
    if(!name) { return }
    const registryUrl = registry || getDefaultRegistry()
    // const npmInfoUrl = urlJoin(registryUrl, name)
    const npmInfoUrl = urlJoin(registryUrl, 'semver')
    return axios.get(npmInfoUrl).then(res =>{
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
    if(!data) { return []}
    return Object.keys(data.versions)

}
module.exports = {
    getNpmInfo
};