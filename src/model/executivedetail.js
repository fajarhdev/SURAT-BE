const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Executive = require("./executive");

const ExecutiveDetail = sequelize.define(
	"DETAIL_EXECUTIVE",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		parentId: {
			type: DataTypes.UUID,
			field: "parent_id",
			references: {
				model: "DETAIL_EXECUTIVE", // Sesuaikan dengan nama tabel eksplisit
				key: "id",
			},
		},
		masterId: {
			type: DataTypes.UUID,
			field: "master_id",
			references: {
				model: Executive, // Sesuaikan dengan nama tabel eksplisit
				key: "id",
			},
		},
		code: {
			type: DataTypes.STRING,
		},
		desc: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "DETAIL_EXECUTIVE", // Pastikan tabel sesuai dengan referensi
	}
);

module.exports = ExecutiveDetail;
