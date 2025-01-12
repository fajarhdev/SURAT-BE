const User = require("../model/user");
const Unit = require("../model/unit");
const Role = require("../model/role");
const bcrypt = require("bcryptjs");
const sequelize = require("../../config/database");
const { QueryTypes } = require("sequelize");

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
		const query = `
 			SELECT 
    			mu.id,
    			mu.npp,
    			mu.name,
    			mu2."name" AS unit,
    			mu."numPhone",
    			mu.email,
    			mr."name" as role,
    			mu.username,
    			mu."password"
  			FROM "MASTER_USER" mu
  			JOIN "MASTER_ROLE" mr ON mu."role" = mr.id
  			JOIN "MASTER_UNIT" mu2 ON mu.unit = mu2.id;
		`;

		const user = sequelize.query(query, {type: QueryTypes.SELECT})

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
		
		validateUser(user);

		const userData = await User.create({
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
		throw Error("Error Database ", e.message);
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

		validateUser(user);

		const userData = await User.update({
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

const validateUser = (user) => {
	const requiredFields = [
	  { field: 'name', value: user.name },
	  { field: 'unit', value: user.unit },
	  { field: 'numPhone', value: user.numPhone },
	  { field: 'email', value: user.email },
	  { field: 'role', value: user.role },
	  { field: 'username', value: user.username },
	  { field: 'password', value: user.password },
	];
  
	for (const { field, value } of requiredFields) {
	  if (!value || value === '') {
		throw new Error(`The field "${field}" cannot be empty.`);
	  }
	}
  }

module.exports = { checkUserDB, userFindById, createSuperAdmin, createUserService, userFindByUsernameService, deleteUserService, modifyUserService, getUserService };
