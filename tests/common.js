const assert   = require('./assert');
const crypto   = require('crypto');
module.exports = {
    browser(Class, Storage)
    {
        const _name = Class.NAME;
        // Si no existe, debe agregarse.
        new Class();
        assert.assert('ok', global.window[_name] instanceof Storage);
        // Si existe, pero no implementa la interfaz `Storage`, se reemplaza.
        global.window[_name] = { a : 1 };
        new Class();
        assert.assert('ok', global.window[_name] instanceof Storage);
        // Si existe e implementa la interfaz `Storage`, se usa.
        const _storage       = new Storage();
        global.window[_name] = _storage;
        assert.assert('deepEqual', new Class().$$storage, _storage);
    },
    createStorage(Class, data = {}, count = 10, ...args)
    {
        const _storage = new Class(...args);
        Object.assign(data, this.generateData(count));
        const _hashes = Object.keys(data);
        _hashes.forEach(hash => _storage.setItem(hash, data[hash]));
        //
        return _storage;
    },
    generateData(count = 10)
    {
        const _data = {};
        for (let _i = 0; _i < count; ++_i)
        {
            const _value = Date.now() + '-' + Math.random() + '-' + Math.random();
            const _hash  = crypto.createHash('sha256');
            _hash.update(_value);
            _data[_hash.digest('hex')] = _value;
        }
        const _result = {};
        Object.keys(_data).sort().forEach(key => _result[key] = _data[key]);
        //
        return _result;
    },
    run(Class, skip = [])
    {
        Object.keys(this)
            .filter(method => method.startsWith('test') && !skip.includes(method))
            .forEach(method => this[method](Class));
    },
    testClear(Class)
    {
        const _data    = {};
        const _length  = Math.ceil(Math.random() * 20);
        const _storage = this.createStorage(Class, _data, _length);
        assert.assert('equal', _storage.length, _length);
        _storage.clear();
        assert.assert('equal', _storage.length, 0);
        Object.keys(_data).forEach(
            hash => assert.assert('equal', _storage.getItem(hash), null)
        );
    },
    testGetItem(Class)
    {
        const _data    = {};
        const _storage = this.createStorage(Class, _data);
        Object.keys(_data).forEach(
            hash => assert.assert('deepStrictEqual', _storage.getItem(hash), _data[hash])
        );
        this.wrongKeys().forEach(
            key => assert.assert('equal', _storage.getItem(key), null)
        );
    },
    testKey(Class)
    {
        const _data    = {};
        const _length  = Math.ceil(Math.random() * 20);
        const _storage = this.createStorage(Class, _data, _length);
        Object.keys(_data).forEach(
            (hash, index) => assert.assert('deepStrictEqual', _storage.key(index), hash)
        );
        assert.assert('equal', _storage.key('1'), null);
        assert.assert('equal', _storage.key(-1), null);
        assert.assert('equal', _storage.key(_length + 1), null);
    },
    testKeys(Class)
    {
        const _data    = {};
        const _storage = this.createStorage(Class, _data);
        assert.assert('deepStrictEqual', _storage.keys(), Object.keys(_data));
    },
    testLength(Class)
    {
        const _length = Math.ceil(Math.random() * 20);
        assert.assert('deepStrictEqual', this.createStorage(Class, {}, _length).length, _length);
    },
    testRemoveItem(Class)
    {
        const _data    = {};
        const _length  = Math.ceil(Math.random() * 20);
        const _storage = this.createStorage(Class, _data, _length);
        assert.assert('equal', _storage.length, _length);
        Object.keys(_data).forEach(
            (hash, index) =>
            {
                assert.assert('deepStrictEqual', _storage.getItem(hash), _data[hash]);
                _storage.removeItem(hash);
                assert.assert('equal', _storage.getItem(hash), null);
                assert.assert('equal', _storage.length, _length - index - 1);
            }
        );
        // Verificamos que no falle con claves incorrectas.
        this.wrongKeys().forEach(key => _storage.removeItem(key));
    },
    testSetItem(Class)
    {
        const _storage = new Class();
        assert.assert('equal', _storage.length, 0);
        this.wrongKeys().forEach(
            key =>
            {
                _storage.setItem(key, key);
                assert.assert('equal', _storage.length, 0);
            }
        );
    },
    wrongKeys()
    {
        return [false, true, null, undefined, {}, [], () => null];
    }
};
