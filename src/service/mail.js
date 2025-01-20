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
const sequelize = require("../../config/database");

const getIncomingMailService = async () => {
	try {
		const incMail = await IncMail.findAll({
			order: [['createdAt', 'DESC']]
		});

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

const getOneOutgoingMailService = async (id) => {
	try {
		const outMail = await OutMail.findOne({
			where: {
				id: id,
			},
		});

		return outMail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const getOutgoingMailService = async () => {
	try {
		let result = [];
		const outMail = await OutMail.findAll({
			order: [['createdAt', 'DESC']], // Order by createdAt in descending order
		});

		for (const mail of outMail) {
			const codeMail = await MailCode.findOne({
				where: {
					id: mail.codeMail,
				},
				order: [['createdAt', 'DESC']], // Ensure the latest MailCode is fetched
			});

			let problem = await Topic.findOne({
				where: {
					id: mail.problem,
				},
			});
			if (!problem) {
				problem = await TopicDetail.findOne({
					where: {
						id: mail.problem,
					},
				});
			}

			let pejabat = await Executive.findOne({
				where: {
					id: mail.chiefSign,
				},
			});
			if (!pejabat) {
				pejabat = await ExecutiveDetail.findOne({
					where: {
						id: mail.chiefSign,
					},
				});
			}

			const user = await User.findOne({
				where: {
					id: mail.mailMaker,
				},
			});

			result.push({
				id: mail.id,
				codeMail: {
					id: codeMail.id,
					desc: codeMail.desc,
					code: codeMail.code,
				},
				numMail: {
					name: mail.numMail,
					id: mail.idCadangan
				},
				numCodeMail: mail.numCodeMail,
				subject: mail.subject,
				problem: {
					id: problem.id,
					code: problem.code,
					name: problem.name,
				},
				desUnit: mail.destUnit,
				chiefSign: {
					id: pejabat.id,
					name: pejabat.desc,
					code: pejabat.code,
				},
				mailMaker: {
					id: user.id,
					mailMaker: user.name,
				},
				outDate: mail.outDate,
				outTime: mail.outTime,
			});
		}

		return result;
	} catch (e) {
		throw new Error(e.message);
	}
};

const getLatestOutMailNum = async () => {
	try {
		const sys = System.findOne({
			where: {
				key: "NUMMAIL",
			},
		});

		return sys;
	} catch (e) {
		throw new Error(e.message);
	}
};

const saveNumMail = async () => {
	try {
		// Check if the master record exists
		const sys = await System.findOne({
			where: {
				key: "NUMMAIL",
			},
		});

		if (sys === null || sys === undefined) {
			// Insert new master and detail records if master doesn't exist
			const result = await sequelize.transaction(async (t) => {
				const master = await System.create(
					{ key: "NUMMAIL", desc: "Penomoran Surat Otomastis" },
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
					masterId: sys.id,
					code: "MAILROW",
				},
			});

			const result = await sequelize.transaction(async (t) => {
				if (detail) {
					// Update existing detail record
					await detail.update(
						{ value: Number(detail.value) + 1 },
						{ transaction: t }
					);
					return detail; // Return the updated detail
				} else {
					// Create new detail record if none exists
					const newDetail = await SystemDetail.create(
						{
							masterId: sys.id,
							code: "MAILROW",
							value: 1,
						},
						{ transaction: t }
					);
					return newDetail; // Return the newly created detail
				}
			});

// Now result will hold the updated or newly created detail
			return result;
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
	const isCadangan = mail.isCadangan ?? false;

	try {
		validateMailOtg(mail);

		// find code mail
		const codeMail = await MailCode.findOne({
			where: {
				id: mail.codeMail,
			},
		});

		// find problem
		let problem = await Topic.findOne({
			where: {
				id: mail.problem,
			},
		});
		if(problem === undefined || problem === null) {
			problem = await TopicDetail.findOne({
				where: {
					id: mail.problem
				}
			});
		}

		// find executive
		let executive = await Executive.findOne({
			where: {
				id: mail.chiefSign,
			},
		});
		if(executive === undefined || executive === null) {
			executive = await ExecutiveDetail.findOne({
				where: {
					id: mail.chiefSign
				}
			});
		}

		// find mail maker (user yang terlogin)
		const userData = await User.findOne({
			where: {
				id: user.id,
			},
		});

		const today = new Date(); // Get the current date
		const dayIndex = today.getDay(); // Get the day index (0 = Sunday, 1 = Monday, etc.)

		let numMail = 0;

		const saveNum = await saveNumMail();

		numMail = saveNum.value;

		if (isCadangan) {
			const sys = await SystemDetail.findOne({
				where: {
					id: mail.numMail
				}
			});

			const updateSys = await SystemDetail.update(
				{ isTake: true },
				{
					where: {
						id: mail.numMail,
						code: "NUMCAD",
					},
				}
			);
			numMail = Number(sys.value);
		}

		const currentYear = new Date().getFullYear();
		//kode surat/nomor surat/masalah utama/pejabat ttd/unit/tahun
		const numCodeMail = `${codeMail.code} ${numMail}/${problem.name}/${executive.code}/${mail.desUnit}/${currentYear}`;

		const createMail = await OutMail.create({
			numMail: numMail,
			numCodeMail: numCodeMail,
			codeMail: codeMail.id,
			subject: mail.subject,
			problem: problem.id,
			destUnit: mail.desUnit,
			chiefSign: executive.id,
			chiefDesc: executive.desc,
			mailMaker: userData.id,
			outDate: mail.outDate,
			outTime: mail.outTime,
			isFriday: isFriday,
			isCadangan: isCadangan,
			idCadangan: mail.numMail
		});

		return createMail;
	} catch (e) {
		throw new Error(e.message);
	}
};

const updateOutMailService = async (mail, user, id) => {
	const isCadangan = mail.isCadangan ?? false;
	try {
		validateMailOtg(mail, true);

		// find code mail
		const codeMail = await MailCode.findOne({
			where: {
				id: mail.codeMail,
			},
		});

		// find problem
		let problem = await Topic.findOne({
			where: {
				id: mail.problem,
			},
		});
		if(problem === undefined || problem === null) {
			problem = await TopicDetail.findOne({
				where: {
					id: mail.problem
				}
			});
		}

		// find executive
		let executive = await Executive.findOne({
			where: {
				id: mail.chiefSign,
			},
		});
		if(executive === undefined || executive === null) {
			executive = await ExecutiveDetail.findOne({
				where: {
					id: mail.chiefSign
				}
			});
		}

		// find mail maker (user yang terlogin)
		const userData = await User.findOne({
			where: {
				id: user.id,
			},
		});

		const getCurrentMail = await getOneOutgoingMailService(id);

		let numMail = 0;

		let sys = null;
		if (isCadangan) {
			//data baru nomor cadangan
			sys = await SystemDetail.findOne({
				where: {
					id: mail.numMail
				}
			});

			//update data baru nomor cadangan
			const updateSys = await SystemDetail.update(
				{ isTake: true },
				{
					where: {
						id: mail.numMail,
						code: "NUMCAD",
					},
				}
			);

			const updateOldData = await SystemDetail.update({
				isTake: false
			},{
				where: {
					id: getCurrentMail.idCadangan
				}
			})
			numMail = Number(sys.value);
		}

		const currentYear = new Date().getFullYear();
		//kode surat/nomor surat/masalah utama/pejabat ttd/unit/tahun
		let numCode = 0;

		if(isCadangan) {
			numCode = numMail;
		}else{
			numCode = getCurrentMail.numMail;
		}
		const numCodeMail = `${codeMail.code} ${numCode}/${problem.name}/${executive.code}/${mail.desUnit}/${currentYear}`;

		const createMail = await OutMail.update(
			{
				numCodeMail: numCodeMail,
				codeMail: codeMail.id,
				subject: mail.subject,
				problem: problem.id,
				destUnit: mail.desUnit,
				chiefSign: executive.id,
				chiefDesc: executive.desc,
				mailMaker: userData.id,
				outDate: mail.outDate,
				outTime: mail.outTime,
				...(isCadangan ? { numMail: numMail, idCadangan: sys.id } : {}),
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

		const getMail = await OutMail.findOne({
			where: {
				id: id
			}
		});

		if (getMail.isCadangan === true) {
			const updateSys = await SystemDetail.update({
				isTake: false
			},{
				where: {
					id: getMail.idCadangan
				}
			});

		}

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
			// requiredFields.push({ field: "image", value: mail.file });
			console.log("FILE NYA NO UPDATE")
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

const validateMailOtg = (mail, isUpdate = false) => {
	const requiredFields = [
		{ field: "subject", value: mail.subject },
		{ field: "problem", value: mail.problem },
		{ field: "desUnit", value: mail.desUnit },
		{ field: "chiefSign", value: mail.chiefSign },
	];

	if (!isUpdate) {
		requiredFields.push({ field: "codeMail", value: mail.codeMail });
		requiredFields.push({ field: "codeMail", value: mail.codeMail });
		requiredFields.push({ field: "codeMail", value: mail.codeMail });
	}

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
