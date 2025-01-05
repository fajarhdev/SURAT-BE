const RefreshToken = require("../middleware/refreshtoken");

const RefreshTokenController = async (req, res) => {
	const refreshToken = req.cookies["refreshToken"];

	if (!refreshToken) {
		return res.status(401).json({ error: "Refresh token not found." });
	}

	const accessToken = await RefreshToken(refreshToken);

	return res.status(200).json({ accessToken });
};

module.exports = RefreshTokenController;
