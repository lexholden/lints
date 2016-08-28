/*jslint es6, node, maxlen: 80, bitwise */
/*eslint no-bitwise: 0 */

"use strict";

const cluster = require("cluster");

const promisedLintsConfig = require("../promise-lints-config");
const getLinterConfigs = require("../get-linter-configs");
const prepareWork = require("../prepare-work");

const numberOfCPUs = require("os").cpus().length;
const workChunkSize = 16;
const chunkWork = require("./work-chunker")(workChunkSize);

module.exports = function startClusterMaster() {
    function sendLinterConfigs(linterConfigs) {
        Object
            .keys(cluster.workers)
            .forEach(
                (workerId) => cluster.workers[workerId].send({linterConfigs})
            );
    }

    function startSendingWorkChunks(chunksOfFilesWithLinters) {
        function sendWorkChunkOrDisconnectWorker(workerId) {
            const worker = cluster.workers[workerId];
            const workChunk = chunksOfFilesWithLinters.shift();

            if (workChunk === undefined) {
                return worker.disconnect();
            }

            worker.send(workChunk);
        }

        function handleMessage(worker, message) {
            process.exitCode |= message;
            sendWorkChunkOrDisconnectWorker(worker.id);
        }

        cluster.on("message", handleMessage);

        Object
            .keys(cluster.workers)
            .forEach(sendWorkChunkOrDisconnectWorker);
    }

    function coordinateWorkers(lintsConfig) {
        getLinterConfigs(lintsConfig)
            .then(sendLinterConfigs)
            .then(() => prepareWork(lintsConfig))
            .then(chunkWork)
            .then(startSendingWorkChunks);
    }

    while (Object.keys(cluster.workers).length < numberOfCPUs) {
        cluster.fork();
    }

    promisedLintsConfig.then(coordinateWorkers);
};
