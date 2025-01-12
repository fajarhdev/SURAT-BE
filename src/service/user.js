const User = require("../model/user");
const Unit = require("../model/unit");
const Role = require("../model/role");
const bcrypt = require("bcryptjs");

const checkUserDB = async () => {
	try {
		const user = await User.findAll();

		return user;
	} catch (e) {
		throw Error("Error Database", e);
	}
};

const getUserService = async () => {
	try {
		const user = await User.findAll({
			include: [
				{
					model: Role,
					as: 'id'
				},
				{
					model: Unit,
					as: 'id'
				}
			]
		});

		return user;
	} catch (e) {
		throw Error("Error Database", e);
	}
}

const userFindById = async (id) => {
	try {
		const user = await User.findOne({
			where: {
				username: id,
			},
		});

		return user;
	} catch (e) {
		throw Error("Error Database", e);
	}
};

const userFindByUsernameService = async (username) => {
	try {
		const user = await User.findOne({
			where: {
				username: username,
			},
		});

		return user;
	} catch (e) {
		throw Error("Error Database", e);
	}
}

const createSuperAdmin = async () => {
	try {
		// Fetch the Role ID for superadmin (assumes a role exists)
		const superadminRole = await Role.findOne({
			where: { name: "superadmin" },
		});

		if (!superadminRole) {
			console.error(
				"Superadmin role not found. Please create it first."
			);
			return;
		}

		// Fetch the Unit ID for superadmin (assumes a unit exists)
		const superadminUnit = await Unit.findOne({
			where: { name: "superadmin" },
		});
		if (!superadminUnit) {
			console.error(
				"Superadmin unit not found. Please create it first."
			);
			return;
		}

		// Prepare hashed password
		// const hashedPassword = await bcrypt.hash("superadmin123", 10);

		const superadminUser = await User.findOrCreate({
			where: { username: "superadmin" }, // Cari pengguna berdasarkan username
			defaults: {
			  npp: "000001",
			  name: "Super Admin",
			  unit: superadminUnit.id,
			  numPhone: "1234567890",
			  role: superadminRole.id,
			  username: "superadmin",
			  password: "superadmin123", // Sebaiknya hash password ini
			},
		  });

		console.log(
			"Superadmin user inserted successfully:",
			superadminUser
		);

		return superadminUser;
	} catch (error) {
		console.error("Error inserting superadmin user:", error);
	}
};

const createUserService = async (user) => {
	try {
		
		// const hashedPassword = await bcrypt.hash(user.password, 10);
		
		const userData = await User.create({
			npp: user.npp,
			name: user.name,
			unit: user.unit,
			numPhone: user.numPhone,
			email:user.email,
			role: user.role,
			username: user.username,
			password: user.password
		});

		return userData;
	} catch (e) {
		throw Error("Error Database", e);
	}
} 

const deleteUserService = async (id) => {
	try {
		const user = await User.destroy({
			where: {
				id: id
			}
		});

		return user;
	} catch (e) {
		throw Error("Error Database", e);
	}
}

const modifyUserService = async (user, id) => {
	try {
		const userData = await User.update({
			npp: user.npp,
			name: user.name,
			unit: user.unit,
			numPhone: user.numPhone,
			email:user.email,
			role: user.role,
		}, {
			where: {
				id: id
			}
		});

		return userData;
	} catch (e) {
		throw Error("Error Database", e);
	}
}

module.exports = { checkUserDB, userFindById, createSuperAdmin, createUserService, userFindByUsernameService, deleteUserService, modifyUserService, getUserService };
