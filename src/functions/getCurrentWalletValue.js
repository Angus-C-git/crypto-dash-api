/**
 * Returns the users current wallet value in AUD.
 * */
module.exports = getCurrentWalletValue = async (client) => {
	return new Promise(async (resolve, reject) => {
		client.balances().then(data => {
			let worth = 0;
			let balances = data.balances;

			balances.map((coin) => {
				let key = Object.keys(coin)[0];
				let value = coin[key].audbalance;
				worth += value;
			});

			resolve(worth);

		}).catch(err => {
			console.error(`[>>] CS API :: Balances call failed for get current wallet ${err}`);
			reject(null);
		});
	});
}
