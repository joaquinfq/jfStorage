const assert             = require('../../assert');
const common             = require('../../common');
const crypto             = require('crypto');
const jfStorageKeyCrypto = require('../../../src/key/Crypto');
const data               = Object.keys(common.generateData(2));

function createHash(value, algorithm, length)
{
    const _hash = crypto.createHash(algorithm);
    _hash.update(value);
    //
    return _hash.digest('hex').substr(0, length);
}

//------------------------------------------------------------------------------
// Valor por defecto.
//------------------------------------------------------------------------------
assert.assert('deepStrictEqual', new jfStorageKeyCrypto().build(data[0]), createHash(data[0], 'sha256', 8));
assert.assert('deepStrictEqual', new jfStorageKeyCrypto(null, null).build(data[0]), createHash(data[0], 'sha256', 8));
//------------------------------------------------------------------------------
// Varios algoritmos y longitudes
//------------------------------------------------------------------------------
for (let length = 4; length <= 32; length += 4)
{
    ['sha256', 'sha512', 'md4', 'md5'].forEach(
        algorithm =>
        {
            const _keyBuilder = new jfStorageKeyCrypto(algorithm, length);
            assert.assert('deepStrictEqual', _keyBuilder.algorithm, algorithm);
            assert.assert('deepStrictEqual', _keyBuilder.length, length);
            data.forEach(
                value => assert.assert(
                    'deepStrictEqual',
                    _keyBuilder.build(value),
                    createHash(value, algorithm, length)
                )
            );
        }
    );
}
