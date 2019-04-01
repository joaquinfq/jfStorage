const jfStorageSerializerBase = require('../../src/serializer/Base');
const jfStorageSerializerJson = require('../../src/serializer/Json.js');
const jfTestsUnit             = require('@jf/tests/src/type/Unit');
/**
 * Pruebas unitarias de la clase `jf.storage.serializer.Json`.
 */
module.exports = class jfStorageSerializerJsonTest extends jfTestsUnit
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.serializer.Json';
    }

    /**
     * @override
     */
    setUp()
    {
        this.sut = new jfStorageSerializerJson();
    }

    /**
     * Comprueba la herencia de la clase.
     */
    testInheritance()
    {
        this._testInheritance(jfStorageSerializerJson, jfStorageSerializerBase, null);
    }

    /**
     * Pruebas del método `serialize`.
     */
    testSerialize()
    {
        const _sut = this.sut;
        jfTestsUnit.getAllTypes().forEach(
            value => this.assertEqual(_sut.serialize(value), JSON.stringify(value))
        );
    }

    /**
     * Pruebas del método `unserialize`.
     */
    testUnserialize()
    {
        const _sut = this.sut;
        jfTestsUnit.getAllTypes().forEach(
            value =>
            {
                const _serialized = JSON.stringify(value);
                if (_serialized === undefined)
                {
                    this.assertNull(_sut.unserialize(_serialized));
                }
                else
                {
                    this._assert('', _sut.unserialize(_serialized), JSON.parse(_serialized));
                }
            }
        );
    }
};
