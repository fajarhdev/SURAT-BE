const MailCode = require("../model/mailcode");
const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");

const getNomorCadanganService = async () => {
	try {
		const nomorCadanganMaster = await System.findOne({
			where: {
				key: "NUMMAILCADANGAN",
			},
		});

		const nomorCadangan = await SystemDetail.findAll({
			where: {
				masterId: nomorCadanganMaster.id,
				isTake: false
			},
			order: [['createdAt', 'ASC']]
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
