const assert          = require('../assert');
const common          = require('../common');
const jfStorageCookie = require('../../src/Cookie');

class TestCookie extends jfStorageCookie
{
    constructor(...args)
    {
        delete global.document;
        jfStorageCookie.polyfill(global).splice(0);
        super(...args);
    }
}

common.run(TestCookie);
['', null].forEach(
    expireDate =>
    {
        const storage = new TestCookie(expireDate);
        const data    = common.generateData();
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
        assert.assert('deepEqual', jfStorageCookie.polyfill(global), _cookies);
    }
);
