/**
 * Returns the users holdings as a list of
 * coin - aud value pairs.
 * */
module.exports = getProfile = async (client) => {
	return new Promise((resolve, reject) => {
		try {
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
		} catch (err) {
			console.error(`[>>] CS API :: Balances call failed ${err}`);
			reject(null); // Error out
		}

	})
}