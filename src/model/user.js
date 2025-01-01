const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Role = require("./role");
const Unit = require("./unit");

const User = sequelize.define(
	"MASTER_USER",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		npp: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		},
		unit: {
			type: DataTypes.UUID,
			references: {
				model: Unit,
				key: "id",
			},
		},
		numPhone: {
			type: DataTypes.STRING,
		},
		role: {
			type: DataTypes.UUID,
			references: {
				model: Role,
				key: "id",
			},
		},
		username: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "MASTER_USER",
	}
);

// await User.sync();

module.exports = User;
