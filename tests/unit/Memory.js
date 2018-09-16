const assert          = require('../assert');
const common          = require('../common');
const jfStorageMemory = require('../../src/Memory');
common.run(jfStorageMemory);
const storage = new jfStorageMemory();
const proto   = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'toLocaleString',
    'toString',
    'valueOf'
];
proto.forEach(
    name =>
    {
        assert.assert('deepEqual', storage.getItem(name), null);
        storage.removeItem(name);
        assert.assert('deepEqual', typeof storage.$$data[name], 'function');
    }
);
