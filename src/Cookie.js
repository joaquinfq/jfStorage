const jfStorageBase = require('./Base');
const cookies       = [];
/**
 * Class using browser cookies as storage.
 *
 * @namespace jf.storage
 * @class     jf.storage.Cookie
 * @extends   jf.storage.Base
 */
module.exports = class jfStorageCookie extends jfStorageBase
{
    /**
     * @inheritDoc
     */
    get length()
    {
        return this.keys().length;
    }

    /**
     * Class constructor.
     *
     * @param {string} expireDate Date to use in cookie `expires` field.
     */
    constructor(expireDate)
    {
        super();
        /**
         * Date to use in cookie `expires` field.
         *
         * @type {string}
         */
        this.$$expireDate = expireDate === undefined
            ? new Date(2099, 11, 31, 23, 59, 59).toUTCString()
            : expireDate;
    }

    /**
     * @inheritDoc
     */
    clear()
    {
        for (const _cookie of this.keys())
        {
            this.removeItem(_cookie);
        }
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
        return Object.keys(this.getCookies());
    }

    /**
     * Load values from cookies.
     *
     * @return {object} Current values in cookies.
     */
    getCookies()
    {
        const _items   = {};
        const _cookies = document.cookie
            .split(';')
            .map(c => c.split('='))
            .filter(c => c.length > 1);
        if (_cookies.length)
        {
            for (const _cookie of _cookies)
            {
                _items[decodeURIComponent(_cookie[0].trim())] = decodeURIComponent(_cookie[1].trim());
            }
        }

        return _items;
    }

    /**
     * @inheritDoc
     */
    getItem(key)
    {
        let _item = null;
        if (this._checkKey(key))
        {
            const _data = this.getCookies();
            _item       = _data.hasOwnProperty(key)
                ? _data[key]
                : null;
        }

        return _item;
    }

    /**
     * Polyfill for add support to cookies.
     */
    static polyfill(global)
    {
        if (!global.document)
        {
            global.document = {};
        }
        if (!('cookie' in global.document))
        {
            Object.defineProperty(
                global.document,
                'cookie',
                {
                    configurable : false,
                    enumerable   : false,
                    get()
                    {
                        return cookies.map(cookie => cookie.split(';')[0]).join('; ');
                    },
                    set(value)
                    {
                        const _value = value.split(';');
                        if (value.includes('01 Jan 1970'))
                        {
                            const _name  = _value[0];
                            const _index = cookies.findIndex(cookie => cookie.startsWith(_name));
                            if (_index !== -1)
                            {
                                cookies.splice(_index, 1);
                            }
                        }
                        else
                        {
                            cookies.push(value);
                        }
                    }
                }
            );
        }

        return cookies;
    }

    /**
     * @inheritDoc
     */
    removeItem(key)
    {
        if (this._checkKey(key))
        {
            document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
    }

    /**
     * @inheritDoc
     */
    setItem(key, value)
    {
        if (this._checkKey(key))
        {
            const _expires  = this.$$expireDate;
            document.cookie = _expires
                ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=${this.$$expireDate}; path=/`
                : `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/`;
        }
    }
};
