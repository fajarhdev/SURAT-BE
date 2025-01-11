const Role = require("../model/role");

const createSuperAdminRole = async () => {
	// create superadmin role
	const createRole = await Role.create({
		name: "superadmin",
		level: 0,
	});
};

const roleFindById = async (id) => {
	try {
		const role = await Role.findByPk(id);

		return role;
	} catch (e) {
		throw new Error("Error database", e);
		
	}
}

const createRole = async (role) => {
	try {
		const role = await Role.create({
			name: role.name,
			level: role.level
		});
	} catch (e) {
		throw new Error("Error database", e);
	}
}

const deleteRole = async (id) => {
	try {
		const role = await Role.destroy({
			where: {
				id: id
			}
		})

		return role;
	} catch (e) {
		throw new Error("Error database", e);
	}
}
module.exports = {createSuperAdminRole, roleFindById, createRole, deleteRole};
