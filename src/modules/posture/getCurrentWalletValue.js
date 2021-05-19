
module.exports = getCurrentWalletValue = async (client) => {
	return new Promise((resolve, reject) => {
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
	})
}