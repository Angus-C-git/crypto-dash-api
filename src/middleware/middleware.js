const jwt = require('jsonwebtoken');
const User = require('../entities/User');
const createTokens = require('../utils/createTokens.js');

module.exports = async (req, res, next) => {
	const accessToken = req.cookies["access-token"];
	const refreshToken = req.cookies["refresh-token"];

	if (!accessToken && !refreshToken)
		return next();

	if (!refreshToken)
		return next();

	try {
		const data = jwt.verify(accessToken, process.env.JWT_SECRET);
		req.userId = data.userId;
		return next();
	} catch {}

	let data;

	try {
		data = jwt.verify(refreshToken, process.env.JWT_SECRET);
	} catch { return next(); }

	const user = await User.findById(data.userId);

	// Token invalidated
	if (!user || user.count !== data.count)
		return next();



	const tokens = createTokens(user);

	res.cookie("refresh-token", tokens.refreshToken);
	res.cookie("access-token", tokens.accessToken);
	req.userId = user._id;

	next();
}
