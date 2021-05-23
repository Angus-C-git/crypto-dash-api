const { GraphQLServer } = require('graphql-yoga');			// GraphQLServer variant

const mongoose = require('mongoose');						// ORM
const dotenv = require('dotenv');       					// Environment variables


const genSchema = require('./utils/genSchema');				// Generate Combined Schema
const cookieParser = require('cookie-parser');				// Cookie Parser middleware
const middleware = require('./middleware/middleware');		// Auth/Global middleware
const Coinspot = require('./routes/coinspot');

dotenv.config();

/*
* :::::::::::::::::::::::: COINSPOT API WRAPPER INIT ::::::::::::::::::::::::
* */

const secret = process.env.CS_RO_SECRET; // insert your secret here
const key = process.env.CS_RO_KEY; // insert your key here
const client = new Coinspot(key, secret);

/*
* ::::::::::::::::::::::::::::::: SERVER INIT :::::::::::::::::::::::::::::::
* */

const server = new GraphQLServer({
	schema: genSchema(),
	context: ({ request, response }) => ({
		req: request, res: response, client
	}),
	// middlewares: [middleware]
});

const startServer = async () => {

	// prod mode switch
	const options = {
		port: process.env.PORT || 2048,
		playground: (process.env.NODE_ENV !== "production"),
		cors: {
			credentials: true,
			origin: '/localhost\/'
		}
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