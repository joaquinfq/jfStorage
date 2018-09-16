const assert                  = require('../../assert');
const common                  = require('../../common');
const jfStorageSerializerBase = require('../../../src/serializer/Base');
const serializer              = new jfStorageSerializerBase();
const data                    = common.generateData();
// Verificamos que se devuelvan los datos sin modificar.
assert.assert('deepStrictEqual', serializer.serialize(data), data);
assert.assert('deepStrictEqual', serializer.unserialize(data), data);
