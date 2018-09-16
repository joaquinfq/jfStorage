const assert           = require('../assert');
const common           = require('../common');
const jfStorageBase    = require('../../src/Base');
const proto            = jfStorageBase.prototype;
const interfaceMethods = [
    'clear',
    'getItem',
    'key',
    'removeItem',
    'setItem',
    'keys' // No es de la interfaz Storage pero lo implementan las clases jf.storage.
];
interfaceMethods.forEach(
    method =>
    {
        const _method = proto[method];
        assert.assert('ok', typeof _method === 'function');
        assert.assert('equal', _method(), undefined);
    }
);
assert.assert('ok', proto.hasOwnProperty('length'));
assert.assert('equal', proto.length, 0);
//------------------------------------------------------------------------------
// Probando el método `_checkKey`.
//------------------------------------------------------------------------------
const wrongKeys = common.wrongKeys();
wrongKeys.forEach(
    key => assert.assert('equal', proto._checkKey(key), false)
);
// Si las claves inválidas se convierten a string, se aceptan.
[...wrongKeys.map(String), -1, 0, 1, '', 'a'].forEach(
    key => assert.assert('ok', proto._checkKey(key))
);
//------------------------------------------------------------------------------
// Probando el método `_checkIndex`.
//------------------------------------------------------------------------------
[...wrongKeys, -1, -10, 100].forEach(
    index => assert.assert('equal', proto._checkIndex(index, 99), false)
);
// Si las claves inválidas se convierten a string, se aceptan.
[0, 1, 10, 100].forEach(
    index => assert.assert('ok', proto._checkKey(index, 100))
);
