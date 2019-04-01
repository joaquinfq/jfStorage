const jfStorageBase = require('../src/Base.js');
const jfTestsUnit   = require('@jf/tests/src/type/Unit');
/**
 * Pruebas unitarias de la clase `jf.storage.Base`.
 */
module.exports = class jfStorageBaseTest extends jfTestsUnit
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.Base';
    }

    /**
     * @override
     */
    setUp()
    {
        this.sut = new jfStorageBase();
    }

    /**
     * Comprueba la definición de la clase.
     */
    testDefinition()
    {
        this._testDefinition(
            jfStorageBase,
            null,
            {
                length : 0
            }
        );
    }

    /**
     * Pruebas del método `_checkIndex`.
     */
    testCheckIndex()
    {
        const _sut = this.sut;
        jfTestsUnit.getAllTypes().filter(value => typeof value !== 'number').forEach(
            value => this.assertFalse(_sut._checkIndex(value))
        );
        this.assertFalse(_sut._checkIndex(-1));
        this.assertFalse(_sut._checkIndex(0));
        this.assertTrue(_sut._checkIndex(0, 1));
    }

    /**
     * Pruebas del método `_checkItem`.
     */
    testCheckItem()
    {
        const _sut = this.sut;
        jfTestsUnit.getAllTypes().filter(value => typeof value !== 'number').forEach(
            value =>
            {
                const _type = typeof value;
                this.assertEqual(_sut._checkKey(value), _type === 'number' || _type === 'string')
            }
        );
    }

    /**
     * Pruebas del método `clear`.
     */
    testEmptyMethods()
    {
        // Ejecutamos los métodos vacíos de la clase para detectar que no han sido
        // eliminados y que no fallan si se llaman.
        const _sut = this.sut;
        ['clear', 'getItem', 'key', 'keys', 'getItem', 'removeItem', 'setItem'].forEach(
            method =>
            {
                this.assertEqual(typeof _sut[method], 'function');
                this.assertUndefined(_sut[method]())
            }
        );
    }
};
