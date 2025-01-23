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

const getUserService = async (page = 1, pageSize = 10) => {
	try {
		// Hitung offset berdasarkan halaman dan ukuran halaman
		const offset = (page - 1) * pageSize;

		const query = `
    SELECT 
        mu.id,
        mu.name,
        mu."numPhone",
        mu.email,
        mu.username,
        mu."password",
        jsonb_build_object('id', mr.id, 'name', mr."name") AS role,
        jsonb_build_object('id', mu2.id, 'name', mu2."name") AS unit
    FROM "MASTER_USER" mu
    JOIN "MASTER_ROLE" mr ON mu."role" = mr.id
    JOIN "MASTER_UNIT" mu2 ON mu.unit = mu2.id
    ORDER BY mu."createdAt" DESC;  -- Mengurutkan berdasarkan createdAt
`;

		const users = await sequelize.query(query, {
			type: QueryTypes.SELECT,
		});

		return users;
	} catch (e) {
		throw Error(e.message);
	}
};

const userFindById = async (id) => {
	try {
		const user = await User.findOne({
			where: {
				username: id,
			},
		});

		return user;
	} catch (e) {
		throw Error(e.message);
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
		throw Error(e.message);
	}
};

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
				username: "superAdmin",
				password: "Telkom@REG4", // Sebaiknya hash password ini
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

		const checkUser = await User.findOne({
			where: {
				username: user.username
			}
		});

		if (checkUser) {
			throw Error("User is exist");
		}

		const userData = await User.create({
			name: user.name,
			unit: user.unit,
			numPhone: user.numPhone,
			email: user.email,
			role: user.role,
			username: user.username,
			password: user.password,
		});

		return userData;
	} catch (e) {
		throw Error(e.message);
	}
};

const deleteUserService = async (id) => {
	try {
		const user = await User.destroy({
			where: {
				id: id,
			},
		});

		return user;
	} catch (e) {
		throw Error(e.message);
	}
};

const modifyUserService = async (user, id) => {
	try {
		validateUser(user);

		const userData = await User.update(
			{
				name: user.name,
				unit: user.unit,
				numPhone: user.numPhone,
				email: user.email,
				role: user.role,
				username: user.username,
				password: user.password,
			},
			{
				where: {
					id: id,
				},
			}
		);

		return userData;
	} catch (e) {
		throw Error(e.message);
	}
};

const validateUser = (user) => {
	const requiredFields = [
		{ field: "name", value: user.name },
		{ field: "unit", value: user.unit },
		{ field: "numPhone", value: user.numPhone },
		{ field: "email", value: user.email },
		{ field: "role", value: user.role },
		{ field: "username", value: user.username },
		{ field: "password", value: user.password },
	];

	for (const { field, value } of requiredFields) {
		if (!value || value === "") {
			throw new Error(`The field ${field} cannot be empty.`);
		}
	}
};

module.exports = {
	checkUserDB,
	userFindById,
	createSuperAdmin,
	createUserService,
	userFindByUsernameService,
	deleteUserService,
	modifyUserService,
	getUserService,
};
