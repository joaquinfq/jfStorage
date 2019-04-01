const jfStorageBase           = require('../src/Base');
const jfStorageKeyBase        = require('../src/key/Base');
const jfStorageMemory         = require('../src/Memory');
const jfStorageProxy          = require('../src/Proxy');
const jfStorageSerializerBase = require('../src/serializer/Base');
const jfStorageTestsStorage   = require('./_Storage');

class ProxyTest extends jfStorageProxy
{
    constructor(config)
    {
        super(jfStorageMemory, config);
    }
}

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

/**
 * Pruebas unitarias de la clase `jf.storage.Proxy`.
 */
module.exports = class jfStorageProxyTest extends jfStorageTestsStorage
{
    /**
     * @override
     */
    static get title()
    {
        return 'jf.storage.Proxy';
    }

    /**
     * @override
     */
    constructor()
    {
        super(ProxyTest);
    }

    /**
     * Comprueba la herencia de la clase.
     */
    testInheritance()
    {
        this._testInheritance(ProxyTest, jfStorageBase);
    }

    /**
     * Pruebas del método `constructor`.
     */
    testConstructor()
    {
        const _config = {
            key        : new jfStorageKeyBase(),
            serializer : new jfStorageSerializerBase(),
            storage    : new jfStorageMemory()
        };
        const _storage = new jfStorageProxy(null, _config);
        [ 'key', 'serializer', 'storage'].forEach(
            property => this.assertEqual(_storage[`$$${property}`], _config[property])
        );
    }

    /**
     * Pruebas del método `constructor` sin configuración.
     */
    testConstructorNoConfig()
    {
        const _storage = new jfStorageProxy(jfStorageMemory, null);
        [ 'Key', 'Serializer'].forEach(
            property => this.assertEqual(_storage[`$$${property.toLowerCase()}`].constructor.name, `jfStorage${property}Base`)
        );
        this.assertEqual(_storage.$$storage.constructor.name, `jfStorageMemory`)
    }

    /**
     * Pruebas del método `constructor` sin parámetros.
     */
    testConstructorNoParams()
    {
        this._assert(
            'throws',
            () => new jfStorageProxy(),
            new Error('You must specify a jf.storage class to use')
        );
        const _storage = new jfStorageProxy(jfStorageMemory, null);
        [ 'Key', 'Serializer'].forEach(
            property => this.assertEqual(_storage[`$$${property.toLowerCase()}`].constructor.name, `jfStorage${property}Base`)
        );
        this.assertEqual(_storage.$$storage.constructor.name, `jfStorageMemory`)
    }

    /**
     * Pruebas del serializador.
     */
    testSerializer()
    {
        const _buildKey   = new jfStorageKeyBase();
        const _data       = {};
        let _storage      = this.createStorage(_data, jfStorageMemory, { key : _buildKey });
        const _keys       = Object.keys(_data);
        const _serializer = new Serializer();
        _storage          = new jfStorageProxy(jfStorageMemory, { serializer : _serializer });
        _keys.forEach(
            key =>
            {
                _serializer.unserializeCall = null;
                const _value                = _data[key];
                _storage.setItem(key, _value);
                this.assertEqual(_serializer.serializeCall, 'serialize-' + _value);
                this.assertNull(_serializer.unserializeCall);
                _serializer.serializeCall = null;
                _storage.getItem(key);
                this.assertNull(_serializer.serializeCall);
                this.assertEqual(_serializer.unserializeCall, 'unserialize-' + _value);
            }
        );
    }
};
