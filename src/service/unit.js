const Unit = require("../model/unit");

const createSuperAdminUnit = async () => {
	try {
		// create superadmin unit
		const createUnit = await Unit.create({
			name: "superadmin",
			address: "telkom",
		});
	} catch (e) {
		throw new Error("Error database");
	}
};

const getAllUnitService = async () => {
	try {
		const getUnit = await Unit.findAll();

		return getUnit;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

module.exports = { createSuperAdminUnit, getAllUnitService };
