const common        = require('../common');
const jffs          = require('jf-file-system').i();
const jfStorageFile = require('../../src/File');

function init()
{
    const _dir = jfStorageFile.DIR;
    if (jffs.exists(_dir))
    {
        jffs.rmdir(_dir);
    }
    jffs.mkdir(_dir);
}

init();
let showLogs = true;
common.run(
    class FileTest extends jfStorageFile
    {
        constructor(...args)
        {
            init();
            super(...args);
        }

        log()
        {
            if (showLogs)
            {
                this.showLogs = true;
                showLogs      = false;
            }
            super.log('debug');
            this.showLogs = false;
        }

        static get DIR()
        {
            return jfStorageFile.DIR;
        }
    }
);
