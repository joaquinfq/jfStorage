const assert      = require('assert');
let numAssertions = 0;
module.exports    = {
    get numAssertions()
    {
        return numAssertions;
    },
    assert(name, ...args)
    {
        try
        {
            assert[name](...args);
            ++numAssertions;
        }
        catch (e)
        {
            const _stack = e.stack.split('\n');
            const _unit  = _stack.find(line => line.includes('/tests/unit/'));
            if (_unit)
            {
                const _info = _unit.match(/\/tests\/unit\/([^:]+):(\d+):(\d+)/);
                if (_info)
                {
                    console.log('%s:%s:%s -- %s', _info[1], _info[2], _info[3], _stack.slice(2).find(line => !line.includes('assert.js')).trim());
                }
            }
            console.log('ERROR: %s', e.message);
        }
    }
};
