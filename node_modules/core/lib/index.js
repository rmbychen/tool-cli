'use strict';

module.exports = core;

const pkg = require('../package.json')

function core() {
    console.log('exec core')
    checkPkgVersion()
}

function checkPkgVersion () {
    console.log('pkg verison', pkg.version)
}