const { createUserService, modifyUserService, deleteUserService } = require('../service/user');

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
			500,
			"Error create user",
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

    try {
        const user = await modifyUserService(data);

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
			500,
			"Error update user",
			null,
			e,
			req,
			res
		);

		return error;
    }
}

const deleteUserController = async (req, res) => {
    const data = req.params;

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
			500,
			"Error delete user",
			null,
			e,
			req,
			res
		);

		return error;
    }
}

module.exports = {createUserController, updateUserController, deleteUserController};