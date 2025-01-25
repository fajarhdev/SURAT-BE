const MailCode = require("../model/mailcode");
const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");
const sequelize = require("../../config/database");
const {QueryTypes} = require("sequelize");

const getNomorCadanganService = async () => {
	try {
		const nomorCadanganMaster = await System.findOne({
			where: {
				key: "NUMMAILCADANGAN",
			},
		});
		//
		// const nomorCadangan = await SystemDetail.findAll({
		// 	where: {
		// 		masterId: nomorCadanganMaster.id,
		// 		isTake: false
		// 	},
		// 	order: [['createdAt', 'ASC']]
		// });

		const query = 'SELECT * FROM "DETAIL_SYSTEM" WHERE master_id = :masterId AND is_take = false ORDER BY CAST(value AS INTEGER)';

		const nomorCadangan = await sequelize.query(query, {
			replacements: { masterId: nomorCadanganMaster.id },
			type: QueryTypes.SELECT
		});
		return nomorCadangan;
	} catch (e) {
		throw new Error("Error database", e);
	}
};


const getCodeSurat = async () => {
	try {
		const code = await MailCode.findAll();

		return code;
	} catch (e) {
		throw new Error("Error database", e.message);
	}
}

module.exports = {getNomorCadanganService, getCodeSurat};
