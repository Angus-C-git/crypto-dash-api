/**
 * Returns the users holdings as a list of
 * coin - aud value pairs.
 * */
module.exports = getProfile = async (client) => {
	return new Promise(async (resolve, reject) => {
		client.balances().then(data => {
			let balances = data.balances;
			let wallet = [];

			balances.map((name) => {
				let key = Object.keys(name)[0];
				let value = name[key].audbalance;
				wallet.push({
					name: key,
					value: value
				});
			});

			resolve(wallet);

		}).catch(err => {
			console.error(`[>>] CS API :: Balances call failed for get profile ${err}`);
			reject(null);
		});
	});
}