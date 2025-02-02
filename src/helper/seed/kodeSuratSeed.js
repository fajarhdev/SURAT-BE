const fs = require('fs');
const { seedExecutive, seedKodeSurat, seedTopic } = require("../runner");

const dataKodeSurat = fs.readFileSync(
    "../backend_new/src/helper/seed/dataKodeSurat.json",
    "utf8"
);

const jsonDataKodeSurat = JSON.parse(dataKodeSurat);

const seed = async () => {
    console.log('START SEED KODE SURAT');
    await seedKodeSurat(jsonDataKodeSurat);
    console.log('FINISH SEED KODE SURAT');
}

module.exports = seed;