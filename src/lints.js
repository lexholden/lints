/*jslint es6, node, maxlen: 80 */
/*eslint global-require: 0 */

"use strict";

const lodash = require("lodash/fp");

const promisedLintsConfig = require("./promise-lints-config");
const getLinterConfigs = require("./get-linter-configs");
const prepareWork = require("./prepare-work");
const makeWorker = require("./make-worker");

const linters = {};
const linterConfigs = {};

function loadLinter(linterName) {
    console.log(`Loading ${linterName}...`);
    linters[linterName] = require(`./linters/${linterName}.js`);
}

function loadLinters(lintsConfig) {
    const linterNames = Object.keys(lintsConfig);

    linterNames.forEach(loadLinter);

    return getLinterConfigs(lintsConfig)
        .then(
            lodash.mapValues((config) => config || undefined)
        )
        .then((loadedLinterConfigs) => Object.assign(
            linterConfigs,
            loadedLinterConfigs
        ))
        .then(() => lintsConfig);
}

promisedLintsConfig
    .then(loadLinters)
    .then(prepareWork)
    .then(
        makeWorker({
            linters,
            linterConfigs
        })
    );
