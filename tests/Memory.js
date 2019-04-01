const jfStorageBase         = require('../src/Base');
const jfStorageMemory       = require('../src/Memory');
const jfStorageTestsStorage = require('./_Storage');
/**
 * Pruebas unitarias de la clase `jf.storage.Memory`.
 */
module.exports = class jfStorageMemoryTest extends jfStorageTestsStorage
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.Memory';
    }

    /**
     * @override
     */
    constructor()
    {
        super(jfStorageMemory);
    }

    /**
     * Comprueba la definición de la clase.
     */
    testDefinition()
    {
        this._testDefinition(
            jfStorageMemory,
            null,
            {
                $$data : {}
            }
        );
    }

    /**
     * Comprueba la herencia de la clase.
     */
    testInheritance()
    {
        this._testInheritance(jfStorageMemory, jfStorageBase);
    }
};
