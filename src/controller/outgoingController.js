const {
	getOutgoingMailService,
	createOutMailService,
	updateOutMailService,
	deleteOutMailService,
} = require("../service/mail");

const response = require("../controller/util/response");

const getOutgoingMailController = async (req, res) => {
	const user = req.user;
	const years = req.params.year;
	try {
		const [getOutgoingMailData, year] = await getOutgoingMailService(years);

		const result = await response(
			200,
			"Succes fetch outgoing mail data",
			getOutgoingMailData,
			year,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			400,
			"Error fetch outgoing mail",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

const createOutgoingMailController = async (req, res) => {
	const user = req.user;
	const data = req.body;

	try {
		const createOutgoingMailData = await createOutMailService(
			data,
			user
		);

		const result = await response(
			200,
			"Succes create outgoing mail data",
			createOutgoingMailData,
			null,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(400, e.message, null, e, req, res);

		return error;
	}
};

const updateOutgoingMailController = async (req, res) => {
	const user = req.user;
	const data = req.body;
	const id = req.params.id;

	try {
		const update = await updateOutMailService(data, user, id);

		const result = await response(
			200,
			"Succes update outgoing mail data",
			update,
			null,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(400, e.message, null, e, req, res);

		return error;
	}
};

const deleteOutgoingMailController = async (req, res) => {
	const data = req.params.id;

	try {
		const update = await deleteOutMailService(data);

		const result = await response(
			200,
			"Succes delete outgoing mail data",
			update,
			null,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(400, e.message, null, e, req, res);

		return error;
	}
};

module.exports = {
	getOutgoingMailController,
	createOutgoingMailController,
	updateOutgoingMailController,
	deleteOutgoingMailController,
};
