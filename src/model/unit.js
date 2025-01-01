const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Unit = sequelize.define(
	"MASTER_UNIT",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		address: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "MASTER_UNIT",
	}
);

// await Unit.sync();

module.exports = Unit;
