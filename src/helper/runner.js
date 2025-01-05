const fs = require("fs");
const MailCode = require("../model/mailcode");

// // Synchronously reading the JSON file
// const dataKodeSurat = fs.readFileSync(
// 	"../helper/seed/dataKodeSurat.json",
// 	"utf8"
// );
// const dataTopic = fs.readFileSync("../helper/seed/masalahJSON.json", "utf8");
// const dataExecutive = fs.readFileSync(
// 	"../helper/seed/pejabatJSON.json",
// 	"utf8"
// );

// // Parsing the JSON string into an object
// const jsonDataKodeSurat = JSON.parse(dataKodeSurat);
// const jsonDataTopic = JSON.parse(dataTopic);
// const jsonDataExecutive = JSON.parse(dataExecutive);

const seedKodeSurat = async (data) => {
	try {
		const save = await MailCode.bulkCreate(data);
	} catch (error) {
		throw new Error(`Error seeding, ${error.message}`);
	}
};

const seedTopic = async (data) => {
	try {
		readJsonNode(data);
	} catch (e) {
		throw new Error("Error seeding", e);
	}
};

const seedExecutive = async (data) => {
	try {
	} catch (e) {}
};

const readJsonNode = (node) => {
	// Process the current node (e.g., log its details)
	console.log(
		`Code: ${node.code}, Name: ${node.name}, Description: ${node.desc}`
	);

	// If the node has children, recursively process each child
	if (node.children && node.children.length > 0) {
		for (let child of node.children) {
			readJsonNode(child); // Recursive call
		}
	}
};

module.exports = { seedKodeSurat, seedTopic, seedExecutive };
