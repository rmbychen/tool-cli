'use strict';

module.exports = init;

function init(projectName, cmdObj) {
    console.log('projectName', projectName, cmdObj, process.env.CLI_TARGET_PATH)
}
