const jfStorageSerializerBase = require('../../src/serializer/Base.js');
const jfTestsUnit             = require('@jf/tests/src/type/Unit');
/**
 * Pruebas unitarias de la clase `jf.storage.serializer.Base`.
 */
module.exports = class jfStorageSerializerBaseTest extends jfTestsUnit
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.serializer.Base';
    }

    /**
     * @override
     */
    setUp()
    {
        this.sut = new jfStorageSerializerBase();
    }

    /**
     * Pruebas del método `serialize`.
     */
    testSerialize()
    {
        const _sut = this.sut;
        // Por defecto no se procesa el valor, lo hacen las clases hijas.
        jfTestsUnit.getAllTypes().forEach(
            value => this._assert('', _sut.serialize(value), value)
        );
    }

    /**
     * Pruebas del método `unserialize`.
     */
    testUnserialize()
    {
        const _sut = this.sut;
        // Por defecto no se procesa el valor, lo hacen las clases hijas.
        jfTestsUnit.getAllTypes().forEach(
            value => this._assert('', _sut.unserialize(value), value)
        );
    }
};
