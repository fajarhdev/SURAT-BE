const Role = require("../model/role");

const createSuperAdminRole = async () => {
	// create superadmin role
	const createRole = await Role.create({
		name: "superadmin",
		level: 0,
	});
};

const roleFindById = async (id) => {
	const role = await Role.findByPk(id);

	return role;
}

module.exports = {createSuperAdminRole, roleFindById};
