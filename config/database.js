const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	dialect: "postgres",
	dialectOptions: {
		ssl: {
			require: true, // Ensure SSL is enabled
			rejectUnauthorized: false, // Optionally, set this to true if you have the server certificate
		},
	},
	logging: false, // You can enable this for debugging
});

module.exports = sequelize;
