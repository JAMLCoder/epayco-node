import Bank from './bank';
import Cash from './cash';


export class Epayco {
	constructor (options) {
		if (
			'string' != typeof options.apiKey ||
			'string' != typeof options.privateKey ||
			'string' != typeof options.lang ||
			'boolean' != typeof options.test
		) {
			throw new EpaycoError(options.lang, 100);
		}

		/**
	     * Init settings
	     */
	    this.apiKey = options.apiKey;
	    this.privateKey = options.privateKey;
	    this.lang = options.lang;
	    this.test = options.test ? 'TRUE' : 'FALSE';

	    /**
	     * Resources
	     */
	    //this.token = new Token(this);
	    //this.customers = new Customers(this);
	    //this.plans = new Plans(this);
	    //this.subscriptions = new Subscriptions(this);
	    this.bank = new Bank(this);
	    this.cash = new Cash(this);
	    //this.charge = new Charge(this);
	}

	/**
	 * Encrypt text
	 * @param  {string} value plain text
	 * @param  {string} key   private key user
	 * @return {string}       text encrypt
	 */
	_encrypt (value, userKey) {
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
	_encryptHex(userKey) {
	    var key = CryptoJS.enc.Hex.parse(userKey),
	        iv = CryptoJS.enc.Hex.parse("0000000000000000");
	    return {
	        i: iv.toString(CryptoJS.enc.Base64),
	        p: key.toString(CryptoJS.enc.Base64)
	    }
	}

	_setData (data, test) {
	    var dat = {},
	        hex = this._encryptHex(this.privateKey);
	    for (var key in data) {
	        if (data.hasOwnProperty(key)) {
	            dat[langkey(key)] = this._encrypt(data[key], privateKey);
	        }
	    };

	    dat.public_key = this._epayco.apiKey;
	    dat.i = hex.i;
	    dat.enpruebas = this._encrypt('TRUE', privateKey);
	    dat.lenguaje = 'javascript';
	    dat.p = hex.p;

	    return dat;
	}

	async _request (method, url, data, sw){
		var opts = {
	        method,
	        headers: {
	            'Accept': 'application/json',
	            'Content-Type': 'application/json'
	        }
	    };

	    //Set ip
	    data.ip = await await fetch('https://api.ipify.org/');

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
	}
}