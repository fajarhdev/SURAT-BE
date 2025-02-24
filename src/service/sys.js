const MailCode = require("../model/mailcode");
const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");
const sequelize = require("../../config/database");
const {QueryTypes} = require("sequelize");
const { Op } = require('sequelize'); // Import Sequelize operators

const initSys = async () => {
	try {
		console.log('START SEED SYSTEM DB');
		const masterData = await System.findAll({
			where: {
				key: {
					[Op.in]: ['TGLTODAY', 'NUMMAIL', 'NUMMAILCADANGAN'] // Array of keys to match
				}
			}
		});

		if (masterData.length > 0) {
			return;
		}
		const listInitMaster = [
			{
				key: 'TGLTODAY',
				desc: 'TANGGAL HARI INI'
			},
			{
				key: 'NUMMAIL',
				desc: 'PENOMORAN SURAT OTOMATIS'
			},
			{
				key: 'NUMMAILCADANGAN',
				desc: 'PENOMORAN SURAT CADANGAN'
			}
		];

		let listInitDetail = [];

// Insert master and prepare details
		for (const masterItem of listInitMaster) {
			const initMaster = await insertInit(masterItem); // Assuming `insertInit` is a function that inserts the master and returns the inserted object

			if (masterItem.key === 'TGLTODAY') {
				listInitDetail.push({
					masterId: initMaster.id,
					code: masterItem.key,
					value: new Date(),
					isTake: false
				});
			} else if (masterItem.key === 'NUMMAIL') {
				listInitDetail.push({
					masterId: initMaster.id,
					code: masterItem.key,
					value: '0',
					isTake: false
				});
			}
		}

		// Insert details in bulk
		await SystemDetail.bulkCreate(listInitDetail); // Assuming `SystemDetail` is your Sequelize model for the details table
	}catch (e) {
		throw e;
	}finally {
		console.log('FINISH SEED SYSTEM DB');
	}
}

const insertInit = async (masterSys) => {
	try {
		const sys = await System.create(masterSys);

		return sys;
	}catch (e) {
		throw e;
	}
}

const getNomorCadanganService = async () => {
	try {
		const nomorCadanganMaster = await System.findOne({
			where: {
				key: "NUMMAILCADANGAN",
			},
		});
		const query = `SELECT *
			FROM "DETAIL_SYSTEM"
			WHERE code = 'NUMMAILCADANGAN'
			AND EXTRACT(YEAR FROM "createdAt") = (
			    SELECT EXTRACT(YEAR FROM MAX("createdAt"))
			    FROM "DETAIL_SYSTEM"
			    WHERE code = 'NUMMAILCADANGAN' LIMIT 1
			);`;

		const nomorCadangan = await sequelize.query(query, {
			replacements: { masterId: nomorCadanganMaster.id },
			type: QueryTypes.SELECT
		});
		return nomorCadangan;
	} catch (e) {
		throw new Error("Error database", e);
	}
};


const getCodeSurat = async () => {
	try {
		const code = await MailCode.findAll();

		return code;
	} catch (e) {
		throw new Error("Error database", e.message);
	}
}

module.exports = {getNomorCadanganService, getCodeSurat, initSys};
