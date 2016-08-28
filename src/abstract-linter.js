/*jslint es6, node, maxlen: 80 */

"use strict";

const Bluebird = require("bluebird");

module.exports = function lint(settings) {
    function logFileNameAndLinterName() {
        console.log();
        console.log(`${settings.fileName} (${settings.linterName})`);
        process.exitCode = 1;
    }

    function logError(err) {
        logFileNameAndLinterName();
        console.error(err);
    }

    function logWarnings(warnings) {
        if (warnings.length > 0) {
            logFileNameAndLinterName();
            warnings.forEach(settings.logWarning || console.log);
        }
    }

    function tryLintAndLogWarnings() {
        return settings.lintAndLogWarnings({
            file: settings.fileName,
            data: settings.data,
            options: settings.options,
            logWarnings
        });
    }

    Bluebird
        .try(tryLintAndLogWarnings)
        .catch(logError);
};
