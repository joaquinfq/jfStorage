const jffs                  = require('@jf/fs').i();
const jfStorageBase         = require('../src/Base');
const jfStorageFile         = require('../src/File.js');
const jfStorageTestsStorage = require('./_Storage');
jffs.log = () => null;

class FileTest extends jfStorageFile
{
    static get DIR()
    {
        return jfStorageFile.DIR;
    }
}

/**
 * Pruebas unitarias de la clase `jf.storage.Memory`.
 */
module.exports = class jfStorageFileTest extends jfStorageTestsStorage
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.File';
    }

    constructor()
    {
        super(FileTest);
    }

    setUp()
    {
        const _dir = jfStorageFile.DIR;
        if (jffs.exists(_dir))
        {
            jffs.rmdir(_dir);
        }
        jffs.mkdir(_dir);
    }

    /**
     * Comprueba la definición de la clase.
     */
    testDefinition()
    {
        this._testDefinition(
            jfStorageFile,
            {
                DIR : '/tmp/jfStorageFile'
            },
            {
                $$directory : FileTest.DIR,
                extension   : '',
                length      : 0,
                showLogs    : false
            }
        );
    }

    /**
     * Comprueba la herencia de la clase.
     */
    testInheritance()
    {
        this._testInheritance(jfStorageFile, jfStorageBase);
    }

    /**
     * Pruebas del método `log`.
     */
    testLog()
    {
        const _sut    = new FileTest();
        _sut.showLogs = true;
        ['debug', 'error', 'log', 'warn'].forEach(
            level =>
            {
                let _args;
                const _old     = console[level];
                console[level] = (...args) => _args = args;
                const _params  = this.generateNumbers();
                _sut.log(level, ..._params);
                console[level] = _old;
                this._assert('', _params, _args);
            }
        );
    }
};
