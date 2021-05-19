const hmac = require("crypto").createHmac, https = require('https');

/* *
* COIN SPOT API WRAPPER
* */

function Coinspot(key, secret) {
	const self = this;
	self.key = key;
	self.secret = secret;

	const request = function (path, postdata, callback) {
		const nonce = new Date().getTime();

		postdata = postdata || {};
		postdata.nonce = nonce;

		const stringmessage = JSON.stringify(postdata);
		const signedMessage = new hmac("sha512", self.secret);

		signedMessage.update(stringmessage);

		const sign = signedMessage.digest('hex');

		const options = {
			rejectUnauthorized: false,
			method: 'POST',
			host: 'www.coinspot.com.au',
			port: 443,
			path: path,
			headers: {
				'Content-Type': 'application/json',
				'sign': sign,
				'key': self.key
			}
		};

		const req = https.request(options, function (resp) {
			let data = '';
			resp.on('data', function (chunk) {
				data += chunk;
			});
			resp.on('end', function (chunk) {
				callback(null, data);
			});
		}).on("error", function (e) {
			callback(e, data);
		});

		req.write(stringmessage);
		req.end();
	};

	self.sendcoin = function(cointype, amount, address, callback) {
		request('/api/my/coin/send', {cointype:cointype, amount:amount, address:address}, callback);
	}

	self.coindeposit = function(cointype, callback) {
		request('/api/my/coin/deposit', {cointype:cointype}, callback);
	}

	self.quotebuy = function(cointype, amount, callback) {
		request('/api/quote/buy', {cointype:cointype, amount:amount}, callback);
	}

	self.quotesell = function(cointype, amount, callback) {
		request('/api/quote/sell', {cointype:cointype, amount:amount}, callback);
	}

	// self.balances = function(callback) {
	// 	request('/api/my/balances', {}, callback);
	// }

	self.orders = function(cointype, callback) {
		request('/api/orders', {cointype:cointype}, callback);
	}

	self.myorders = function(callback) {
		request('/api/my/orders', {}, callback);
	}

	self.spot = function(callback) {
		request('/api/spot', {}, callback);
	}

	self.buy = function(cointype, amount, rate, callback) {
		let data = {cointype:cointype, amount:amount, rate: rate}
		request('/api/my/buy', data, callback);
	}

	self.sell = function(cointype, amount, rate, callback) {
		let data = {cointype:cointype, amount:amount, rate: rate}
		request('/api/my/sell', data, callback);
	}

	// RO_API CALLS

	self.balances = function(callback) {
		request(`/api/ro/my/balances/`, {}, callback);
	}

	self.transactions = function(callback, startdate, enddate) {
		let range = {startdate:startdate, enddate:enddate}
		request(`/api/ro/my/transactions`, range, callback);
	}
}

module.exports = Coinspot;