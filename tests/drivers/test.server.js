const { GraphQLServer } = require('graphql-yoga');				// GraphQLServer variant

const dotenv = require('dotenv');       						// Environment variables

const genSchema = require('../../src/utils/genSchema');			// Generate Combined Schema
const cookieParser = require('cookie-parser');					// Cookie Parser middleware
const middleware = require('../../src/middleware/middleware');	// Auth/Global middleware

dotenv.config();

/*
* ::::::::::::::::::::::::::::::: TEST SERVER INIT :::::::::::::::::::::::::::::::
* */

const startTestServer = async () => {
	// Test server port conf
	const options = {
		port: 8080
	}

	const server = new GraphQLServer({
		schema: genSchema(),
		context: ({ request, response }) => ({
			req: request, res: response
		})
	});

	// Apply cookie parser middleware
	server.express.use(cookieParser());
	server.express.use(middleware);

	await server.start(options, ({port}) => {
		console.log(`[>>] Test Server is live on localhost port :: ${port}`);
	});
}


module.exports = startTestServer;
