const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const response = require("./util/response");
const {
	checkUserDB,
	userFindById,
	createSuperAdmin,
	userFindByUsernameService,
} = require("../service/user");
const {roleFindById} = require("../service/role");
require("dotenv").config();

// Secret keys
const JWT_SECRET = process.env.ACCESS_TOKEN_KEY;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_KEY;

// Refresh token storage (In production, use a database)
let refreshTokens = [];

// Helper untuk membuat JWT
const generateAccessToken = async (user, role) => {
	return jwt.sign({ id: user.id, username: user.username, role: role.name }, JWT_SECRET, {
		expiresIn: "15m",
	});
};

const generateRefreshToken = async (user) => {
	return jwt.sign(
		{ id: user.id, username: user.username },
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
		if(user !== null) {
			role = await roleFindById(user.role);
		}

		if (db !== null) {
			if (user !== null) {
				if (!user || !bcrypt.compareSync(password, user.password)) {
					return res.status(401).json({
						message: "Invalid username or password",
					});
				}
			}else {
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
			secure: process.env.NODE_ENV === "production", // Aktifkan secure di production
			sameSite: "strict",
		}).json({ accessToken });
	} catch (e) {
		const error = await response(
			500,
			"Error when login",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

module.exports = { loginController };
