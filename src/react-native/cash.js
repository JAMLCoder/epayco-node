
export class cash {
	constructor(that){
		this.that = that;
	}

	get (){
		return this.that._request('get', `/restpagos/transaction/response.json?ref_payco=${uid}&public_key=${this.that.apiKey}`, {}, true);
	}

	create(name, options){
		return this.that._request('post', `/restpagos/pagos/${name}.json`, options, true);
	}
}