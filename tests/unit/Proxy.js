const assert                  = require('../assert');
const common                  = require('../common');
const jfStorageMemory         = require('../../src/Memory');
const jfStorageProxy          = require('../../src/Proxy');
const jfStorageKeyBase        = require('../../src/key/Base');
const jfStorageSerializerBase = require('../../src/serializer/Base');

class Serializer extends jfStorageSerializerBase
{
    constructor()
    {
        super();
        this.serializeCall   = null;
        this.unserializeCall = null;
    }

    serialize(value)
    {
        this.serializeCall = 'serialize-' + value;
        //
        return value;
    }

    unserialize(value)
    {
        this.unserializeCall = 'unserialize-' + value;
        //
        return value;
    }
}

common.run(
    class extends jfStorageProxy
    {
        constructor()
        {
            super(jfStorageMemory, null);
        }
    }
);
common.run(
    class extends jfStorageProxy
    {
        constructor()
        {
            super(
                jfStorageMemory,
                {
                    serializer : new Serializer()
                }
            );
        }
    }
);
//------------------------------------------------------------------------------
// Verifica que se lance una excepción si no se especifica la clase jf.storage.
//------------------------------------------------------------------------------
require('../assert').assert(
    'throws',
    () => new jfStorageProxy(),
    new Error('You must specify a jf.storage class to use')
);
//------------------------------------------------------------------------------
// Verificamos el uso de $$buildKey
//------------------------------------------------------------------------------
const buildKey = new jfStorageKeyBase();
const data     = {};
let storage    = common.createStorage(jfStorageProxy, data, 10, jfStorageMemory, { key : buildKey });
const keys     = Object.keys(data);
keys.forEach(key => storage.setItem(key, data[key]));
assert.assert('deepStrictEqual', storage.keys(), keys.map(buildKey.build));
//------------------------------------------------------------------------------
// Verificamos el uso de los serializadores.
//------------------------------------------------------------------------------
const serializer = new Serializer();
storage          = new jfStorageProxy(jfStorageMemory, { serializer });
keys.forEach(
    key =>
    {
        serializer.unserializeCall = null;
        const _value               = data[key];
        storage.setItem(key, _value);
        assert.assert('equal', serializer.serializeCall, 'serialize-' + _value);
        assert.assert('equal', serializer.unserializeCall, null);
        serializer.serializeCall = null;
        storage.getItem(key);
        assert.assert('equal', serializer.serializeCall, null);
        assert.assert('equal', serializer.unserializeCall, 'unserialize-' + _value);
    }
);
