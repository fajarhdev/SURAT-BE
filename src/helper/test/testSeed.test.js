const { expect, test } = require("@jest/globals");
const { seedExecutive, seedKodeSurat, seedTopic } = require("../runner");
const MailCode = require("../../model/mailcode");
const fs = require("fs");
const TopicDetail = require("../../model/topicdetail");

const dataKodeSurat = fs.readFileSync(
	"../backend_new/src/helper/seed/dataKodeSurat.json",
	"utf8"
);
const dataTopic = fs.readFileSync(
	"../backend_new/src/helper/seed/masalahJSON.json",
	"utf8"
);
const jsonDataKodeSurat = JSON.parse(dataKodeSurat);
const jsonDataTopic = JSON.parse(dataTopic);

test("TEST SEEDING KODE SURAT", async () => {
	await seedKodeSurat(jsonDataKodeSurat); // Make sure the seed function returns a promise
	const codemail = await MailCode.findAll();
	expect(codemail.length).not.toBeNull();
});

test("TEST SEEDING Topic", async () => {
	await seedTopic(jsonDataTopic); // Make sure the seed function returns a promise
	// const topic = await TopicDetail();
	// expect(topic).not.toBeNull();
});
