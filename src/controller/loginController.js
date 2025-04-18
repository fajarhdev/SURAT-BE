const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const response = require("./util/response");
const {
	checkUserDB,
	userFindById,
	createSuperAdmin,
	userFindByUsernameService,
} = require("../service/user");
const { roleFindById } = require("../service/role");
require("dotenv").config();

// Secret keys
const JWT_SECRET = process.env.ACCESS_TOKEN_KEY;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_KEY;

// Refresh token storage (In production, use a database)
let refreshTokens = [];

// Helper untuk membuat JWT
const generateAccessToken = async (user, role) => {
	return jwt.sign(
		{
			id: user.id,
			username: user.username,
			role: role.name,
			name: user.name,
		},
		JWT_SECRET,
		{
			expiresIn: "15m",
		}
	);
};

const generateRefreshToken = async (user, role) => {
	return jwt.sign(
		{
			id: user.id,
			username: user.username,
			role: role.name,
			name: user.name,
		},
		REFRESH_SECRET,
		{
			expiresIn: "7d",
		}
	);
};

// Controller Login
const loginController = async (req, res) => {
	const { username, password } = req.body;

	try {
		// validasi database
		const db = await checkUserDB();

		// Validasi pengguna
		const user = await userFindByUsernameService(username);
		let role = null;
		if (user !== null) {
			role = await roleFindById(user.role);
		}

		if (db !== null) {
			if (user === null) {
				// if (!user || !bcrypt.compareSync(password, user.password)) {

				// }
				return res.status(401).json({
					message: "Invalid username or password",
				});
			}
		} else {
			await createSuperAdmin();
		}

		// Buat JWT dan Refresh Token
		const accessToken = await generateAccessToken(user, role);
		const refreshToken = await generateRefreshToken(user, role);

		// Simpan refresh token ke server-side storage
		refreshTokens.push(refreshToken);

		// Kirim token ke response
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: false, // Aktifkan secure di production
			sameSite: "lax",
		}).json({ accessToken });
	} catch (e) {
		const error = await response(
			400,
			"Error when login",
			null,
			null,
			e,
			req,
			res
		);

		return error;
	}
};

module.exports = { loginController };
