const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Executive = require("../model/executive");
const ExecutiveDetail = require("../model/executivedetail");

const getExecutiveService = async () => {
	const executive = await sequelize.query(
		`SELECT * 
        FROM MASTER_EXECUTIVE m 
        JOIN MASTER_DETAIL d 
        ON m.id = d.master_id 
        WHERE d.id = d.parent_id`,
		{
			type: QueryTypes.SELECT,
		}
	);

	return executive;
};

module.exports = getExecutiveService;
