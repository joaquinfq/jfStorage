const jfFileSystem  = require('jf-file-system');
const jfStorageBase = require('./Base');
const path          = require('path');
/**
 * Class using filesystem as storage.
 *
 * @namespace jf.storage
 * @class     jf.storage.Memory
 * @extends   jf.storage.Base
 */
module.exports = class jfStorageFile extends jfStorageBase
{
    /**
     * @inheritDoc
     */
    constructor(directory = '', extension = '')
    {
        super();
        /**
         * Directory to use for storing files.
         *
         * @type {string}
         */
        this.$$directory = directory || this.constructor.DIR;
        /**
         * Extension of generated file.
         *
         * @type {string}
         */
        this.extension = extension || '';
        /**
         * Filesystem handler.
         *
         * @type {jf.FileSystem}
         */
        this.$$jffs = new jfFileSystem();
        /**
         * Show console logs?
         *
         * @type {boolean}
         */
        this.showLogs = false;
        //------------------------------------------------------------------------------
        this.$$jffs.on(
            'log',
            data =>
            {
                this.log(
                    data.level,
                    `[${new Date().toISOString().substr(0, 19).replace('T', ' ')}] ${data.label}`,
                    ...data.args
                );
                delete data.label;
            }
        );
    }

    /**
     * Default directory for cache files.
     *
     * @return {string} Path to cache directory.
     */
    static get DIR()
    {
        return '/tmp/' + this.name;
    }

    /**
     * @inheritDoc
     */
    get length()
    {
        return this.keys().length;
    }

    /**
     * Build filename from `key` and `this.$$directory`.
     *
     * @param {string} key Path relative to file.
     *
     * @return {string} Filename to use.
     *
     * @protected
     */
    _buildFilename(key)
    {
        return path.join(this.$$directory, key) + this.extension;
    }

    /**
     * @inheritDoc
     */
    clear()
    {
        this.$$jffs.rmdir(this.$$directory);
    }

    /**
     * @inheritDoc
     */
    key(index)
    {
        const _keys = this.keys();
        //
        return this._checkIndex(index, _keys.length)
            ? _keys[index]
            : null;
    }

    /**
     * @inheritDoc
     */
    keys()
    {
        const _dir = this.$$directory;
        //
        return this.$$jffs
            .scandir(_dir)
            .map(file => path.relative(_dir, file));
    }

    /**
     * @inheritDoc
     */
    getItem(key)
    {
        let _item;
        if (this._checkKey(key))
        {
            const _filename = this._buildFilename(key);
            const _jffs     = this.$$jffs;
            _item           = _jffs.exists(_filename)
                ? _jffs.read(_filename)
                : null;
        }
        else
        {
            _item = null;
        }
        //
        return _item;
    }

    /**
     * Show console logs.
     *
     * @param {string} level Level of logging.
     * @param {array}  args  Arguments to console functions.
     */
    log(level, ...args)
    {
        if (this.showLogs)
        {
            console[level](...args);
        }
    }

    /**
     * @inheritDoc
     */
    removeItem(key)
    {
        if (this._checkKey(key))
        {
            this.$$jffs.rmdir(
                this._buildFilename(key)
            );
        }
    }

    /**
     * @inheritDoc
     */
    setItem(key, value)
    {
        if (this._checkKey(key))
        {
            this.$$jffs.write(this._buildFilename(key), String(value));
        }
    }
};
