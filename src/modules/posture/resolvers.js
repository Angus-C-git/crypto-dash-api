const getCurrentWalletValue = require('../../functions/getCurrentWalletValue');
const getTransactionTotals = require('../../functions/getTransactionTotals');


const resolvers = {
	Query: {
		posture: async (_, __, {req, res, client}) => {

			if (!req.userId)
				return null;

			try {
				const transactions = await getTransactionTotals(client);
				const invest = transactions.buy;
				const worth = await getCurrentWalletValue(client) + transactions.sell; // + sells
				const profit = worth - invest;

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