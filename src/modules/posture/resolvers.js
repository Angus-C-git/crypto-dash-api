const authError = require('../../constants/error-constants');
const getCurrentWalletValue = require('./getCurrentWalletValue');
const getTransactionTotals = require('./getTransactionTotals');

const resolvers = {
	Query: {
		posture: async (_, __, {req, res, client}) => {

			if (!req.userId)
				return authError;

			const transactions = await getTransactionTotals(client);
			const invest = transactions.buy;
			const worth = await getCurrentWalletValue(client) + transactions.sell; // + sells
			const profit = worth - invest;

			return {
				profit: profit,
				invest: invest,
				worth: worth
			};
		}
	}
}

module.exports = resolvers;