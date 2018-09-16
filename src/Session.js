const jfStorageBrowser = require('./Browser');
const jfStorageCookie  = require('./Cookie');
/**
 * Polyfill for SessionStorage.
 *
 * @namespace jf.storage
 * @class     jf.storage.Session
 * @extends   jf.storage.Browser
 */
module.exports = class jfStorageSession extends jfStorageBrowser
{
    /**
     * @inheritDoc
     */
    _initStorage()
    {
        super._initStorage(jfStorageCookie);
    }

    /**
     * @inheritDoc
     */
    static get NAME()
    {
        return 'sessionStorage';
    }
};
