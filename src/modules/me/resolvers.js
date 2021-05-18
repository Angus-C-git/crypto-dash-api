const User = require('../../entities/User');

const resolvers = {
	Query: {
		me: (_, __, { req }) => {
			if (!req.userId)
				return null;

			return User.findById(req.userId);
		}
	}
}


module.exports = resolvers;