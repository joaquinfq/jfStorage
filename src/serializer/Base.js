/**
 * Class used for serializing data before save in storage.
 *
 * @namespace jf.storage.serializer
 * @class     jf.storage.serializer.Base
 */
module.exports = class jfStorageSerializerBase
{
    /**
     * Serialize value and convert to value to save in storage.
     *
     * @param {*} value Value to convert.
     *
     * @return {*} Value converted.
     */
    serialize(value)
    {
        return value;
    }

    /**
     * Unserialize stored value to original value.
     *
     * @param {*} value Value to convert.
     *
     * @return {*} Value converted.
     */
    unserialize(value)
    {
        return value;
    }
};
