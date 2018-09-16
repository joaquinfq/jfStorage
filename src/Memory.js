const jfStorageBase = require('./Base');
/**
 * Class using memory as storage.
 *
 * @namespace jf.storage
 * @class     jf.storage.Memory
 * @extends   jf.storage.Base
 */
module.exports = class jfStorageMemory extends jfStorageBase
{
    constructor()
    {
        super();
        /**
         * Object used to get/set values.
         *
         * @type {Object}
         */
        this.$$data = {};
    }
    /**
     * @inheritDoc
     */
    get length()
    {
        return this.keys().length;
    }

    /**
     * @inheritDoc
     */
    clear()
    {
        this.$$data = {};
    }

    /**
     * @inheritDoc
     */
    key(index)
    {
        const _keys = this.keys();

        return this._checkIndex(index, _keys.length)
            ? _keys[index]
            : null;
    }

    /**
     * @inheritDoc
     */
    keys()
    {
        return Object.keys(this.$$data);
    }

    /**
     * @inheritDoc
     */
    getItem(key)
    {
        const _data = this.$$data;

        return this._checkKey(key) && _data.hasOwnProperty(key)
            ? _data[key]
            : null;
    }

    /**
     * @inheritDoc
     */
    removeItem(key)
    {
        return this._checkKey(key)
            ? delete this.$$data[key]
            : false;
    }

    /**
     * @inheritDoc
     */
    setItem(key, value)
    {
        return this._checkKey(key)
            ? this.$$data[key] = value
            : null;
    }
};
