const jfStorageKeyBase = require('../../src/key/Base');
const jfTestsUnit      = require('@jf/tests/src/type/Unit');
/**
 * Pruebas unitarias de la clase `jf.storage.key.Base`.
 */
module.exports = class jfStorageKeyBaseTest extends jfTestsUnit
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.key.Base';
    }

    /**
     * @override
     */
    setUp()
    {
        this.sut = new jfStorageKeyBase();
    }

    /**
     * Pruebas del método `build`.
     */
    testBuild()
    {
        const _sut = this.sut;
        jfTestsUnit.getAllTypes().forEach(
            value => this._assert('', _sut.build(value), value)
        );
    }
};
