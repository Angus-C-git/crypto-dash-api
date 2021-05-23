/**
 * Returns a buy - sell pair representing the users
 * net buys and net sales respectively.
 * */
module.exports = getTransactionTotals = async (client) => {
	return new Promise(async (resolve, reject) => {

		client.transactions().then(transactions => {

			let totals = {
				buy: 0,
				sell: 0
			};

			transactions.buyorders.map((buyorder) => {
				totals.buy += buyorder.audtotal;
			});

			transactions.sellorders.map((sellorder) => {
				totals.sell += sellorder.audtotal;
			});

			resolve(totals);

		}).catch(err => {
			console.error(`[>>] CS API :: Transaction totals call failed ${err}`);
			reject(null);
		});
	})
}