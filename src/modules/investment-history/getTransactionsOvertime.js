const format = require('date-fns').format;


module.exports = getTransactionsOvertime = async (client) => {
	return new Promise((resolve, reject) => {

		// Prepare for scuffed js
		client.transactions((err, data) => {
			let investment_history = [];

			let transactions = JSON.parse(data);

			let last_month = null;
			let current_datapoint;

			transactions.buyorders.map((buyorder) => {
				let month = format(new Date(buyorder.created), 'MMMM');
				if (last_month === month) {
					current_datapoint.month = month;
					current_datapoint.buy += buyorder.audtotal;
				} else {
					//console.log("CREATED NEW DATAPOINT :: ", month);
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

			//console.log(investment_history);
			resolve(investment_history);
		});
	})
}