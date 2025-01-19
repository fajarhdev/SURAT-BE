const { QueryTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Executive = require("../model/executive");
const ExecutiveDetail = require("../model/executivedetail");

const getExecutiveService = async () => {
	const executive = await sequelize.query(
		`SELECT 
    			me.id, 
    			me.code, 
    			JSON_AGG(de.*) AS details
				FROM 
					"MASTER_EXECUTIVE" me
				LEFT JOIN 
					"DETAIL_EXECUTIVE" de 
				ON 
					me.id = de.master_id
				GROUP BY 
					me.id, me.code;`,
						{
							type: QueryTypes.SELECT,
						}
	);

	return executive;
};

module.exports = getExecutiveService;
