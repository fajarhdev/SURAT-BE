const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");
const sequelize = require("../../config/database");
const cronParser = require("cron-parser");
const Masterjob = require("../model/masterjob");

const jobFriday = async (job) => {
	console.log('Worker for "nomor-surat-cadangan-update" has been running');

	try {
		// Fetch job data for 'nomor-surat-cadangan-update'
		const jobData = await Masterjob.findOne({
			where: {
				name: "nomor-surat-cadangan-update",
			},
		});

		if (!jobData) {
			console.error('Job "nomor-surat-cadangan-update" not found.');
			return;
		}

		// Get Tanggal
		const tanggal = await System.findOne({
			where: {
				key: "TGLTODAY",
			},
		});

		const tanggalDetail = await SystemDetail.findOne({
			where: {
				masterId: tanggal.id,
			},
		});
		// END GET TGL

		// GET NOMOR OTOMATIS
		const nomorOtomatis = await System.findOne({
			where: {
				key: "NUMMAIL",
			},
		});

		const nomorOtomatisDetail = await SystemDetail.findOne({
			where: {
				masterId: nomorOtomatis.id,
			},
		});

		// END GET NOMOR OTOMATIS

		const masterCadangan = await System.findOne({
			where: {
				key: "NUMMAILCADANGAN",
			},
		});

		const oldVal = Number(nomorOtomatisDetail.value);

		const newVal = oldVal + 20;

		const date = new Date(tanggalDetail.value); // Convert the input to a Date object
		console.log("DATE: " + date);
		console.log("TODAY" + date.getDay());
		const t = await sequelize.transaction(); // Start a transaction
		let nextExecution = null;

		if (date.getDay() === 5) {
			// Check if it's Friday
			const tanggalTerbaru = await SystemDetail.findOne({
				where: {
					code: "NUMMAILCADANGAN",
					masterId: masterCadangan.id,
				},
				order: [["createdAt", "ASC"]],
			});

			let isSameDate;
			if (tanggalTerbaru) {
				// Extract only the date part for comparison
				const tanggalDetailDate = new Date(tanggalDetail.value);
				const tanggalTerbaruDate = new Date(
					tanggalTerbaru.createdAt
				);

				isSameDate =
					tanggalDetailDate.getFullYear() ===
						tanggalTerbaruDate.getFullYear() &&
					tanggalDetailDate.getMonth() ===
						tanggalTerbaruDate.getMonth() &&
					tanggalDetailDate.getDate() ===
						tanggalTerbaruDate.getDate();
			} else {
				// di db kosong
				isSameDate = false;
			}

			if (!isSameDate) {
				// If dates are different
				const newValues = [];
				for (let i = oldVal + 1; i <= oldVal + 20; i++) {
					newValues.push({
						code: "NUMMAILCADANGAN",
						masterId: masterCadangan.id,
						value: i,
					});
				}
				console.log(newValues);

				// Insert new data nomor cadangan
				await SystemDetail.bulkCreate(newValues);

				// Update nomor otomatis
				await SystemDetail.update(
					{ value: newVal },
					{
						where: {
							masterId: nomorOtomatis.id,
						},
					}
				);

				// Fetch the system date
				const tanggalSystem = await SystemDetail.findOne({
					where: {
						code: "TGLTODAY",
					},
				});

				if (!tanggalSystem) {
					console.error(
						"System date (TGLTODAY) not found."
					);
					return;
				}

				const tanggalJob = new Date(tanggalSystem.value); // Get the current date from system

				// Calculate the next execution date using the cron expression
				// Declare nextExecution outside the try block
				// let nextExecution = null;

				try {
					const cronExpression = jobData.cron; // Assuming the cron expression is stored in the job
					const interval = cronParser.parseExpression(
						cronExpression,
						{ currentDate: tanggalJob }
					);
					nextExecution = interval.next().toDate(); // Calculate the next execution date
				} catch (err) {
					console.error(
						"Failed to parse cron expression:",
						err.message
					);
					return;
				}

				// Update the job with the lastRunning and nextExecution dates
				await Masterjob.update(
					{
						lastRunning: tanggalJob, // Update the last running date
						nextRunning: nextExecution, // Update the next execution date
					},
					{
						where: {
							name: "nomor-surat-cadangan-update",
						},
					}
				);
			}
		}

		console.log(
			`Job 'nomor-surat-cadangan-update' will run next at: ${nextExecution}`
		);
		console.log(
			'Worker for "nomor-surat-cadangan-update" has been finish'
		);
	} catch (err) {
		// await t.rollback();
		console.error(`Job failed: ${job.id}, retrying...`);
		throw new Error(`Error job Friday: ${err.message}`);
	}
};

module.exports = jobFriday;
