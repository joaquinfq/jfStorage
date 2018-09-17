const assert        = require('../assert');
const common        = require('../common');
const jfStorageTime = require('../../src/Time');

class TestTime extends jfStorageTime
{
    constructor(Class, validTime)
    {
        // Pasamos un valor a validTime para cobertura de tests.
        super(Class, { validTime });
        // Pero sobrescribimos el valor porque por defecto sería un día.
        this.validTime = 100;
    }
}

function loop(ms = 100)
{
    const _time = Date.now();
    while (Date.now() - _time < ms)
    {
        for (let _i = 0; _i < ms; ++_i)
        {
        }
    }
}

function testClear()
{
    const _data    = {};
    const _storage = common.createStorage(TestTime, _data);
    const _keys    = Object.keys(_data);
    assert.assert('deepStrictEqual', _storage.keys(), _keys);
    assert.assert('deepStrictEqual', Object.keys(_storage.$$timestamps), _keys);
    _storage.clear();
    assert.assert('deepStrictEqual', _storage.keys(), []);
    assert.assert('deepStrictEqual', Object.keys(_storage.$$timestamps), []);
}

function testClearExpired()
{
    const _data    = {};
    const _storage = common.createStorage(TestTime, _data, 10, null, 50);
    const _keys    = Object.keys(_data);
    const _time    = Date.now();
    _keys.forEach(
        key =>
        {
            // Damos 5 ms de margen para el retardo de crear los elementos.
            assert.assert('ok', _time - _storage.$$timestamps[key] < 5);
        }
    );
    _storage.clearExpired();
    assert.assert('deepStrictEqual', _storage.keys(), _keys);
    assert.assert('deepStrictEqual', Object.keys(_storage.$$timestamps), _keys);
    loop(_storage.validTime);
    _storage.clearExpired();
    assert.assert('deepStrictEqual', _storage.keys(), []);
    assert.assert('deepStrictEqual', _storage.$$timestamps, {});
}

function testRemmoveItem()
{
    const _data       = {};
    const _storage    = common.createStorage(TestTime, _data);
    const _keys       = Object.keys(_data);
    const _timestamps = _storage.$$timestamps;
    _keys.forEach(
        key =>
        {
            assert.assert('equal', key in _timestamps, true);
            _storage.removeItem(key);
            assert.assert('equal', key in _timestamps, false);
        }
    );
}

common.run(TestTime);
testClear();
testClearExpired();
testRemmoveItem();
