const jfStorageMemory = require('./Memory');
const jfStorageProxy  = require('./Proxy');
/**
 * Class used as storage for data with expiration time.
 *
 * @namespace jf.storage
 * @class     jf.storage.Time
 * @extends   jf.storage.Proxy
 */
module.exports = class jfStorageTime extends jfStorageProxy
{
    /**
     * @inheritDoc
     */
    constructor(Class = null, config = {})
    {
        super(Class || jfStorageMemory, config);
        /**
         * Timestamps of data in cache.
         *
         * @type {object}
         */
        this.$$timestamps = {};
        /**
         * Valid time of data in cache in milliseconds (24 hours by default).
         *
         * @type {number}
         */
        this.validTime = typeof config.validTime === 'number'
            ? config.validTime
            : 24 * 60 * 60 * 1000;
    }

    /**
     * @inheritDoc
     */
    clear()
    {
        super.clear();
        this.$$timestamps = {};
    }

    /**
     * Remove from cache all items expired.
     */
    clearExpired()
    {
        const _timestamps = this.$$timestamps;
        for (const _key of Object.keys(_timestamps))
        {
            if (this.isExpired(_key))
            {
                this.removeItem(_key);
            }
        }
    }

    /**
     * Check if cache has expired.
     *
     * @param {string} key Hash of data to read from cache.
     *
     * @return {boolean} `true` if data has expired.
     */
    isExpired(key)
    {
        const _time = this.$$timestamps[key];

        return typeof _time !== 'number' || Date.now() >= (_time + this.validTime);
    }

    /**
     * @inheritDoc
     */
    getItem(key)
    {
        return this.isExpired(key)
            ? null
            : super.getItem(key);
    }

    /**
     * @inheritDoc
     */
    removeItem(key)
    {
        super.removeItem(key);
        delete this.$$timestamps[key];
    }

    /**
     * @inheritDoc
     */
    setItem(key, value)
    {
        if (this._checkKey(key))
        {
            this.$$timestamps[key] = Date.now();
        }

        return super.setItem(key, value);
    }
};
