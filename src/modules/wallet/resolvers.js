const User = require('../../entities/User');
// const authError = require('../../constants/error-constants');
const getCurrentWallet = require('./getWallet');


const resolvers = {
	Query: {
		wallet: async (_, __, {req, res, client}) => {

			if (!req.userId)
				return [null];

			return await getCurrentWallet(client);
		}
	}
}


module.exports = resolvers;