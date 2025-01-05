const {
	getOutgoingMailService,
	createIncomingMailService,
	createOutMailService,
} = require("../service/mail");

const response = require("../controller/util/response");

const getOutgoingMailController = async (req, res) => {
	const user = req.user;

	try {
		const getOutgoingMailData = await getOutgoingMailService();

		const result = await response(
			200,
			"Succes fetch outgoing mail data",
			getOutgoingMailData,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			500,
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
	const data = req.data;

	try {
		const createOutgoingMailData = await createOutMailService(
			data,
			user
		);
	} catch (e) {
		const error = await response(
			500,
			"Error create outgoing mail",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

module.exports = { getOutgoingMailController, createOutgoingMailController };
