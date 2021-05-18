const { mergeSchemas, makeExecutableSchema }  = require('graphql-tools');
const { importSchema } = require('graphql-import');
const path = require('path');
const fs = require('fs');

// Relative base path of modules dir
const BASE_PATH = '../modules';

/**
 * 	Combines all module schemas into one
 * */
module.exports = genSchema = () => {


	const schemas = [];
	const folders = fs.readdirSync(path.join(__dirname, "../modules"));
	folders.forEach(folder => {
		const resolvers = require(`${BASE_PATH}/${folder}/resolvers`);
		const typeDefs = importSchema(path.join(__dirname, `${BASE_PATH}/${folder}/schema.graphql`));

		schemas.push(makeExecutableSchema({
			resolvers,
			typeDefs
		}));
	});

	return mergeSchemas({ schemas });
}