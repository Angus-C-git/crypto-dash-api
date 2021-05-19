
module.exports = getTransactionTotals = async (client) => {
	return new Promise((resolve, reject) => {
		client.transactions((err, data) => {

			let totals = {
				buy: 0,
				sell: 0
			}
			let transactions = JSON.parse(data);

			//console.log(" TRANSATIONS :::: \n\n", transactions);


			transactions.buyorders.map((buyorder) => {
				totals.buy += buyorder.audtotal;
			});

			transactions.sellorders.map((sellorder) => {
				totals.sell += sellorder.audtotal;
			});

			resolve(totals);
		});
	})
}