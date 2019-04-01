const jfStorageBase         = require('../src/Base');
const jfStorageCookie       = require('../src/Cookie');
const jfStorageTestsStorage = require('./_Storage');

class TestCookie extends jfStorageCookie
{
    constructor(...args)
    {
        delete global.document;
        jfStorageCookie.polyfill(global).splice(0);
        super(...args);
    }
}

/**
 * Pruebas unitarias de la clase `jf.storage.Cookie`.
 */
module.exports = class jfStorageCookieTest extends jfStorageTestsStorage
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.Cookie';
    }

    constructor()
    {
        super(TestCookie);
    }

    testExpireDate()
    {
        ['', null].forEach(
            expireDate =>
            {
                const storage = new TestCookie(expireDate);
                const data    = this.generateData();
                const keys    = Object.keys(data);
                keys.forEach(key => storage.setItem(key, data[key]));
                const _cookies = keys.map(
                    key =>
                    {
                        return expireDate
                            ? `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}; expires=${expireDate}; path=/`
                            : `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}; path=/`;
                    }
                );
                // Verificamos que no falle si no existe el elemento.
                storage.removeItem('abcdefghij');
                this._assert('deepEqual', jfStorageCookie.polyfill(global), _cookies);
            }
        );
    }

    /**
     * Comprueba la herencia de la clase.
     */
    testInheritance()
    {
        this._testInheritance(TestCookie, jfStorageBase);
    }
};
