const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/database");

const getTopicService = async () => {
	const topic = await sequelize.query(
		"SELECT * FROM MASTER_TOPIC m JOIN MASTER_DETAIL d ON m.id = d.master_uid WHERE d.id = d.parent_id",
		{
			type: QueryTypes.SELECT,
		}
	);

	return topic;
};

module.exports = getTopicService;
