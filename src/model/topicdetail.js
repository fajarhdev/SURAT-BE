const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Topic = require("./topic");

const TopicDetail = sequelize.define(
	"DETAIL_TOPIC",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		parentId: {
			type: DataTypes.UUID,
			references: {
				model: "DETAIL_TOPIC",
				key: "id",
			},
			field: "parent_id",
		},
		masterId: {
			type: DataTypes.UUID,
			references: {
				model: Topic,
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
			type: DataTypes.TEXT,
		},
	},
	{
		tableName: "DETAIL_TOPIC",
	}
);

// TopicDetail.sync();

module.exports = TopicDetail;
