const Executive = require("../model/executive");
const ExecutiveDetail = require("../model/executivedetail");
const IncMail = require("../model/incmail");
const MailCode = require("../model/mailcode");
const OutMail = require("../model/outmail");
const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");
const Topic = require("../model/topic");
const TopicDetail = require("../model/topicdetail");
const Unit = require("../model/unit");
const User = require("../model/user");

const getIncomingMailService = async () => {
	try {
		const incMail = await IncMail.findAll();

		return incMail;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

const getOutgoingMailService = async () => {
	try {
		const outMail = await OutMail.findAll();

		return outMail;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

const getLatestOutMail = async () => {
	try {
		const sys = System.findOne({
			where: {
				key: "NUMMAIL",
			},
			include: SystemDetail,
		});

		return sys;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

const saveNumMail = async (value) => {
	try {
		// Check if the master record exists
		const sys = await System.findOne({
			where: {
				key: "NUMMAIL",
			},
		});

		if (sys === null) {
			// Insert new master and detail records if master doesn't exist
			const result = await sequelize.transaction(async (t) => {
				const master = await System.create(
					{ key: "NUMMAIL", desc: "AUTO NUMBERING EMAIL" },
					{ transaction: t }
				);

				const detail = await SystemDetail.create(
					{
						master_id: master.id,
						code: "MAILROW",
						value: 1,
					},
					{ transaction: t }
				);

				return { master, detail };
			});

			return result; // Return the created records
		} else {
			// Update detail record if master exists
			const detail = await SystemDetail.findOne({
				where: {
					master_id: sys.id,
					code: "MAILROW",
				},
			});

			const result = await sequelize.transaction(async (t) => {
				if (detail) {
					// Update existing detail record
					await detail.update(
						{ value: value },
						{ transaction: t }
					);
				} else {
					// Create new detail record if none exists
					await SystemDetail.create(
						{
							master_id: sys.id,
							code: "MAILROW",
							value: 1,
						},
						{ transaction: t }
					);
				}
			});

			return result; // Return the updated or newly created detail
		}
	} catch (e) {
		// Log the error and rethrow with additional information
		console.error("Database operation failed:", e);
		throw new Error(`Error in saveNumMail: ${e.message}`);
	}
};

const saveNumCadangan = async (cadanganAwal, cadanganAkhir) => {
	let nomorCadangan = [];
	for (let i = cadanganAwal; i <= cadanganAkhir; i++) {
		nomorCadangan.push(i);
		const sys = await System.findOne({
			where: {
				key: "NUMMAILSUB",
			},
		});
		const saveCadangan = SystemDetail.create({
			masterId: sys.id,
			code: "NUMMAILSUB",
			value: String(i),
		});
	}

	return nomorCadangan;
};

const createIncomingMailService = async (mail, file) => {
	try {
		// find sender
		// const userData = await User.findOne({
		// 	where: {
		// 		id: user,
		// 	},
		// });

		// // find receiver user
		// const userRec = await User.findOne({
		// 	where: {
		// 		id: mail.rec_name,
		// 	},
		// });

		// // find receiver unit
		// const unitRec = await Unit.findOne({
		// 	where: {
		// 		id: mail.rec_unit,
		// 	},
		// });

		const createMail = await IncMail.create({
			sender: mail.sender,
			destMail: mail.dest_mail,
			subject: mail.subject,
			dispotition: mail.dispotition,
			dispottitionNote: mail.dispottition_note,
			recName: mail.rec_name,
			recUnit: mail.rec_unit,
			incDate: mail.inc_date,
			incTime: mail.inc_time,
			image: file.path,
		});

		return createMail;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

const createOutMailService = async (mail, user) => {
	let isFriday = false;
	const isCadangan = mail.isCadangan;
	try {
		// find code mail
		const codeMail = await MailCode.findOne({
			where: {
				code: mail.mailCode,
			},
		});

		// find problem
		const problem = await Topic.findOne({
			where: {
				id: mail.problem,
			},
			include: TopicDetail,
		});

		// find executive
		const executive = await Executive.findOne({
			where: {
				id: mail.chief,
			},
			include: ExecutiveDetail,
		});

		// find mail maker (user yang terlogin)
		const userData = await User.findOne({
			where: {
				id: user,
			},
		});

		// find unit
		const unit = await Unit.findOne({
			where: {
				id: mail.unit,
			},
		});

		const today = new Date(); // Get the current date
		const dayIndex = today.getDay(); // Get the day index (0 = Sunday, 1 = Monday, etc.)

		const latestNumMail = await getLatestOutMail();
		let numMail = 1;

		if (dayIndex === 5) {
			numMail = Number(latestNumMail.numMail) + 20;
			isFriday = true;
			// const saveNum = await saveNumMail(numMail);
			const nomorCadangan = await saveNumCadangan(
				latestNumMail,
				numMail
			);
			console.log(
				"NOMOR CADANGAN YANG TERSIMPAN => " + nomorCadangan
			);
		} else {
			if (latestNumMail !== null) {
				numMail += 1;
			}
			// const saveNum = await saveNumMail(numMail);
		}

		if (isCadangan) {
			const sys = await SystemDetail.findByPk(mail.nomorcadangan);
			const updateSys = await SystemDetail.update(
				{ isTake: true },
				{
					where: {
						id: mail.nomorcadangan,
						code: "NUMMAILSUB",
					},
				}
			);
			numMail = sys.value;
		}

		const saveNum = await saveNumMail(numMail);

		const createMail = await OutMail.create({
			numMail: numMail,
			numCodeMail: codeMail.id,
			codeMail: codeMail.id,
			subject: mail.subject,
			problem: problem.TopicDetail.id,
			desUnit: unit.id,
			chiefSign: executive.ExecutiveDetail.id,
			chiefDesc: executive.ExecutiveDetail.id,
			mailMaker: userData.id,
			outDate: mail.outDate,
			outTime: mail.outTime,
			isFriday: isFriday,
			isCadangan: isCadangan,
		});

		return createMail;
	} catch (e) {
		throw new Error("Error database", e);
	}
};

module.exports = {
	getIncomingMailService,
	getOutgoingMailService,
	createIncomingMailService,
	createOutMailService,
};
