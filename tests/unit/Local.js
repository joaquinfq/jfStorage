const browser         = require('../browser');
const jfStorageCookie = require('../../src/Cookie');
const jfStorageLocal  = require('../../src/Local');
browser(jfStorageLocal, jfStorageCookie);
