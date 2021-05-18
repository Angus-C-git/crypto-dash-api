// ::::::::::::::::::: INIT DIVERS ::::::::::::::::::: \\
const {describe, expect, test, beforeAll} = require('@jest/globals');
const connectDatabase = require('../src/utils/connectDatabase');

const request = require("graphql-request").request;
const host = require('./drivers/test.configs').host;

// ::::::::::::::::::: REGISTER TEST VARS ::::::::::::::::::: \\
const User = require('../src/entities/User');
const errorMessages = require('../src/modules/register/error-constants');

const email = "testuser1@test.com";
const username = "TestUser1";
const password = "tester12345";


// @Query --> test query
const registerMutation = (email, username, password) => `
	mutation { 
		register(email:"${email}", username:"${username}", password:"${password}") {
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
describe("Register Users", async () => {

	// #RULE Can register
	test("Valid user can register", async () => {

		const registerResponse = await request(host, registerMutation(email, username, password));
		expect(registerResponse.register[0].message).toEqual("success");
	});

	// #RULE User obeys rules => requires in file connection to mongoose instance
	test("User follows schema rules", async () => {
		const users = await User.find({ email: email});
		const user = users[0];

		// #RULE Only one user with this email
		expect(users).toHaveLength(1);
		// #RULE Email matches signup
		expect(user.email).toEqual(email);
		// #RULE No plaintext passwords
		expect(user.password).not.toEqual(password);
	});

	// #RULE No duplicate emails
	test("Duplicate emails", async () => {
		const duplicateRegister = await request(host, registerMutation(email, username, password));
		expect(duplicateRegister.register).toHaveLength(1);

		// #RULE no duplicate emails
		expect(duplicateRegister.register[0]).toEqual({
			relation: "email",
			message: errorMessages.emailInUse
		});
	});

	// #RULE No invalid emails
	test("Invalid emails", async () => {
		const badEmail = await request(host, registerMutation("badE", username, password));

		// #RULE no bad emails
		expect(badEmail).toEqual({
			register: [
				{
					relation: "email",
					message: errorMessages.emailMinLength
				},
				{
					relation: "email",
					message: errorMessages.emailInvalid
				}
			]
		});
	});


	// #RULE No insecure length passwords
	test("Appropriate password length", async () => {
		const badPassword = await request(host, registerMutation(email, username, "badpass"));

		// #RULE no passwords < 8 characters
		expect(badPassword).toEqual({
			register: [
				{
					relation: "password",
					message: errorMessages.passwordMinLength
				}
			]
		});
	});


});