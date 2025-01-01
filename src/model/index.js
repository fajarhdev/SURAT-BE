const fs = require("fs");
const path = require("path");
const sequelize = require("../../config/database");

const models = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
	.filter((file) => file !== basename && file.endsWith(".js"))
	.forEach((file) => {
		const model = require(path.join(__dirname, file));
		models[model.name] = model;
	});

models.sequelize = sequelize;

module.exports = models;
