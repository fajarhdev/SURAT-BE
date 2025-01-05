const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKeyRefreh = process.env.REFRESH_TOKEN_KEY;
const secretKeyAccess = process.env.ACCESS_TOKEN_KEY;

const RefreshToken = async (refreshToken) => {
	try {
		const decode = jwt.verify(refreshToken, secretKeyRefreh);

		const newAccessToken = jwt.sign(
			{ id: decode.id, username: decode.username },
			secretKeyAccess,
			{
				expiresIn: "30s",
			}
		);

		return newAccessToken;
	} catch (e) {
		throw new Error("Refresh token is invalid", e);
	}
};

module.exports = RefreshToken;
