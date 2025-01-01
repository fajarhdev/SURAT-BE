const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const System = sequelize.define(
	"MASTER_SYSTEM",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		key: {
			type: DataTypes.STRING,
		},
		desc: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "MASTER_SYSTEM",
	}
);

// await System.sync();

module.exports = System;
