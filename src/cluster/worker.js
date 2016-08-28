/*jslint es6, node, maxlen: 80 */
/*eslint global-require: 0 */

"use strict";

const cluster = require("cluster");
const lodash = require("lodash/fp");

const makeWorker = require("../make-worker");

function requireLinters(carry, linterName) {
    console.log(`Worker ${cluster.worker.id} is loading ${linterName}...`);

    carry[linterName] = require(`../linters/${linterName}.js`);

    return carry;
}

module.exports = function startClusterWorker() {
    let work;

    function handleMessage(message) {
        if (message.linterConfigs !== undefined) {
            const linterNames = Object.keys(message.linterConfigs);
            const linters = linterNames.reduce(requireLinters, {});
            const linterConfigs = lodash.mapValues(
                (config) => config || undefined,
                message.linterConfigs
            );

            work = makeWorker({
                linters,
                linterConfigs
            });

            return;
        }

        return work(message).then(() => process.send(process.exitCode || 0));
    }

    process.on("message", handleMessage);
};
