const Role = require("../model/role");

const createSuperAdminRole = async () => {
	// create superadmin role
	const createRole = await Role.create({
		name: "superadmin",
		level: 0,
	});
};

module.exports = createSuperAdminRole;
