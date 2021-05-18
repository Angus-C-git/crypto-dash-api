const User = require("../../entities/User");

const resolvers = {
	Query: {
		hello2: () => ``,
	},

	Mutation: {
		logout: async (_, __, {req, res}) => {
			if (!req.userId)
				return false;

			const user = await User.findById(req.userId);
			if (!user)
				return false;

			user.count += 1;
			await user.save();
			res.clearCookie('access-token');

			return true;
		}
	}
}

module.exports = resolvers;