/**
 * Class used for building keys used for storage items.
 *
 * @namespace jf.storage.key
 * @class     jf.storage.key.Base
 */
module.exports = class jfStorageKeyBase
{
    /**
     * Build key for value.
     *
     * @param {*} value Value to use.
     *
     * @return {*} Key created.
     */
    build(value)
    {
        return value;
    }
};
