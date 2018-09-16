const assert                  = require('../../assert');
const common                  = require('../../common');
const jfStorageSerializerJson = require('../../../src/serializer/Json');
const serializer              = new jfStorageSerializerJson();
const data                    = common.generateData();
const json                    = JSON.stringify(data);
assert.assert('deepStrictEqual', serializer.serialize(data), json);
assert.assert('deepStrictEqual', serializer.unserialize(json), data);
// JSON incorrecto
assert.assert('deepStrictEqual', serializer.unserialize('{a:1}'), null);
