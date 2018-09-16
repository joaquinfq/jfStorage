/**
 * Pruebas del paquete jf-storage.
 */
const jffs = require('jf-file-system').i();
jffs.log = () => null;
jffs.scandir(require('path').join(__dirname, 'tests', 'unit'))
    .filter(file => file.endsWith('.js') && file !== 'assert.js')
    .forEach(
        file =>
        {
            global.document = {};
            global.window   = {};
            require(file);
            delete global.document;
            delete global.window;
        }
    );
jffs.rmdir('/tmp/jfStorageFile');
console.log('\nTotal aserciones: %s', require('./tests/assert').numAssertions);
