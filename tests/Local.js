const jfStorageBrowser      = require('../src/Browser');
const jfStorageCookie       = require('../src/Cookie');
const jfStorageLocal        = require('../src/Local');
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
        return 'jf.storage.Local';
    }

    constructor()
    {
        super(jfStorageLocal);
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
        this._testInheritance(jfStorageLocal, jfStorageBrowser);
    }
};
