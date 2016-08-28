/*jslint es6, node, maxlen: 80, bitwise */

"use strict";

const Bluebird = require("bluebird");
const glob = require("glob");
const lodash = require("lodash/fp");

const globAsync = Bluebird.promisify(glob);

module.exports = function prepareWork(lintsConfig) {
    function getLinterFiles(linterFiles, linterName) {
        const linterConfig = lintsConfig[linterName];
        const globs = linterConfig.files || [];
        const ignoreGlob = linterConfig.ignore;

        linterFiles[linterName] = Bluebird
            .map(
                globs,
                (globPattern) => globAsync(globPattern, {ignore: ignoreGlob})
            )
            .then(lodash.flattenDeep);

        return linterFiles;
    }

    function invert(linterFiles) {
        function getFileLinters(fileLinters, linterName) {
            function addFileWithLinter(fileName) {
                if (fileLinters[fileName] === undefined) {
                    fileLinters[fileName] = [];
                }

                fileLinters[fileName].push(linterName);
            }

            linterFiles[linterName].forEach(addFileWithLinter);

            return fileLinters;
        }

        return Object
            .keys(linterFiles)
            .reduce(getFileLinters, {});
    }

    const promisedLinterFiles = Object
        .keys(lintsConfig)
        .reduce(getLinterFiles, {});

    return Bluebird
        .props(promisedLinterFiles)
        .then(invert);
};
