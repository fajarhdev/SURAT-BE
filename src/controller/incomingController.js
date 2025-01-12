const { getIncomingMailService, createIncomingMailService, updateIncomingMailService, deleteIncomingMailService } = require("../service/mail");
const response = require("./util/response");

const getIncomingMailController = async (req, res) => {
	const user = req.user;
	try {
		const getIncomingMailData = await getIncomingMailService();

		const result = await response(
			200,
			"Succes fetch incoming mail data",
			getIncomingMailData,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			500,
			"Error fetch incoming mail",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

const createIncomingMailController = async (req, res) => {
	const user = req.user;
	const data = req.body;
	const file = req.file;

	try {
		const createIncomingMailData = await createIncomingMailService(
			data,
			file
		);

		const result = await response(
			200,
			"Success create incoming mail",
			createIncomingMailData,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			500,
			"Error creating incoming mail",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

const updateIncomingMailController = async (req, res) => {
	const user = req.user;
	const data = req.body;
	const file = req.file;
	const id = req.params.id;

	try {
		const updateIncomingMailData = await updateIncomingMailService(
			data,
			id,
			file
		);

		const result = await response(
			200,
			"Success update incoming mail",
			updateIncomingMailData,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			500,
			"Error update incoming mail",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

const deleteIncomingMailController = async (req, res) => {
	const id = req.params.id;

	try {
		const updateIncomingMailData = await deleteIncomingMailService(id);

		const result = await response(
			200,
			"Success delete incoming mail",
			updateIncomingMailData,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			500,
			"Error delete incoming mail",
			null,
			e,
			req,
			res
		);

		return error;
	}
};
module.exports = { getIncomingMailController, createIncomingMailController, updateIncomingMailController, deleteIncomingMailController };
