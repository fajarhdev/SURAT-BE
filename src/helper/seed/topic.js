const xlsx = require("xlsx");
const Topic = require("../../model/topic");
const TopicDetail = require("../../model/topicdetail"); // Adjust path as needed
const path = require("path");

// Read and parse the JSON file
const topicSeedNew = async () => {
	let count = 0;
	const inc = 1;
	try {
		console.log('START SEED TOPIC');
		const dataMaster = await Topic.findAll();
		const dataDetail = await TopicDetail.findAll();
		if (dataMaster.length > 0 && dataDetail.length > 0) {
			return;
		}
		// Read the Excel file
		const filepath = path.join(__dirname + "/Klasifikasi Masalah.xlsx");
		const workbook = xlsx.readFile(filepath);
		const sheetName = workbook.SheetNames[1];
		const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

		let currentMaster = null;
		let currentParent = null;

		for (const row of data) {
			const title = row["Judul"];
			const code = row["Kode"];
			const desc = row["Keterangan"];
			
			const expMaster = '/^[A-Z]{2}\.000$/';
			const expChild = '/^[A-Z]{2}\.[1-9]00$/';

			if (expMaster.test(code)) {
				currentMaster = await Topic.create({
					code: code,
					name: title,
					desc: desc
				});
				currentParent = null; // Reset parent for top-level
			} else if (expChild.test(code)) {
				if (!currentMaster) {
					throw new Error(
						`Found Parent (Level 2) without a Master: ${JSON.stringify(
								row
						)}`
					);
				}
				currentParent = await TopicDetail.create({
					code: code,
					name: title,
					desc: desc,
					masterId: currentMaster.id,
				});
			} else {
				if (!currentParent) {
					throw new Error(
						`Found Child (Level 3) without a Parent: ${JSON.stringify(
							row
						)}`
					);
				}
				const child = await TopicDetail.create({
					code: code,
					name: title,
					desc: desc,
					masterId: currentMaster.id,
					parentId: currentParent.id,
				});
			}
		}

		console.log("Data inserted successfully!");
	} catch (error) {
		console.error("Error inserting data:", error);
	} finally {
		console.log('FINISH SEED TOPIC');
	}
};

module.exports = topicSeedNew;
