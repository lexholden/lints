/*jslint es6, node, maxlen: 80, bitwise */

"use strict";

const lodash = require("lodash/fp");

module.exports = function makeWorkChunker(workChunkSize) {
    return lodash.flow(
        lodash.toPairs,
        lodash.chunk(workChunkSize),
        lodash.map(lodash.fromPairs)
    );
};
