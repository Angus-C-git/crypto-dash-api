const getTransactionTotals = require('../../functions/getTransactionsOvertime');

const resolvers = {
	Query: {
		investment_history: async (_, __, {req, res, client}) => {

			if (!req.userId)
				return null;

			try {
				return await getTransactionTotals(client);
			} catch (err) {
				console.error(`[>>] API :: investment history call failed sub API level error ${err}`);
				return null;
			}
		}
	}
}


module.exports = resolvers;