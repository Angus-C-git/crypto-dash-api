const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

/*
* :::::::::::::::::::::::::::::::: DB CONFIG ::::::::::::::::::::::::::::::::
* */

const dbConnect = (process.env.NODE_ENV === "test") ?
	process.env.TEST_DATABASE_CONNECT : process.env.PROD_DATABASE_CONNECT;  // process.env.DEV_DATABASE_CONNECT; \\


module.exports = async function connectDatabase () {
	await mongoose.connect(dbConnect, {useNewUrlParser: true, useUnifiedTopology: true})
		.then(r => {
			console.log('\n[>>] Database Connected :::', r.connections[0].name);
		}
	);
}