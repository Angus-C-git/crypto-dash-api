const hmac = require("crypto").createHmac, https = require('https');
const fetch = require('node-fetch');

/* *
* COIN SPOT API CLASS
*
* TODO ::: Update other calls
* */

const BASE_URL = "https://www.coinspot.com.au";

class Coinspot {

	constructor(key, secret) {
		this.key = key;
		this.secret = secret;
	}

	async request(endpoint, postData) {
		let nonce = new Date().getTime();
		let postdata = postData || {};
		postdata.nonce = nonce;

		let stringmessage = JSON.stringify(postdata);
		let signedMessage = new hmac("sha512", this.secret);
		signedMessage.update(stringmessage);
		let sign = signedMessage.digest("hex");

		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				sign: sign,
				key: this.key
			},
			body: JSON.stringify({nonce})
		});

		const data = await response.json();

		if (data.status === 'error') {
			console.log(`[>>] REQUEST CALL CS FAILED :::::: ${JSON.stringify(data)}`);
			return await this.request(endpoint, postData);
		}

		return data;
	}

	// RW_API CALLS

	// self.sendcoin = function(cointype, amount, address, callback) {
	// 	request('/api/my/coin/send', {cointype:cointype, amount:amount, address:address}, callback);
	// }
	//
	// self.coindeposit = function(cointype, callback) {
	// 	request('/api/my/coin/deposit', {cointype:cointype}, callback);
	// }
	//
	// self.quotebuy = function(cointype, amount, callback) {
	// 	request('/api/quote/buy', {cointype:cointype, amount:amount}, callback);
	// }
	//
	// self.quotesell = function(cointype, amount, callback) {
	// 	request('/api/quote/sell', {cointype:cointype, amount:amount}, callback);
	// }
	//
	// self.orders = function(cointype, callback) {
	// 	request('/api/orders', {cointype:cointype}, callback);
	// }
	//
	// self.myorders = function(callback) {
	// 	request('/api/my/orders', {}, callback);
	// }
	//
	// self.spot = function(callback) {
	// 	request('/api/spot', {}, callback);
	// }
	//
	// self.buy = function(cointype, amount, rate, callback) {
	// 	let data = {cointype:cointype, amount:amount, rate: rate}
	// 	request('/api/my/buy', data, callback);
	// }
	//
	// self.sell = function(cointype, amount, rate, callback) {
	// 	let data = {cointype:cointype, amount:amount, rate: rate}
	// 	request('/api/my/sell', data, callback);
	// }

	// RO_API CALLS

	balances = async() => {
		return await this.request(`/api/ro/my/balances/`, {});
	}

	balance = async(cointype) => {
		return await this.request(`/api/ro/my/balances/${cointype}`, {});
	}

	transactions = async(startdate, enddate) => {
		let range = {startdate:startdate, enddate:enddate}
		return await this.request(`/api/ro/my/transactions`, range);
	}

	//
	// self.openorders = function(callback) {
	// 	return request(`/api/ro/my/transactions/open`, {}, callback);
	// }
	//
	// self.withdrawals = function(callback, startdate, enddate) {
	// 	let range = {startdate:startdate, enddate:enddate}
	// 	return request(`/api/ro/my/withdrawals`, range, callback);
	// }
	//
	// self.deposits = function(callback, startdate, enddate) {
	// 	let range = {startdate:startdate, enddate:enddate}
	// 	return request(`/api/ro/my/deposits`, range, callback);
	// }
}

module.exports = (key, secret) => {
	return new Coinspot(key, secret);
}