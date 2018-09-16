const jfStorageSerializerBase = require('./Base');
/**
 * Serialize data in storage using JSON format.
 *
 * @namespace jf.storage.serializer
 * @class     jf.storage.serializer.Json
 * @extends   jf.storage.serializer.Base
 */
module.exports = class jfStorageSerializerJson extends jfStorageSerializerBase
{
    /**
     * @inheritDoc
     */
    serialize(value)
    {
        return JSON.stringify(value);
    }

    /**
     * @inheritDoc
     */
    unserialize(value)
    {
        try
        {
            value = JSON.parse(value);
        }
        catch (e)
        {
            value = null;
        }

        return value;
    }
};
