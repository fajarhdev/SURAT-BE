const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const sequelize = require("./config/database");
const models = require("./src/model/index");
const createSuperAdminRole = require("./src/service/role");
const createSuperAdminUnit = require("./src/service/unit");
const { createSuperAdmin } = require("./src/service/user");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

sequelize
	.sync({ force: true }) // Use `force: true` to drop and recreate tables
	.then(() => {
		console.log("All models were synchronized successfully.");
		createSuperAdminRole().then(() => {
			createSuperAdminUnit().then(() => {
				createSuperAdmin();
			});
		});

		console.log("Succesfully create superadmin");
	})
	.catch((err) => {
		console.error("An error occurred while syncing the models:", err);
	});

app.use("/api/auth", indexRouter);
app.use("/api/user", usersRouter);

module.exports = app;
