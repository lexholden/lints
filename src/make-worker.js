/*jslint es6, node, maxlen: 80 */

"use strict";

const fs = require("fs");
const Bluebird = require("bluebird");

Bluebird.promisifyAll(fs);

module.exports = function makeWorker(workerOptions) {
    const linters = workerOptions.linters;
    const linterConfigs = workerOptions.linterConfigs;

    return function readAndLintFiles(fileLinters) {
        const fileNames = Object.keys(fileLinters);
        const single = 1;

        console.log(`Checking ${fileNames.length} ${fileNames.length === single
            ? "file"
            : "files"}...`);

        return Bluebird.each(
            fileNames,
            function readAndLintFile(fileName) {
                return fs
                    .readFileAsync(fileName, "utf8")
                    .then(function runLinters(data) {
                        return Bluebird.each(
                            fileLinters[fileName],
                            function runLinter(linterName) {
                                const options = linterConfigs[linterName];

                                return linters[linterName]({
                                    fileName,
                                    data,
                                    options
                                });
                            }
                        );
                    });
            }
        );
    };
};
