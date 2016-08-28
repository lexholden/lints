/*jslint node, es6, maxlen: 80 */
/*eslint func-names: 0 */

"use strict";

const mocha = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

const prepareWork = require("../src/prepare-work");

const describe = mocha.describe;
const it = mocha.it;
const expect = chai.expect;

chai.use(chaiAsPromised);

describe("prepareWork()", function () {
    it(
        "should transform a lints config into a map of files and their linters",
        function () {
            expect(
                prepareWork({
                    "dummy-linter": {
                        "files": [
                            "test/**/*.dummy-extension"
                        ],
                        "ignore": [
                            "node_modules/**",
                            "**/*.min.dummy-extension"
                        ],
                        "rcFile": ".jslintrc"
                    }
                })
            ).to.eventually.eql({
                "test/dummy-file.dummy-extension": ["dummy-linter"],
                "test/dummy-folder/dummy-file.dummy-extension": ["dummy-linter"]
            });

            expect(
                prepareWork({
                    "jslint": {
                        "files": [
                            "test/**/*.dummy-extension"
                        ],
                        "ignore": [
                            "node_modules/**",
                            "**/*.min.js"
                        ],
                        "rcFile": ".jslintrc"
                    },
                    "jshint": {
                        "files": [],
                        "ignore": [],
                        "rcFile": null
                    },
                    "csslint": {},
                    "w3cjs": {
                        "files": [
                            "test/dummy-file.dummy-extension"
                        ],
                        "rcFile": null
                    }
                })
            ).to.eventually.eql({
                "test/dummy-file.dummy-extension": ["jslint", "w3cjs"],
                "test/dummy-folder/dummy-file.min.dummy-extension": ["jslint"],
                "test/dummy-folder/dummy-file.dummy-extension": ["jslint"]
            });
        }
    );
});
