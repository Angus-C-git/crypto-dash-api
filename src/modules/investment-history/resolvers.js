const authError = require('../../constants/error-constants');
const getTransactionTotals = require('./getTransactionsOvertime');

const resolvers = {
	Query: {
		investment_history: async (_, __, {req, res, client}) => {

			if (!req.userId)
				return authError;

			return await getTransactionTotals(client);
		}
	}
}


module.exports = resolvers;