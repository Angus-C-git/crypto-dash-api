const hmac = require("crypto").createHmac, https = require('https');
const fetch = require('node-fetch');

/* *
* COIN SPOT API CLASS
*
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

	sendcoin = async(cointype, amount, address, callback) => {
		return await this.request('/api/my/coin/send', {cointype:cointype, amount:amount, address:address}, callback);
	}

	coindeposit = async(cointype, callback) => {
		return await this.request('/api/my/coin/deposit', {cointype:cointype}, callback);
	}

	quotebuy = async(cointype, amount, callback) => {
		return await this.request('/api/quote/buy', {cointype:cointype, amount:amount}, callback);
	}

	quotesell = async(cointype, amount, callback) => {
		return await this.request('/api/quote/sell', {cointype:cointype, amount:amount}, callback);
	}

	orders = async(cointype, callback) => {
		return await this.request('/api/orders', {cointype:cointype}, callback);
	}

	myorders = async(callback) => {
		return await this.request('/api/my/orders', {}, callback);
	}

	spot = async(callback) => {
		return await this.request('/api/spot', {}, callback);
	}

	buy = async(cointype, amount, rate, callback) => {
		let data = {cointype:cointype, amount:amount, rate: rate}
		return await this.request('/api/my/buy', data, callback);
	}

	sell = async(cointype, amount, rate, callback) => {
		let data = {cointype:cointype, amount:amount, rate: rate}
		return await this.request('/api/my/sell', data, callback);
	}

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

	openorders = async(callback) => {
		return await this.request(`/api/ro/my/transactions/open`, {}, callback);
	}

	withdrawals = async(callback, startdate, enddate) => {
		let range = {startdate:startdate, enddate:enddate}
		return this.request(`/api/ro/my/withdrawals`, range, callback);
	}

	deposits = async(callback, startdate, enddate) => {
		let range = {startdate:startdate, enddate:enddate}
		return this.request(`/api/ro/my/deposits`, range, callback);
	}
}


module.exports = (key, secret) => {
	return new Coinspot(key, secret);
}