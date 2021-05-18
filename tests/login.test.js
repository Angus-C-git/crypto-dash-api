// ::::::::::::::::::: INIT DIVERS ::::::::::::::::::: \\
const {describe, expect, test, beforeAll} = require('@jest/globals');
const connectDatabase = require('../src/utils/connectDatabase');

const request = require("graphql-request").request;
const host = require('./drivers/test.configs').host;

// ::::::::::::::::::: REGISTER TEST VARS ::::::::::::::::::: \\
const User = require('../src/entities/User');
const invalidLogin = require('../src/modules/login/error-constants').loginInvalid;

const email = "testuser2@test.com";
const username = "TestUser2";
const password = "tester123457";


// @Query --> test query
const registerMutation = (email, username, password) => `
	mutation { 
		register(email:"${email}", username:"${username}", password:"${password}") {
			relation
			message
		}
	}
`;


const loginMutation = (email, password) => `
	mutation { 
		login(email:"${email}", password:"${password}") {
			relation
			message
		}
	}
`;

beforeAll(async () => {
	// Moved to => package.json
	// await runSetup();
	await connectDatabase();
});


// @TEST --> should be sync
describe("Login Test", async () => {

	// #RULE Can login
	test("Valid user can login", async () => {

		// Create valid user
		const register = await request(host, registerMutation(email, username, password));

		const loginResponse = await request(host, loginMutation(email, password));
		expect(loginResponse.login[0].message).toEqual("success");
	});

	// #RULE Unregistered user cant login
	test("Un-registered email cant login", async () => {

		const loginResponse = await request(host, loginMutation("notexistemail@gmail.com", password));
		expect(loginResponse).toEqual({
			login: [
				{
					relation: "login",
					message: invalidLogin
				}
			]
		});
	});

	// #RULE Incorrect password can't login
	test("Un-registered email cant login", async () => {

		const loginResponse = await request(host, loginMutation(email, "123457890"));
		expect(loginResponse).toEqual({
			login: [
				{
					relation: "login",
					message: invalidLogin
				}
			]
		});
	});

});