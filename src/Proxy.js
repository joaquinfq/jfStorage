const jfStorageBase           = require('./Base');
const jfStorageKeyBase        = require('./key/Base');
const jfStorageSerializerBase = require('./serializer/Base');
/**
 * Class used as proxy for storage allowing serialize/unserialize data.
 * se
 *
 * For example, if we want to serialize data using JSON:
 *
 * ```
 * const storage = new jfStorageProxy(
 *     jfStorageMemory,
 *     {
 *         serializer : new jfStorageSerializerJson()
 *     }
 * );
 * ```
 *
 * @namespace jf.storage
 * @class     jf.storage.Proxy
 * @extends   jf.storage.Base
 */
module.exports = class jfStorageProxy extends jfStorageBase
{
    /**
     * @inheritDoc
     */
    get length()
    {
        return this.$$storage.length;
    }

    /**
     * Class constructor.
     *
     * @param {Class|jf.storage.Base} Class  Storage class reference to create a storage instance.
     * @param {object}                  config Config with functions to use for encoding/decoding data.
     */
    constructor(Class = null, config = {})
    {
        super();
        if (!config)
        {
            config = {};
        }
        /**
         * Function to use for obsfuscating keys when inspecting serialized data.
         *
         * @type {jf.storage.key.Base|null}
         */
        this.$$key = config.key || null;
        /**
         * Serializer to use for data in storage.
         *
         * @type {jf.storage.serializer.Base|null}
         */
        this.$$serializer = config.serializer || null;
        /**
         * Storage object to use.
         *
         * @type {Class|jf.storage.Base}
         */
        this.$$storage = config.storage || null;
        //------------------------------------------------------------------------------
        this._initStorage(Class);
    }

    /**
     * @inheritDoc
     */
    clear()
    {
        this.$$storage.clear();
    }

    /**
     * @inheritDoc
     */
    key(index)
    {
        return this.$$storage.key(index);
    }

    /**
     * @inheritDoc
     */
    keys()
    {
        return this.$$storage.keys();
    }

    /**
     * @inheritDoc
     */
    getItem(key)
    {
        return this.$$serializer.unserialize(
            this.$$storage.getItem(
                this.$$key.build(key)
            )
        );
    }

    /**
     * Initialize storage instance.
     *
     * @param {Class|jf.storage.Base} Class Storage class reference to create a storage instance.
     *
     * @protected
     */
    _initStorage(Class)
    {
        if (!(this.$$key instanceof jfStorageKeyBase))
        {
            this.$$key = new jfStorageKeyBase();
        }
        if (!(this.$$serializer instanceof jfStorageSerializerBase))
        {
            this.$$serializer = new jfStorageSerializerBase();
        }
        if (!this.$$storage)
        {
            if (jfStorageBase.isPrototypeOf(Class))
            {
                this.$$storage = new Class();
            }
            else
            {
                throw new Error('You must specify a jf.storage class to use');
            }
        }
    }

    /**
     * @inheritDoc
     */
    removeItem(key)
    {
        return this.$$storage.removeItem(
            this.$$key.build(key)
        );
    }

    /**
     * @inheritDoc
     */
    setItem(key, value)
    {
        return this.$$storage.setItem(
            this.$$key.build(key, value),
            this.$$serializer.serialize(value)
        );
    }
};
