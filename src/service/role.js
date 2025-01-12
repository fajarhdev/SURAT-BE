const Role = require("../model/role");

const createSuperAdminRole = async () => {
	// Cari atau buat role superadmin
    const role = await Role.findOrCreate({
		where: { name: "superadmin" },
		defaults: { level: 0 },
	  });

	  return role;
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
		const roleData = await Role.create({
			name: role.name,
			level: role.level
		});

		return roleData;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

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
};

const modifyRole = async (role) => {
	try {
		const roleData = await Role.update({
			name: role.name,
			level: role.level
		});

		return roleData;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

module.exports = {createSuperAdminRole, roleFindById, createRole, deleteRole, modifyRole};
