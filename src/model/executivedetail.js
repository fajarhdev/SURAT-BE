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
			references: {
				model: "DETAIL_EXECUTIVE", // Sesuaikan dengan nama tabel eksplisit
				key: "id",
			},
			field: "parent_id",
		},
		masterId: {
			type: DataTypes.UUID,
			references: {
				model: "MASTER_EXECUTIVE", // Sesuaikan dengan nama tabel eksplisit
				key: "id",
			},
			field: "master_id",
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
		tableName: "DETAIL_EXECUTIVE", // Pastikan tabel sesuai dengan referensi
	}
);

module.exports = ExecutiveDetail;
