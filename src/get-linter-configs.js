/*jslint es6, node, maxlen: 80 */

"use strict";

const fs = require("fs");
const Bluebird = require("bluebird");

Bluebird.promisifyAll(fs);

module.exports = function getLinterConfigs(lintsConfig) {
    function promiseLinterConfigs(promisedLinterConfigs, linterName) {
        promisedLinterConfigs[linterName] = fs
            .readFileAsync(lintsConfig[linterName].rcFile, "utf8")
            .then(JSON.parse)
            .catch(() => null);

        return promisedLinterConfigs;
    }

    const promisedLinterConfigs = Object
        .keys(lintsConfig)
        .reduce(promiseLinterConfigs, {});

    return Bluebird.props(promisedLinterConfigs);
};
