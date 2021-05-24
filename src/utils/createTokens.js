const jwt = require('jsonwebtoken');


module.exports = createTokens = (user) => {
	const refreshToken = jwt.sign(
		{ userId: user._id, count: user.count },
		process.env.JWT_SECRET,
		{
			expiresIn: "14d",
			sameSite: "Strict"
		}
	);

	const accessToken = jwt.sign(
		{ userId: user._id },
		process.env.JWT_SECRET,
		{
			expiresIn: "2d",
			sameSite: "Strict"
		}
	);

	return { refreshToken, accessToken };
};