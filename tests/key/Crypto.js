const crypto             = require('crypto');
const jfStorageKeyBase   = require('../../src/key/Base');
const jfStorageKeyCrypto = require('../../src/key/Crypto');
const jfTestsUnit        = require('@jf/tests/src/type/Unit');
/**
 * Pruebas unitarias de la clase `jf.storage.key.Crypto`.
 */
module.exports = class jfStorageKeyCryptoTest extends jfTestsUnit
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.key.Crypto';
    }

    static createHash(value, algorithm, length)
    {
        const _hash = crypto.createHash(algorithm);
        _hash.update(value);
        //
        return _hash.digest('hex').substr(0, length);
    }

    static generateData(count = 10)
    {
        const _data = {};
        for (let _i = 0; _i < count; ++_i)
        {
            const _value = Date.now() + '-' + Math.random() + '-' + Math.random();
            const _hash  = crypto.createHash('sha256');
            _hash.update(_value);
            _data[this.createHash(_value, 'sha256', 100)] = _value;
        }
        const _result = {};
        Object.keys(_data).sort().forEach(key => _result[key] = _data[key]);
        //
        return _result;
    }

    /**
     * @override
     */
    setUp()
    {
        this.sut = new jfStorageKeyCrypto();
    }

    /**
     * Comprueba la definición de la clase.
     */
    testDefinition()
    {
        this._testDefinition(
            jfStorageKeyCrypto,
            null,
            {
                algorithm : 'sha256',
                length    : 8
            }
        );
    }

    /**
     * Comprueba la herencia de la clase.
     */
    testInheritance()
    {
        this._testInheritance(jfStorageKeyCrypto, jfStorageKeyBase);
    }

    /**
     * Pruebas del método `build`.
     */
    testBuild()
    {
        const _algorithms = ['sha256', 'sha512', 'md4', 'md5'];
        for (let _length = 4; _length <= 32; _length += 4)
        {
            const _data = Object.keys(jfStorageKeyCryptoTest.generateData(2));
            _algorithms.forEach(
                algorithm =>
                {
                    const _keyBuilder = new jfStorageKeyCrypto(algorithm, _length);
                    this.assertEqual(_keyBuilder.algorithm, algorithm);
                    this.assertEqual(_keyBuilder.length, _length);
                    _data.forEach(
                        value => this.assertEqual(
                            _keyBuilder.build(value),
                            jfStorageKeyCryptoTest.createHash(value, algorithm, _length)
                        )
                    );
                }
            );
        }
    }

    /**
     * Pruebas del método `constructor`.
     */
    testConstructor()
    {
        const _data = Object.keys(jfStorageKeyCryptoTest.generateData(2));
        [[], [null, null]].forEach(
            args =>
            {
                this._assert(
                    '',
                    new jfStorageKeyCrypto(...args).build(_data[0]),
                    jfStorageKeyCryptoTest.createHash(_data[0], 'sha256', 8)
                );
            }
        );
    }
};
