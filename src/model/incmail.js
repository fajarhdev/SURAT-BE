const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const IncMail = sequelize.define(
	"INCMAILMASTER",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		sender: {
			type: DataTypes.STRING,
		},
		destMail: {
			type: DataTypes.STRING,
			field: "dest_mail",
		},
		subject: {
			type: DataTypes.STRING,
		},
		dispotition: {
			type: DataTypes.STRING,
		},
		dispotitionNote: {
			type: DataTypes.STRING,
			field: "dispotition_note",
		},
		recName: {
			type: DataTypes.STRING,
			field: "rec_name",
		},
		recUnit: {
			type: DataTypes.STRING,
			field: "rec_unit",
		},
		incDate: {
			type: DataTypes.DATEONLY,
			field: "inc_date",
		},
		incTime: {
			type: DataTypes.TIME,
			field: "inc_time",
		},
		image: {
			type: DataTypes.STRING,
		},
	},
	{
		tableName: "INCMAILMASTER",
	}
);

// await IncMail.sync();

module.exports = IncMail;
