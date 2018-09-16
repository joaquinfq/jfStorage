# jf-storage 0.0.1 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![npm install jf-storage](https://nodei.co/npm/jf-storage.png?compact=true)](https://npmjs.org/package/jf-storage/)

Several classes and polyfills implementing Web Storage API.

You can store item in memory, cookies, files, browser storage, etc. Also, you can encrypt/decrypt data 
in storage using `jf.storage.serializer` classes, and obfuscate keys using key builders.

## Proxy

`jf.storage.Proxy` it's a proxy to other storages but allow us to do advanced things 
adding some behaviors through injection dependency. 

### Example

We want store data requested to servers with following requirements:

- Store data in files.
- Data in files must be stored using JSON format.
- Filename must be first 6 chars in `MD5` hash of URLs.
  If data is read from `http://joaquinfernandez.net/api/users/1`, filename will be `05fdf4.json`


```javascript
const jfStorageFile           = require('jf-storage/src/File');
const jfStorageKeyCrypto      = require('jf-storage/src/key/Crypto');
const jfStorageProxy          = require('jf-storage/src/Proxy');
const jfStorageSerializerJson = require('jf-storage/src/serializer/Json');

function doRequest(url)
{
    return {
        firstname : 'Homer',
        lastname  : 'Simpson'
    };    
}

const storage = new jfStorageProxy(
    {
        key        : new jfStorageKeyCrypto('md5', 6),
        serializer : new jfStorageSerializerJson(),
        storage    : new jfStorageFile('/path/to/cache/directory', '.json')
    }
);

// Read data from server.
const url      = 'http://joaquinfernandez.net/api/users/1';
const response = doRequest(url);
// Store in cache.
storage.setItem(url, response);

//...
//...
//...

// Retrieve data:
const data = storage.getItem(url);
console.log(data); // { firstname : 'Homer', lastname : 'Simpson' }
```

Response will be stored in `/path/to/cache/directory/05fdf4.json`.
