const bcrypt = require('bcryptjs');
const yup = require('yup');
const jwt = require('jsonwebtoken');

const User = require("../../entities/User");
const createTokens = require('../../utils/createTokens.js');


const schemaValidationError = require('../../utils/schemaValidationError');
const loginInvalid = require('./error-constants').loginInvalid;
const emailRequired = require('./error-constants').emailRequired;
const passwordRequired = require('./error-constants').passwordRequired;

const invalidLoginError = [
	{
		relation: "login",
		message: loginInvalid
	}
]

const loginSchema = yup.object().shape({
	email: yup.string()
		.min(6, loginInvalid)
		.max(255, loginInvalid)
		.email(loginInvalid)
		.required(emailRequired),
	password: yup.string()
		.min(8, loginInvalid)
		.max(255, loginInvalid)
		.required(passwordRequired),
});


const resolvers = {
	Query: {
		hello2: () => ``,
	},

	Mutation: {
		login: async (_, args, { res }) => {

			// Validate the schema
			try {
				// Show all errors
				await loginSchema.validate(args, { abortEarly: false });
			} catch (err) {
				return schemaValidationError(err);
			}

			const { email, password } = args;

			const user = await User.findOne({ email: email });
			if (!user)
				return invalidLoginError; // don't leak emails

			// > Stub check user is confirmed
			// if (!user.verified) {
			// 	return [
			// 		{
			// 			relation: "email",
			// 			message: confirmEmail
			// 		}
			// 	]
			// }

			// bad password
			const valid = await bcrypt.compare(password, user.password);
			if (!valid)
				return invalidLoginError;


			const { accessToken, refreshToken } = createTokens(user);

			res.cookie("refresh-token", refreshToken, {
				path: "/",
				httpOnly: true,
				secure: true,
				maxAge: 1000 * 60 * 60 * 24 * 7
			});

			res.cookie("access-token", accessToken, {
				path: "/",
				httpOnly: true,
				secure: true,
				maxAge: 1000 * 60 * 60 * 24 * 2
			});

			return [
				{
					relation: "login",
					message: "success"
				}
			];
		}
	}
}


module.exports = resolvers;