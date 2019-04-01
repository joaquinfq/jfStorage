const crypto      = require('crypto');
const jfTestsUnit = require('@jf/tests/src/type/Unit');
/**
 * Pruebas unitarias de la clase `jf.storage.Browser`.
 */
module.exports = class jfStorageBrowserTest extends jfTestsUnit
{
    constructor(Storage)
    {
        super();
        this.count = 20;
        this.Class = Storage;
    }

    createStorage(data = {}, ...args)
    {
        const _count   = this.count;
        const _storage = new this.Class(...args);
        Object.assign(data, this.generateData(_count));
        Object.keys(data).forEach(hash => _storage.setItem(hash, data[hash]));
        this.assertEqual(_storage.length, _count);
        //
        return _storage;
    }

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
    }

    setUp()
    {
        global.document = {};
        global.window = {};
    }

    testClear()
    {
        const _data    = {};
        const _storage = this.createStorage(_data);
        _storage.clear();
        this.assertEqual(_storage.length, 0);
        Object.keys(_data).forEach(
            hash => this.assertNull(_storage.getItem(hash))
        );
    }

    testGetItem()
    {
        const _data    = {};
        const _storage = this.createStorage(_data);
        Object.keys(_data).forEach(
            hash => this._assert('deepStrictEqual', _storage.getItem(hash), _data[hash])
        );
        this.wrongKeys().forEach(
            key => this.assertNull(_storage.getItem(key))
        );
    }

    testKey()
    {
        const _data    = {};
        const _storage = this.createStorage(_data);
        Object.keys(_data).forEach(
            (hash, index) => this._assert('deepStrictEqual', _storage.key(index), hash)
        );
        this.assertNull(_storage.key('1'));
        this.assertNull(_storage.key(-1));
        this.assertNull(_storage.key(this.count + 1));
    }

    testKeys()
    {
        const _data    = {};
        const _storage = this.createStorage(_data);
        this._assert('deepStrictEqual', _storage.keys(), Object.keys(_data));
    }

    testLength()
    {
        this._assert('deepStrictEqual', this.createStorage({}).length, this.count);
    }

    testRemoveItem()
    {
        const _data    = {};
        const _length  = this.count;
        const _storage = this.createStorage(_data);
        Object.keys(_data).forEach(
            (hash, index) =>
            {
                this._assert('deepStrictEqual', _storage.getItem(hash), _data[hash]);
                _storage.removeItem(hash);
                this.assertNull(_storage.getItem(hash));
                this.assertEqual(_storage.length, _length - index - 1);
            }
        );
        // Verificamos que no falle con claves incorrectas.
        this.wrongKeys().forEach(key => _storage.removeItem(key));
    }

    testSetItem()
    {
        const _storage = new this.Class();
        this.assertEqual(_storage.length, 0);
        this.wrongKeys().forEach(
            key =>
            {
                _storage.setItem(key, key);
                this.assertEqual(_storage.length, 0);
            }
        );
    }

    wrongKeys()
    {
        return [false, true, null, undefined, {}, [], () => null];
    }
};
