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
            return Promise.all([
                expect(
                    prepareWork({
                        "dummy-linter": {
                            "files": [
                                "test/**/*.extension"
                            ],
                            "ignore": [
                                "node_modules/**",
                                "**/*.min.extension"
                            ],
                            "rcFile": ".jslintrc"
                        }
                    })
                ).to.eventually.eql({
                    "test/dummies/file.extension": ["dummy-linter"],
                    "test/dummies/dir/file.extension": ["dummy-linter"]
                }),

                expect(
                    prepareWork({
                        "jslint": {
                            "files": [
                                "test/**/*.extension"
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
                                "test/dummies/file.extension"
                            ],
                            "rcFile": null
                        }
                    })
                ).to.eventually.eql({
                    "test/dummies/file.extension": ["jslint", "w3cjs"],
                    "test/dummies/dir.extension/file.min.extension": ["jslint"],
                    "test/dummies/dir/file.extension": ["jslint"]
                })
            ]);
        }
    );
});
