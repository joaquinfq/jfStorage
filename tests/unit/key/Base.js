const assert           = require('../../assert');
const common           = require('../../common');
const jfStorageKeyBase = require('../../../src/key/Base');
const data             = common.generateData();
// Verificamos que se devuelvan los datos sin modificar.
assert.assert('deepStrictEqual', new jfStorageKeyBase().build(data), data);
