const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Role = sequelize.define(
	"MASTER_ROLE",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		level: {
			type: DataTypes.INTEGER,
		},
	},
	{
		tableName: "MASTER_ROLE",
	}
);

// await Role.sync();

module.exports = Role;
