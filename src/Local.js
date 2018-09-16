const jfStorageBrowser = require('./Browser');
const jfStorageCookie  = require('./Cookie');
/**
 * Polyfill for LocalStorage.
 *
 * @namespace jf.storage
 * @class     jf.storage.Local
 * @extends   jf.storage.Browser
 */
module.exports = class jfStorageLocal extends jfStorageBrowser
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
        return 'localStorage';
    }
};
