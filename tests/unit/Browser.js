const browser          = require('../browser');
const common           = require('../common');
const jfStorageBrowser = require('../../src/Browser');
const jfStorageMemory  = require('../../src/Memory');
let name;

class TestBrowser extends jfStorageBrowser
{
    constructor()
    {
        if (name)
        {
            global.window = {};
        }
        super(jfStorageMemory);
    }

    static get NAME()
    {
        return name;
    }
}

require('../assert').assert(
    'throws',
    () => new jfStorageBrowser(),
    new Error('You must specify a jf.storage class to use')
);
common.run(TestBrowser);
name = 'browser-storage';
browser(TestBrowser, jfStorageMemory);
