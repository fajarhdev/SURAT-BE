const { createUserService, modifyUserService, deleteUserService, getUserService} = require('../service/user');
const response = require("./util/response");

const createUserController = async (req, res) => {
    const data = req.body;
	try {
		const user = await createUserService(data);

		const result = await response(
			200,
			"Succes create user",
			user,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			400,
			e.message,
			null,
			e,
			req,
			res
		);

		return error;
	}
};

const updateUserController = async (req, res) => {
    const data = req.body;
	const id = req.params.id;

    try {
        const user = await modifyUserService(data, id);

        const result = await response(
			200,
			"Succes update user",
			user,
			null,
			req,
			res
		);

        return result;
    } catch (e) {
        const error = await response(
			400,
			e.message,
			null,
			e,
			req,
			res
		);

		return error;
    }
}

const deleteUserController = async (req, res) => {
    const data = req.params.id;

    try {
        const user = await deleteUserService(data);

        const result = await response(
			200,
			"Succes delete user",
			user,
			null,
			req,
			res
		);

        return result;
    } catch (e) {
        const error = await response(
			400,
			"Error delete user",
			null,
			e,
			req,
			res
		);

		return error;
    }
}

const getUserController = async (req, res) => {
	const page = parseInt(req.query.page, 10) || 1; // Halaman default 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10; // Jumlah data default 10 per halaman

	try {
		const user = await getUserService(page, pageSize);

		const result = await response(
			200,
			"Succes fetch user",
			user,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			400,
			"Error fetch user",
			null,
			e,
			req,
			res
		);

		return error;
	}
}

module.exports = {createUserController, updateUserController, deleteUserController, getUserController};