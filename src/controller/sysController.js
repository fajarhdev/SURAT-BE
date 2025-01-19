const getExecutiveService = require("../service/executive");
const { getNomorCadanganService, getCodeSurat } = require("../service/sys");
const getTopicService = require("../service/topic");
const { getAllUnitService } = require("../service/unit");
const response = require("./util/response");

const getTopicController = async (req, res) => {
	try {
		const getTopic = await getTopicService();

		const result = await response(
			200,
			"Succes fetch topic data",
			getTopic,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			400,
			"Error fetch topic data",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

const getExecutiveController = async (req, res) => {
	try {
		const getExecutive = await getExecutiveService();

		const result = await response(
			200,
			"Succes fetch exectuve data",
			getExecutive,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			400,
			"Error fetch executive data",
			null,
			e.message,
			req,
			res
		);

		return error;
	}
};

const getNomorCadanganController = async (req, res) => {
	try {
		const getNomorCadangan = await getNomorCadanganService();

		const result = await response(
			200,
			"Succes fetch nomor cadangan data",
			getNomorCadangan,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			400,
			"Error fetch nomor cadangan data",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

const getUnitController = async (req, res) => {
	try {
		const getUnit = await getAllUnitService();

		const result = await response(
			200,
			"Succes fetch Unit data",
			getUnit,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			400,
			"Error fetch Unit data",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

const getCodeSuratController = async (req, res) => {
	try {
		const getUnit = await getCodeSurat();

		const result = await response(
			200,
			"Succes fetch code surat data",
			getUnit,
			null,
			req,
			res
		);

		return result;
	} catch (e) {
		const error = await response(
			400,
			"Error fetch code surat data",
			null,
			e,
			req,
			res
		);

		return error;
	}
};

module.exports = {
	getTopicController,
	getExecutiveController,
	getNomorCadanganController,
	getUnitController,
	getCodeSuratController,
};
