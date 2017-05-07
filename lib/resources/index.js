/**
 * Module dependencies
 */
var CryptoJS = require('crypto-js'),
    EpaycoError = require('./errors');

// Constants
const BASE_URL = "https://api.secure.payco.co",
    BASE_URL_SECURE = "https://secure.payco.co";

/**
 * Resource constructor
 *
 * @param {Epayco} epayco
 */

function Resource(epayco) {
    this._epayco = epayco;
}

/**
 * Perform requests
 *
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 * @param {Boolean} switch
 */

Resource.prototype.request = function(method, url, data, sw) {
    var opts = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    //Set ip
    data["ip"] = getIp();

    if (sw) {
        data = setData(data, this._epayco.privateKey, this._epayco.apiKey, this._epayco.test);
        url = BASE_URL_SECURE + url;
    } else {
        url = BASE_URL + url;
    }

    if(method == 'get'){
        var arr = [];
        for (var i in data) {
            arr.push( encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
        }

        url += arr.join('&');
    } else {
        opts.body = JSON.stringify(data);
    }

    return fetch(url, opts);
};

function setData(data, privateKey, publicKey, test) {
    var set = {},
        hex = encryptHex(privateKey);
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            set[langkey(key)] = encrypt(data[key], privateKey);
        }
    };

    set["public_key"] = publicKey;
    set["i"] = hex.i;
    set["enpruebas"] = encrypt("TRUE", privateKey);
    set["lenguaje"] = "javascript";
    set["p"] = hex.p;
    return set;
}

/**
 * Traslate keys
 * @param  {string} value key eng
 * @return {string}       traslate key
 */
function langkey(value) {
    var obj = require("../keylang.json");
    return obj[value]
}

/**
 * Encrypt text
 * @param  {string} value plain text
 * @param  {string} key   private key user
 * @return {string}       text encrypt
 */
function encrypt(value, userKey) {
    var key = CryptoJS.enc.Hex.parse(userKey),
        iv = CryptoJS.enc.Hex.parse("0000000000000000"),
        text = CryptoJS.AES.encrypt(value, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return text.ciphertext.toString(CryptoJS.enc.Base64);
}

/**
 * Get bites petition secure
 * @param  {string} userKey private key user
 * @return {object}         bites from crypto-js
 */
function encryptHex(userKey) {
    var key = CryptoJS.enc.Hex.parse(userKey),
        iv = CryptoJS.enc.Hex.parse("0000000000000000");
    return {
        i: iv.toString(CryptoJS.enc.Base64),
        p: key.toString(CryptoJS.enc.Base64)
    }
}

/**
 * Get ip from server
 * @return {string} Server id
 */
function getIp() {
    return require('ip').address();
}

/**
 * Expose constructor
 */
module.exports = Resource;
