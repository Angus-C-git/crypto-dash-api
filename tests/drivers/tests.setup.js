/**
 * :::::::::::::::::::::::::::::::::::: DRIVER FOR TESTS ::::::::::::::::::::::::::::::::::::
 *
 *  -> Configures server instance and connection to TEST database.
 *  -> Provides cleaning utilities for db
 * */


// Import Server Runner
const startTestServer = require('../../src/server').startServer;
const mongoose = require('../../src/server').mongoose;
const dotenv = require('dotenv');
const connectDatabase = require('../../src/utils/connectDatabase');

mongoose.set('useCreateIndex', true);
mongoose.promise = global.Promise;
dotenv.config();

async function removeAllCollections () {
	const collections = Object.keys(mongoose.connection.collections);
	for (const collectionName of collections) {
		const collection = mongoose.connection.collections[collectionName];
		// noinspection JSUnresolvedFunction
		await collection.deleteMany();
	}
}

// Currently unused --> drops database collections
// async function dropAllCollections () {
// 	const collections = Object.keys(mongoose.connection.collections);
// 	for (const collectionName of collections) {
// 		const collection = mongoose.connection.collections[collectionName];
// 		try {
// 			await collection.drop();
// 		} catch (error) {
// 			// Sometimes this error happens, but you can safely ignore it
// 			if (error.message === 'ns not found') return;
// 			// This error occurs when you use it.
// 			if (error.message.includes('a background operation is currently running')) return;
// 			console.log(error.message)
// 		}
// 	}
// }

module.exports = async function runSetup () {

		// Only start the server if not already running
		if (!process.env.TEST_SERVER_RUNNING) {
			// init db connection to clean
			await connectDatabase();

			// init test server
			await startTestServer().then(() => {
				process.env.TEST_SERVER_RUNNING = 'true';
				console.log("[>>] Test server setup completed");
			});
		}

		console.log("\n[>>] Cleaning DB ... ");
		await removeAllCollections();
}
