const jfStorageBrowser = require('../src/Browser');
const jfStorageCookie = require('../src/Cookie');
const jfStorageSession = require('../src/Session');
const jfStorageTestsStorage = require('./_Storage');

/**
 * Pruebas unitarias de la clase `jf.storage.Local`.
 */
module.exports = class jfStorageLocalTest extends jfStorageTestsStorage
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.Session';
    }

    constructor()
    {
        super(jfStorageSession);
    }

    setUp()
    {
        super.setUp();
        jfStorageCookie.polyfill(global).splice(0);
    }

    /**
     * Comprueba la herencia de la clase.
     */
    testInheritance()
    {
        this._testInheritance(jfStorageSession, jfStorageBrowser);
    }
};
