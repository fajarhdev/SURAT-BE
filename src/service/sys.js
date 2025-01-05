const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");

const getNomorCadanganService = async () => {
	try {
		const nomorCadangann = await System.findOne({
			where: {
				key: "NUMMAILCADANGAN",
			},
			include: SystemDetail,
		});

		return nomorCadangann;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

module.exports = getNomorCadanganService;
