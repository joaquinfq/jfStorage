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
     * @override
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
     * @override
     */
    static get NAME()
    {
        return this.name;
    }
};
