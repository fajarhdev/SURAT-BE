const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require('cors');
require('./src/job')

const indexRouter = require("./routes/index");
const mailRouter = require("./routes/mail");
const sysRouter = require("./routes/sys");
const unitRouter = require("./routes/unit");
const roleRouter  = require("./routes/role");
const userRouter = require("./routes/user");
const sequelize = require("./config/database");
const models = require("./src/model/index");
const {createSuperAdminRole} = require("./src/service/role");
const { createSuperAdminUnit } = require("./src/service/unit");
const { createSuperAdmin } = require("./src/service/user");

const app = express();

app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

sequelize
	.sync({ alter: true }) // Use `force: true` to drop and recreate tables
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
app.use("/api/mail", mailRouter);
app.use("/api/sys", sysRouter);
app.use("/api/unit", unitRouter);
app.use("/api/role", roleRouter);
app.use("/api/user", userRouter);

module.exports = app;
