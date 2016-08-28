/*jslint node, es6, maxlen: 80 */
/*eslint func-names: 0 */

"use strict";

const mocha = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

const makeWorkChunker = require("../../src/cluster/work-chunker");

const describe = mocha.describe;
const it = mocha.it;
const expect = chai.expect;

chai.use(chaiAsPromised);

describe("chunkWork()", function () {
    it(
        "should chunk a work into pieces of size 1",
        function () {
            const workChunkSize = 1;
            const chunkWork = makeWorkChunker(workChunkSize);

            expect(
                chunkWork({
                    "a": ["b"],
                    "c": ["d", "e"],
                    "f": ["g"],
                    "h": ["i", "j"]
                })
            ).to.eql([
                {
                    "a": ["b"]
                },
                {
                    "c": ["d", "e"]
                },
                {
                    "f": ["g"]
                },
                {
                    "h": ["i", "j"]
                }
            ]);
        }
    );

    it(
        "should chunk a work into pieces of size 2",
        function () {
            const workChunkSize = 2;
            const chunkWork = makeWorkChunker(workChunkSize);

            expect(
                chunkWork({
                    "a": ["b"],
                    "c": ["d", "e"],
                    "f": ["g"],
                    "h": ["i", "j"],
                    "k": ["l"],
                    "m": ["n", "o"],
                    "p": ["q", "r", "s"],
                    "t": ["u", "v", "w"],
                    "x": ["y", "z"]
                })
            ).to.eql([
                {
                    "a": ["b"],
                    "c": ["d", "e"]
                },
                {
                    "f": ["g"],
                    "h": ["i", "j"]
                },
                {
                    "k": ["l"],
                    "m": ["n", "o"]
                },
                {
                    "p": ["q", "r", "s"],
                    "t": ["u", "v", "w"]
                },
                {
                    "x": ["y", "z"]
                }
            ]);
        }
    );

    it(
        "should chunk a work into pieces of size 10",
        function () {
            const workChunkSize = 10;
            const chunkWork = makeWorkChunker(workChunkSize);

            expect(
                chunkWork({
                    "a": ["b"],
                    "c": ["d", "e"],
                    "f": ["g"],
                    "h": ["i", "j"],
                    "k": ["l"],
                    "m": ["n", "o"],
                    "p": ["q", "r", "s"],
                    "t": ["u", "v", "w"],
                    "x": ["y", "z"]
                })
            ).to.eql([{
                "a": ["b"],
                "c": ["d", "e"],
                "f": ["g"],
                "h": ["i", "j"],
                "k": ["l"],
                "m": ["n", "o"],
                "p": ["q", "r", "s"],
                "t": ["u", "v", "w"],
                "x": ["y", "z"]
            }]);
        }
    );
});
