const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const System = require("./system");

const SystemDetail = sequelize.define(
	"DETAIL_SYSTEM",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		masterId: {
			type: DataTypes.UUID,
			references: {
				model: System,
				key: "id",
			},
		},
		code: {
			type: DataTypes.STRING,
		},
		value: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "DETAIL_SYSTEM",
	}
);

// await SystemDetail.sync();

module.exports = SystemDetail;
