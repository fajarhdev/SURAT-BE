const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const MailCode = sequelize.define(
	"MASTER_MAIL_CODe",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		code: {
			type: DataTypes.STRING,
		},
		desc: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "MASTER_MAIL_CODE",
	}
);

// await MailCode.sync();

module.exports = MailCode;
