
module.exports = getProfile = async (client) => {
	return new Promise((resolve, reject) => {
		client.balances((err, data) => {
			let wallet = [];

			let balances = JSON.parse(data).balances;
			balances.map((name) => {
				let key = Object.keys(name)[0];
				let value = name[key].audbalance;
				wallet.push({
					coin: key,
					value: value
				});

			});

			resolve(wallet);
		});
	})
}