/*jslint es6, node, maxlen: 80 */

"use strict";

const fs = require("fs");
const Bluebird = require("bluebird");
const lodash = require("lodash");

const defaultLintsConfig = require("./default.lints.json");

function hasFiles(linterConfig) {
    const files = linterConfig.files || [];

    return files.length > 0;
}

Bluebird.promisifyAll(fs);

module.exports = fs
    .readFileAsync(`${process.cwd()}/.lints.json`, "utf8")
    .then(JSON.parse)
    .catch(() => defaultLintsConfig)
    .then(
        lodash.pickBy(hasFiles)
    );
