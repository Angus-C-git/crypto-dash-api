const format = require('date-fns').format;

/**
 * Returns a buy - sell pair representing the users
 * net buys and net sales per month.
 * */
module.exports = getTransactionsOvertime = async (client) => {
	return new Promise(async (resolve, reject) => {
		// 	// Prepare for scuffed js
		client.transactions().then(transactions => {
			let investment_history = [];

			let last_month = null;
			let current_datapoint;

			transactions.buyorders.map((buyorder) => {

				let month = format(new Date(buyorder.created), 'MMMM');
				if (last_month === month) {
					current_datapoint.month = month;
					current_datapoint.buy += buyorder.audtotal;
				} else {
					current_datapoint = {
						month: month,
						buy: buyorder.audtotal,
						sell: 0
					};

					investment_history.push(current_datapoint);
				}

				last_month = month;
			});

			// Awkwardly merge sell data in
			transactions.sellorders.map((sellorder) => {
				let month = format(new Date(sellorder.created), 'MMMM');
				investment_history.forEach((datapoint) => {
					if (datapoint.month === month) {
						datapoint.sell += sellorder.audtotal;
						return true; // exit early
					}
				});
			});

			resolve(investment_history.reverse());

		}).catch(err => {
			console.error(`[>>] CS API :: Transactions overtime call failed ${err}`);
			reject(null);
		});
	})
}