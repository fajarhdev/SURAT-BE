const Unit = require("../model/unit");

const createSuperAdminUnit = async () => {
	// create superadmin unit
	const createUnit = await Unit.create({
		name: "superadmin",
		address: "telkom",
	});
};

module.exports = createSuperAdminUnit;
