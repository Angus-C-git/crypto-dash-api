const { GraphQLServer } = require('graphql-yoga');			// GraphQLServer variant

const mongoose = require('mongoose');						// ORM
const dotenv = require('dotenv');       					// Environment variables

const genSchema = require('./utils/genSchema');				// Generate Combined Schema
const cookieParser = require('cookie-parser');				// Cookie Parser middleware
const middleware = require('./middleware/middleware');		// Auth/Global middleware

dotenv.config();


/*
* ::::::::::::::::::::::::::::::: SERVER INIT :::::::::::::::::::::::::::::::
* */

const server = new GraphQLServer({
	schema: genSchema(),
	context: ({ request, response }) => ({
		req: request, res: response
	}),
	// middlewares: [middleware]
});

const startServer = async () => {

	// prod mode switch
	let port = process.env.PORT;
	const options = {
		port: (!port || port === "") ? 2048 : port
	};

	// Apply cookie parser middleware
	server.express.use(cookieParser());
	server.express.use(middleware);

	await server.start(options, ({ port }) => {
		console.log(`[>>] Server is live on localhost port :: ${port}`);
	});

}


module.exports = {
	startServer,
	mongoose
};