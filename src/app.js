const startServer = require('./server').startServer;
const connectDatabase = require('./utils/connectDatabase');

// ::::::::::::::::::::::::: SERVER RUNNER ::::::::::::::::::::::::: \\

connectDatabase().then(() => {
	startServer().then(() => {
		console.log("[>>] Startup Complete");
	});
});

