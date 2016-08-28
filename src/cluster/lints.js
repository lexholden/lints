/*jslint es6, node, maxlen: 80 */

"use strict";

const cluster = require("cluster");
const startClusterMaster = require("./master");
const startClusterWorker = require("./worker");

if (cluster.isMaster) {
    startClusterMaster();
} else {
    startClusterWorker();
}
