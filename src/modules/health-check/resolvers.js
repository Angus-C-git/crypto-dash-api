const User = require("../../entities/User");

const resolvers = {
	Query: {
		health: (_, {tag}) =>
			`Server alive @${new Date(Date.now()).toDateString()} -- ${tag || 'server'}`,
	}
}

module.exports = resolvers;