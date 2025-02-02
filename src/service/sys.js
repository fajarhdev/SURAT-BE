const MailCode = require("../model/mailcode");
const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");
const sequelize = require("../../config/database");
const {QueryTypes} = require("sequelize");

const initSys = async () => {
	try {
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
		// insert master
		for (const listInitMasterKey in listInitMaster) {
			const initMaster = await insertInit(listInitMasterKey);
			if (listInitMasterKey.key === 'TGLTODAY') {
				listInitDetail.push({
					masterId: initMaster.id,
					code: initMaster.key,
					value: new Date(),
					isTake: false
				});
			}else if(listInitMasterKey.key === 'NUMMAIL') {
				listInitDetail.push({
					masterId: initMaster.id,
					code: initMaster.key,
					value: '0',
					isTake: false
				});
			}else if(listInitMasterKey.key === '') {

			}
		}
		await SystemDetail.bulkCreate(listInitDetail);
	}catch (e) {
		throw e;
	}
}

const insertInit = async (sys) => {
	try {
		const sys = await System.create(sys);
	}catch (e) {
		throw e;
	}
}

const checkMaster = async (key) => {
	try {
		const sys = await System.findOne({
			key: key
		});
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
		const query = 'SELECT * FROM "DETAIL_SYSTEM" WHERE master_id = :masterId AND is_take = false ORDER BY CAST(value AS INTEGER)';

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

module.exports = {getNomorCadanganService, getCodeSurat};
