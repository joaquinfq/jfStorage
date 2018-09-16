const jfStorageProxy = require('./Proxy');
/**
 * Class used as proxy for global storage objects implementing Web Storage API.
 * If global object don't exists, then use a jf.Storage instance instead.
 *
 * @namespace jf.storage
 * @class     jf.storage.Browser
 * @extends   jf.storage.Proxy
 */
module.exports = class jfStorageBrowser extends jfStorageProxy
{
    /**
     * Initialize storage instance.
     *
     * @param {Storage|jf.storage.Base} Class Storage class reference to create a storage instance.
     *
     * @protected
     */
    _initStorage(Class = null)
    {
        const _name = this.constructor.NAME;
        try
        {
            if (_name && _name in window)
            {
                const _storage = window[_name];
                const _key     = '__jf-storage__';
                _storage.setItem(_key, _key);
                _storage.removeItem(_key);
                this.$$storage = _storage;
            }
        }
        catch (e)
        {
        }
        super._initStorage(Class);
        if (_name)
        {
            window[_name] = this.$$storage;
        }
    }

    /**
     * Return name of global storage to use.
     *
     * @return {string} Name of global storage to use.
     */
    static get NAME()
    {
        return this.constructor.name;
    }
};
