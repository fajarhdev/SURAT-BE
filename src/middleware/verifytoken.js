const jwt = require("jsonwebtoken");
require("dotenv").config();

// Secret key untuk memverifikasi token
const secretKey = process.env.ACCESS_TOKEN_KEY;

const verifyToken = (req, res, next) => {
	// Ambil token dari header Authorization
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

	if (!token) {
		return res
			.status(401)
			.json({ message: "Access denied. No token provided." });
	}

	try {
		// Verifikasi token
		const decoded = jwt.verify(token, secretKey);
		req.user = decoded; // Simpan data pengguna dari token ke dalam req.user
		next(); // Lanjutkan ke middleware berikutnya
	} catch (err) {
		return res
			.status(403)
			.json({ message: "Invalid or expired token." });
	}
};

module.exports = verifyToken;
