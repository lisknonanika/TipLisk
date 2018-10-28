const lisk = require('lisk-elements').default;
const config = require('config');

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: false,
        writable: false,
        configurable: false
    });
}

var client = config.mode === 'test'? lisk.APIClient.createTestnetAPIClient():
                                     lisk.APIClient.createMainnetAPIClient();
define('LiskClient', client);
define('lisk', config.lisk);
define('mongo', config.mongo);