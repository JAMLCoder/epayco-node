
export class bank {
	constructor(that){
		this.that = that;
	}

	get (options){
		return this.that._request('get', `/restpagos/pse/transactioninfomation.json?transactionID=${uid}&public_key=${this.that.apiKey}`, {}, true);
	}

	create (options){
		return this.that._request('post', '/restpagos/pagos/debitos.json', options, true);
	}

	listBank (){
		return this.that._request('get', `/restpagos/pse/bancos.json?public_key=${this.that.apiKey}`, {}, true);
	}
}