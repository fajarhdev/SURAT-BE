const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Unit = require("./unit");
const User = require("./user");

const OutMail = sequelize.define(
	"OTGMAILMASTER",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		numMail: {
			type: DataTypes.STRING,
			field: "num_mail",
		},
		numCodeMail: {
			type: DataTypes.STRING,
			field: "num_code_mail",
		},
		codeMail: {
			type: DataTypes.STRING,
			field: "code_mail",
		},
		subject: {
			type: DataTypes.STRING,
		},
		problem: {
			type: DataTypes.STRING,
		},
		destUnit: {
			type: DataTypes.UUID,
			field: "dest_unit",
			references: {
				model: Unit,
				key: "id",
			},
		},
		chiefSign: {
			type: DataTypes.UUID,
			field: "chief_sign",
		},
		chiefDesc: {
			type: DataTypes.STRING,
			field: "chief_desc",
		},
		mailMaker: {
			type: DataTypes.UUID,
			field: "mail_maker",
			references: {
				model: User,
				key: "id",
			},
		},
		outDate: {
			type: DataTypes.DATEONLY,
			field: "out_date",
		},
		outTime: {
			type: DataTypes.TIME,
			field: "out_time",
		},
		isFriday: {
			type: DataTypes.BOOLEAN,
			field: "is_saturday",
		},
	},
	{
		tableName: "OTGMAILMASTER",
	}
);

// OutMail.sync();

module.exports = OutMail;
