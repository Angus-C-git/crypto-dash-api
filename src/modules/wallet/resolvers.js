const getCurrentWallet = require('../../functions/getWallet');
const getCurrentWalletValue = require('../../functions/getCurrentWalletValue');

const resolvers = {
	Query: {
		wallet: async (_, __, {req, client}) => {

			if (!req.userId)
				return null;

			try {
				let wallet = await getCurrentWallet(client);
				let currentWalletValue = await getCurrentWalletValue(client);

				return {
					total: currentWalletValue,
					holdings: wallet
				};
			} catch (err) {
				console.error(`[>>] API :: wallet call failed sub API level error ${err}`);
				return null;
			}
		}
	}
}


module.exports = resolvers;