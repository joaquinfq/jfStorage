const jfStorageProxy        = require('../src/Proxy');
const jfStorageTime         = require('../src/Time');
const jfStorageTestsStorage = require('./_Storage');

class TestTime extends jfStorageTime
{
    constructor(Class)
    {
        // Pero sobrescribimos el valor porque por defecto sería un día.
        super(Class, { validTime : 50 });
    }
}

/**
 * Pruebas unitarias de la clase `jf.storage.Time`.
 */
module.exports = class jfStorageTimeTest extends jfStorageTestsStorage
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.Time';
    }

    /**
     * @override
     */
    constructor()
    {
        super(TestTime);
    }

    /**
     * Comprueba la definición de la clase.
     */
    testDefinition()
    {
        this._testDefinition(
            jfStorageTime,
            null,
            {
                $$timerId    : null,
                $$timestamps : {},
                validTime    : 86400000
            }
        );
    }

    /**
     * Comprueba la herencia de la clase.
     */
    testInheritance()
    {
        this._testInheritance(jfStorageTime, jfStorageProxy);
    }

    /**
     * Pruebas del método `clearExpired`.
     */
    _checkExpired(sut, key, time, isExpired, args, calls)
    {
        let _args             = null;
        let _calls            = 0;
        sut.$$timestamps[key] = time;
        sut.removeItem        = function (...args)
        {
            _args = args;
            ++_calls;
        };
        this.assertEqual(sut.isExpired(key), isExpired);
        this._assert('', _args, args);
        this.assertEqual(_calls, calls);
        this.assertEqual(sut.$$timestamps[key], time);
        sut.clearTimer();
    }

    /**
     * Pruebas del método `clearExpired`.
     */
    testClearExpired()
    {
        const _data       = {};
        const _sut        = this.createStorage(_data);
        const _keys       = _sut.keys();
        const _timestamps = _sut.$$timestamps;
        _sut.validTime    = 100000;
        this._assert('', _keys, Object.keys(_timestamps));
        _sut.clearExpired();
        this._assert('', _keys, Object.keys(_timestamps));
        _keys.forEach(key => this.assertEqual(_sut.getItem(key), _data[key]));
        // La llamada a setItem  de createStorage debería haber creado un timer.
        this.assertTrue(_sut.$$timerId !== null);
        // Expiramos los elementos
        _keys.forEach(key => _timestamps[key] = -1);
        _sut.clearExpired();
        this._assert('', Object.keys(_timestamps), []);
        // Al eliminar todos los elementos, el timer se elimina.
        this.assertNull(_sut.$$timerId);
    }

    /**
     * Pruebas del método `clearTimer`.
     */
    async testClearTimer()
    {
        const _data    = {};
        const _storage = this.createStorage(_data);
        const _keys    = Object.keys(_data);
        const _time    = Date.now();
        _keys.forEach(
            // Damos 5 ms de margen para el retardo de crear los elementos.
            key => this.assertTrue(_time - _storage.$$timestamps[key] < 5)
        );
        _storage.clearExpired();
        this._assert('deepStrictEqual', _storage.keys(), _keys);
        this._assert('deepStrictEqual', Object.keys(_storage.$$timestamps), _keys);
        await this.sleep(_storage.validTime);
        _storage.clearExpired();
        this._assert('deepStrictEqual', _storage.keys(), []);
        this._assert('deepStrictEqual', _storage.$$timestamps, {});
    }

    /**
     * Pruebas del método `clear`.
     */
    testClearTimestamps()
    {
        const _sut = this.createStorage();
        this._assert('', _sut.keys(), Object.keys(_sut.$$timestamps));
        _sut.clear();
        this._assert('', _sut.keys(), []);
        this._assert('', _sut.$$timestamps, {});
    }

    /**
     * Pruebas del método `getItem`.
     */
    testGetItemExpired()
    {
        const _sut        = this.createStorage();
        const _keys       = _sut.keys();
        const _storage    = _sut.$$storage;
        const _timestamps = _sut.$$timestamps;
        this._assert('', _keys, Object.keys(_timestamps));
        _keys.forEach(
            key =>
            {
                this.assertEqual(_sut.getItem(key), _storage.getItem(key));
                // Expiramos el elemento.
                _timestamps[key] = -1;
                this.assertNull(_sut.getItem(key));
            }
        );
    }

    /**
     * Pruebas del método `isExpired` cuando llama a `removeItem`.
     */
    testIsExpiredCallsRemoveItem()
    {
        const _sut        = this.createStorage();
        const _keys       = _sut.keys();
        const _timestamps = _sut.$$timestamps;
        const _wrongTimes = [-1, this.wrongKeys()];
        _sut.validTime    = 100000;
        this._assert('', _keys, Object.keys(_timestamps));
        _keys.forEach(
            key =>
            {
                // Si no ha expirado no debería llamarse a `removeItem`.
                this._checkExpired(_sut, key, _timestamps[key], false, null, 0);
                // Para cualquiera de estos valores debería llamarse a `removeItem`.
                _wrongTimes.forEach(
                    time => this._checkExpired(_sut, key, time, true, [key], 1)
                );
            }
        );
        // Verificamos que en realidad no se hayan eliminado los elementos.
        this._assert('', _keys, Object.keys(_timestamps));
    }

    /**
     * Pruebas del método `removeItem`.
     */
    testRemoveItemFromTimestamps()
    {
        const _data       = {};
        const _storage    = this.createStorage(_data);
        const _keys       = Object.keys(_data);
        const _timestamps = _storage.$$timestamps;
        _keys.forEach(
            key =>
            {
                this.assertTrue(key in _timestamps);
                _storage.removeItem(key);
                this.assertFalse(key in _timestamps);
            }
        );
    }

    /**
     * Pruebas del método `setItem`.
     */
    testSetItemTimestamp()
    {
        const _key        = Date.now();
        const _value      = Math.random();
        const _sut        = new TestTime();
        const _timestamps = _sut.$$timestamps;
        this.assertNull(_sut.$$timerId);
        _sut.setItem(_key, _value);
        this.assertTrue(typeof _timestamps[_key] === 'number');
        this.assertTrue(_timestamps[_key] - _key < 1000);
        this.assertTrue(_sut.$$timerId !== null);
        _sut.clearTimer();
    }
};
