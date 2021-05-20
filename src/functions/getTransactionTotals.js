/**
 * Returns a buy - sell pair representing the users
 * net buys and net sales respectively.
 * */
module.exports = getTransactionTotals = async (client) => {
	return new Promise((resolve, reject) => {
		try {
			client.transactions((err, data) => {

				let totals = {
					buy: 0,
					sell: 0
				};

				let transactions = JSON.parse(data);

				transactions.buyorders.map((buyorder) => {
					totals.buy += buyorder.audtotal;
				});

				transactions.sellorders.map((sellorder) => {
					totals.sell += sellorder.audtotal;
				});

				resolve(totals);
			});
		} catch (err) {
			console.error(`[>>] CS API :: Transactions call failed ${err}`);
			reject(null); // Error out
		}
	})
}