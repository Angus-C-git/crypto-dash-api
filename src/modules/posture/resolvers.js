const getCurrentWalletValue = require('../../functions/getCurrentWalletValue');
const getTransactionTotals = require('../../functions/getTransactionTotals');


const resolvers = {
	Query: {
		posture: async (_, __, {req, client}) => {

			if (!req.userId)
				return null;

			try {
				const transactions = await getTransactionTotals(client);
				const invest = Number.parseFloat(transactions.buy).toPrecision(6);
				const worth = Number.parseFloat(await getCurrentWalletValue(client) + transactions.sell).toPrecision(6); // + sells
				const profit = Number.parseFloat(worth - invest).toPrecision(6);

				return {
					profit: profit,
					invest: invest,
					worth: worth
				};

			} catch (err) {
				console.error(`[>>] API :: posture call failed sub API level error ${err}`);
				return null;
			}
		}
	}
}


module.exports = resolvers;