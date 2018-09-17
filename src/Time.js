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
         * Timer to clear expired items.
         *
         * @type {Timeout|number|null}
         */
        this.$$timerId = null;
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
        if (!this.length)
        {
            this.clearTimer();
        }
    }

    /**
     * Clear timer used for removing expired items.
     */
    clearTimer()
    {
        const _timerId = this.$$timerId;
        if (_timerId !== null)
        {
            clearInterval(_timerId);
            this.$$timerId = null;
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
        const _time     = this.$$timestamps[key];
        const _isNumber = typeof _time === 'number';
        const _is       = !_isNumber || Date.now() >= (_time + this.validTime);
        if (_is && _isNumber)
        {
            this.removeItem(key);
        }

        return _is;
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
        if (!this.length)
        {
            this.clearTimer();
        }
    }

    /**
     * @inheritDoc
     */
    setItem(key, value)
    {
        if (this._checkKey(key))
        {
            this.$$timestamps[key] = Date.now();
            if (this.$$timerId === null)
            {
                this.$$timerId = setInterval(
                    () => this.clearExpired(),
                    this.validTime
                );
            }
        }
        super.setItem(key, value);
    }
};
