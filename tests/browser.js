const common          = require('./common');
const jfStorageCookie = require('../src/Cookie');
module.exports = (Class, Storage) =>
{
    class TestClass extends Class
    {
        constructor(...args)
        {
            jfStorageCookie.polyfill(global).splice(0);
            super(...args);
        }
    }

    common.run(TestClass);
    common.browser(TestClass, Storage);
};
