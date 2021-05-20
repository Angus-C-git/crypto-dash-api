/**
 * Returns the users current wallet value in AUD.
 * */
module.exports = getCurrentWalletValue = async (client) => {
	return new Promise((resolve, reject) => {
		try {
			client.balances((err, data) => {
				let worth = 0;
				let balances = JSON.parse(data).balances;
				balances.map((coin) => {
					let key = Object.keys(coin)[0];
					let value = coin[key].audbalance;
					worth += value;
				});

				resolve(worth);
			});
		} catch (err) {
			console.error(`[>>] CS API :: Balances call failed ${err}`);
			reject(null); // Error out
		}
	})
}