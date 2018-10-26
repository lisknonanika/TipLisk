const lisk = require('lisk-elements').default;

const MODE = 0; //0:TESTNET, 1:MAINNET

const ADDRESS_TESTNET = '';
const PASSPHRASE_TESTNET = '';
const SECONDPASSPHRASE_TESTNET = '';

const ADDRESS_MAINNET = '';
const PASSPHRASE_MAINNET = '';
const SECONDPASSPHRASE_MAINNET = '';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: false,
        writable: false,
        configurable: false
    });
}

if (MODE === 0) {
    // TESTNET
    define("client", lisk.APIClient.createTestnetAPIClient());
    define("address", ADDRESS_TESTNET);
    define("passphrase", PASSPHRASE_TESTNET);
    define("secondPassphrase", SECONDPASSPHRASE_TESTNET);

} else {
    // MAINNET
    define("client", lisk.APIClient.createMainnetAPIClient());
    define("address", ADDRESS_MAINNET);
    define("passphrase", PASSPHRASE_MAINNET);
    define("secondPassphrase", SECONDPASSPHRASE_MAINNET);
}