/**
 * The Storage interface of the Web Storage API provides access to a
 * particular domain's session or local storage.
 *
 * It allows, for example, the addition, modification, or deletion of stored data items.
 *
 * @namespace jf.storage
 * @class     jf.storage.Base
 */
module.exports = class jfStorageBase
{
    /**
     * Returns an integer representing the number of data items stored in the storage object.
     *
     * @return {number} Number of items in storage.
     */
    get length()
    {
        return 0;
    }

    /**
     * This method must atomically cause the list associated with the object to be
     * emptied of all key/value pairs, if there are any.
     *
     * If there are none, then the method must do nothing.
     */
    clear()
    {
    }

    /**
     * Check if storage index is valid.
     *
     * @param {number} index Index to check.
     * @param {number} max   Max value for index.
     *
     * @return {boolean} `true`if index is valid.
     *
     * @protected
     */
    _checkIndex(index, max = 0)
    {
        return typeof index === 'number' && index >= 0 && index < max;
    }

    /**
     * Check if storage key is valid.
     *
     * @param {string} key Key to check.
     *
     * @return {boolean} `true`if key is valid.
     *
     * @protected
     */
    _checkKey(key)
    {
        const _type = typeof key;

        return _type === 'number' || _type === 'string';
    }

    /**
     * This method must return the name of the nth key in the list.
     *
     * The order of keys is user-agent defined, but must be consistent within an object
     * so long as the number of keys doesn't change.
     *
     * Thus, adding or removing a key may change the order of the keys, but merely
     * changing the value of an existing key must not.
     *
     * If `index` is greater than or equal to the number of key/value pairs in the object,
     * then this method must return null.

     * @param {number} index An integer representing the number of the key you want to get the name of.
     *                       This is a zero-based index.
     *
     * @return {DOMString|null} A DOMString containing the name of the key.
     */
    key(index)
    {
    }

    /**
     * Return all keys in storage.
     *
     * @return {string[]} Keys in storage.
     */
    keys()
    {
    }

    /**
     * Return the current value associated with the given key.
     *
     * If the given key does not exist in the list associated with the
     * object then this method must return null.
     *
     * @param {string} key Key to search in storage.
     *
     * @return {*|null} Value of given key or `null` if not exists.
     */
    getItem(key)
    {
    }

    /**
     * Cause the key/value pair with the given key to be removed from the list
     * associated with the object, if it exists.
     *
     * If no item with that key exists, the method must do nothing.
     *
     * @param {string} key Key to be removed from storage.
     */
    removeItem(key)
    {
    }

    /**
     * This method must first check if a key/value pair with the given key
     * already exists in the list associated with the object.
     *
     * If it does not, then a new key/value pair must be added to the list,
     * with the given key and with its value set to value.
     *
     * If the given key does exist in the list, and its value is not equal to value,
     * then it must have its value updated to value. If its previous value is equal
     * to value, then the method must do nothing.
     *
     * If it couldn't set the new value, the method must throw a `QuotaExceededError`
     * DOMException exception.
     *
     * @param {string} key   Key to set in storage.
     * @param {*}      value Value to set in storage.
     */
    setItem(key, value)
    {
    }
};
