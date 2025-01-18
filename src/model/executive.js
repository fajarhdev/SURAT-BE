const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Executive = sequelize.define(
	"MASTER_EXECUTIVE",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		nik: {
			type: DataTypes.STRING,
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
		tableName: "MASTER_EXECUTIVE", // Pastikan tabel sesuai dengan referensi
	}
);

module.exports = Executive;
