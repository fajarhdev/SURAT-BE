const xlsx = require("xlsx");
const Executive = require("../../model/executive");
const ExecutiveDetail = require("../../model/executivedetail"); // Adjust path as needed
const path = require("path");

// Read and parse the JSON file
(async () => {
	let count = 0;
	const inc = 1;
	try {
		// Read the Excel file
		const filepath = path.join(__dirname + "/TAKAH TR3.xlsx");
		const workbook = xlsx.readFile(filepath);
		const sheetName = workbook.SheetNames[0];
		const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

		let currentMaster = null;
		let currentParent = null;

		const masterCode = "T3R-00000000"; // Fixed Master code
		const parentRegex = /^[A-Za-z0-9]{3}-0[a-z]{1}000000$/; // Parent code: char in suffix, number is 0
		const childRegex = /^[A-Za-z0-9]{3}-0[a-z]{1}[1-9]\d{5}$/; // Child code: char in suffix, number > 0

		for (const row of data) {
			const no = row["No"];
			const nik = row["NIK"];
			const name = row["Nama"];
			const desc = row["Nama Posisi"];
			const code = row["Kode Unit"];

			if (code === masterCode) {
				console.log("MASTER: ", row);

				// Level 1 (Master)
				currentMaster = await Executive.create({
					nik: nik,
					code: code,
					name: name,
					desc: desc,
				});
				console.log("Created Master:", currentMaster.id, name);
				currentParent = null; // Reset parent for top-level
			} else if (parentRegex.test(code)) {
				console.log("PARENT (LEVEL 2): ", row);

				// Level 2 (Parent under Master)
				if (!currentMaster) {
					throw new Error(
						`Found Parent (Level 2) without a Master: ${JSON.stringify(
							row
						)}`
					);
				}
				currentParent = await ExecutiveDetail.create({
					name: name,
					code: code,
					desc: desc,
					masterId: currentMaster.id,
				});
				console.log("Created Parent:", currentParent.id, name);
			} else if (childRegex.test(code)) {
				console.log("CHILD (LEVEL 3): ", row);

				// Level 3 (Child under Parent)
				if (!currentParent) {
					throw new Error(
						`Found Child (Level 3) without a Parent: ${JSON.stringify(
							row
						)}`
					);
				}
				const child = await ExecutiveDetail.create({
					name: name,
					code: code,
					desc: desc,
					masterId: currentMaster.id,
					parentId: currentParent.id,
				});
				console.log("Created Child:", child.id, name);
			} else {
				console.log("Unknown level: ", row);
			}
		}

		console.log("Data inserted successfully!");
	} catch (error) {
		console.error("Error inserting data:", error);
	} finally {
		console.log("SELESAI INSERT DATA");
	}
})();
