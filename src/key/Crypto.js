const crypto           = require('crypto');
const jfStorageKeyBase = require('./Base');
/**
 * Class used for building hashed keys used for storage items.
 *
 * @namespace jf.storage.key
 * @class     jf.storage.key.Crypto
 * @extends   jf.storage.key.Base
 */
module.exports = class jfStorageKeyCrypto extends jfStorageKeyBase
{
    /**
     * @inheritDoc
     */
    constructor(algorithm = 'sha256', length = 8)
    {
        super();
        /**
         * Algorithm to use for building hashes.
         *
         * @type {string}
         */
        this.algorithm = algorithm || 'sha256';
        /**
         * Length of hashes to build.
         *
         * @type {number}
         */
        this.length = length || 8;
    }

    /**
     * @inheritDoc
     */
    build(value)
    {
        const _hash = crypto.createHash(this.algorithm);
        _hash.update(value);

        return _hash.digest('hex').substr(0, this.length);
    }
};
