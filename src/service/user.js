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

const userFindById = async (username) => {
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
};

const createSuperAdmin = async (user) => {
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
		const hashedPassword = await bcrypt.hash("superadmin123", 10);

		// Insert superadmin user
		const superadminUser = await User.create({
			npp: "000001",
			name: "Super Admin",
			unit: superadminUnit.id,
			numPhone: "1234567890",
			role: superadminRole.id,
			username: "superadmin",
			password: hashedPassword,
		});

		console.log(
			"Superadmin user inserted successfully:",
			superadminUser
		);
	} catch (error) {
		console.error("Error inserting superadmin user:", error);
	}
};

module.exports = { checkUserDB, userFindById, createSuperAdmin };
