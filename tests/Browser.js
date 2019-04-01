const jfStorageBrowser      = require('../src/Browser');
const jfStorageMemory       = require('../src/Memory');
const jfStorageProxy        = require('../src/Proxy');
const jfStorageTestsStorage = require('./_Storage');

class TestBrowser extends jfStorageBrowser
{
    constructor()
    {
        super(jfStorageMemory);
    }
}

class TestEmptyBrowser extends TestBrowser
{
    _initStorage()
    {
        super._initStorage();
    }

    static get NAME()
    {
        return '';
    }
}

/**
 * Pruebas unitarias de la clase `jf.storage.Browser`.
 */
module.exports = class jfStorageBrowserTest extends jfStorageTestsStorage
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.Browser';
    }

    constructor()
    {
        super(TestBrowser);
    }

    testBrowser()
    {
        const _Class = TestBrowser;
        const _name  = _Class.NAME;
        // Si no existe, debe agregarse.
        new _Class();
        this.assertTrue(global.window[_name] instanceof jfStorageMemory);
        // Si existe, pero no implementa la interfaz `Storage`, se reemplaza.
        global.window[_name] = { a : 1 };
        new _Class();
        this.assertTrue(global.window[_name] instanceof jfStorageMemory);
        // Si existe e implementa la interfaz `Storage`, se usa.
        const _storage       = new jfStorageMemory();
        global.window[_name] = _storage;
        this._assert('deepEqual', new _Class().$$storage, _storage);
    }

    testBrowserEmpty()
    {
        const _initStorage = jfStorageProxy.prototype._initStorage;
        jfStorageProxy.prototype._initStorage = function ()
        {
            _initStorage.call(this, jfStorageMemory);
        };
        const _Class = TestEmptyBrowser;
        const _name  = _Class.NAME;
        // Si no tiene nombre no debe asignarse.
        new _Class();
        this.assertUndefined(global.window[_name]);
        jfStorageProxy.prototype._initStorage = _initStorage;
    }

    /**
     * Pruebas del método `constructor`.
     */
    testConstructor()
    {
        this._assert(
            'throws',
            () => new jfStorageBrowser(),
            new Error('You must specify a jf.storage class to use')
        );
    }

    /**
     * Comprueba la herencia de la clase.
     */
    testInheritance()
    {
        this._testInheritance(TestBrowser, jfStorageProxy);
    }
};
