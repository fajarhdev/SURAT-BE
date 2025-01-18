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
const fs = require("fs");
const path = require("path");

const getIncomingMailService = async () => {
	try {
		const incMail = await IncMail.findAll();

		return incMail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const getOneIncomingMailService = async (id) => {
	try {
		const incMail = await IncMail.findOne({
			where: {
				id: id,
			},
		});

		return incMail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const getOutgoingMailService = async () => {
	try {
		const outMail = await OutMail.findAll();

		return outMail;
	} catch (e) {
		throw new Error(e.message);
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
		throw new Error(e.message);
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
		validateMailInc(mail, file);

		const createMail = await IncMail.create({
			sender: mail.sender,
			destMail: mail.destMail,
			subject: mail.subject,
			dispotition: mail.dispotition,
			dispotitionNote: mail.dispotitionNote,
			recName: mail.recName,
			recUnit: mail.recUnit,
			incDate: mail.incDate,
			incTime: mail.incTime,
			image: file.filename,
		});

		return createMail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const updateIncomingMailService = async (mail, id, file) => {
	try {
		const isUpdate = true;
		validateMailInc(mail, file, isUpdate);

		const updateData = {
			sender: mail.sender,
			destMail: mail.destMail,
			subject: mail.subject,
			dispotition: mail.dispotition,
			dispotitionNote: mail.dispotitionNote,
			recName: mail.recName,
			recUnit: mail.recUnit,
			incDate: mail.incDate,
			incTime: mail.incTime,
		};

		// Only include the `image` field if a file is provided
		if (file && file.filename) {
			updateData.image = file.filename;

			const mailData = await getOneIncomingMailService(id);

			const filename = mailData.image;
			const filePath = path.join(
				__dirname,
				"../..",
				"public",
				"upload",
				filename
			);

			fs.unlink(filePath, (err) => {
				if (err) {
					console.error(err);
					// throw new Error("Failed to delete the file.");
				}
				console.log("File delete success");
			});
		}

		const createMail = await IncMail.update(updateData, {
			where: {
				id: id,
			},
		});

		return createMail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const deleteIncomingMailService = async (id) => {
	try {
		const mail = await IncMail.destroy({
			where: {
				id: id,
			},
		});

		return mail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const createOutMailService = async (mail, user) => {
	let isFriday = false;
	const isCadangan = mail.isCadangan;

	try {
		validateMailOtg(mail);

		// find code mail
		const codeMail = await MailCode.findOne({
			where: {
				id: mail.codeMail,
			},
		});

		// find problem
		// const problem = await Topic.findOne({
		// 	where: {
		// 		id: mail.problem,
		// 	},
		// 	include: TopicDetail,
		// });

		// find executive
		// const executive = await Executive.findOne({
		// 	where: {
		// 		id: mail.chiefSign,
		// 	},
		// 	include: ExecutiveDetail,
		// });

		// find mail maker (user yang terlogin)
		const userData = await User.findOne({
			where: {
				id: user.id,
			},
		});

		// find unit
		const unit = await Unit.findOne({
			where: {
				id: mail.desUnit,
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

		//kode surat/nomor surat/masalah utama/pejabat ttd/unit/tahun
		// const numCodeMail = `${codeMail.name}/${numMail}/${}`;

		const createMail = await OutMail.create({
			numMail: numMail,
			numCodeMail: codeMail.id,
			codeMail: codeMail.id,
			subject: mail.subject,
			problem: mail.problem,
			desUnit: unit.id,
			chiefSign: mail.chiefSign,
			chiefDesc: mail.chiefDesc,
			mailMaker: userData.id,
			outDate: mail.outDate,
			outTime: mail.outTime,
			isFriday: isFriday,
			isCadangan: isCadangan,
		});

		return createMail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const updateOutMailService = async (mail, user, id) => {
	try {
		validateMailOtg(mail);

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

		const createMail = await OutMail.update(
			{
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
			},
			{
				where: {
					id: id,
				},
			}
		);

		return createMail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const deleteOutMailService = async (id) => {
	try {
		const mail = await OutMail.destroy({
			where: {
				id: id,
			},
		});

		return mail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const validateMailInc = (mail, file, isUpdate = false) => {
	const requiredFields = [
		{ field: "sender", value: mail.sender },
		{ field: "destMail", value: mail.destMail },
		{ field: "subject", value: mail.subject },
		{ field: "recName", value: mail.recName },
		{ field: "recUnit", value: mail.recUnit },
		{ field: "incDate", value: mail.incDate },
		{ field: "incTime", value: mail.incTime },
	];

	// Tambahkan kondisi untuk file jika isUpdate adalah true
	if (isUpdate) {
		if (file === undefined) {
			requiredFields.push({ field: "image", value: mail.file });
		} else {
			requiredFields.push({
				field: "image",
				value: file?.filename,
			});
		}
	} else {
		requiredFields.push({ field: "image", value: file?.filename });
	}

	// Validasi semua field
	for (const { field, value } of requiredFields) {
		if (!value || value === "") {
			throw new Error(`The field ${field} cannot be empty.`);
		}
	}
};

const validateMailOtg = (mail) => {
	const requiredFields = [
		// { field: "numCodeMail", value: mail.numCodeMail },
		{ field: "codeMail", value: mail.codeMail },
		{ field: "subject", value: mail.subject },
		{ field: "problem", value: mail.problem },
		{ field: "desUnit", value: mail.desUnit },
		{ field: "chiefSign", value: mail.chiefSign },
		{ field: "chiefDesc", value: mail.chiefDesc },
		{ field: "outDate", value: mail.outDate },
		{ field: "outTime", value: mail.outTime },
	];

	for (const { field, value } of requiredFields) {
		if (value === null || value === undefined || value === "") {
			throw new Error(`The field ${field} cannot be empty.`);
		}
	}
};
module.exports = {
	getIncomingMailService,
	getOutgoingMailService,
	createIncomingMailService,
	createOutMailService,
	updateOutMailService,
	deleteOutMailService,
	updateIncomingMailService,
	deleteIncomingMailService,
};
