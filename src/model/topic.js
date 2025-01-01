const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Topic = sequelize.define(
	"MASTER_TOPIC",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUID,
			primaryKey: true,
		},
		code: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		},
		desc: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "MASTER_TOPIC",
	}
);

// await Topic.sync();

module.exports = Topic;
