const fs = require('fs');
const { seedExecutive, seedKodeSurat, seedTopic } = require("../runner");
const MailCode = require("../../model/mailcode");
const path = require("path");

const pathfile = path.join(__dirname + "/dataKodeSurat.json");
const dataKodeSurat = fs.readFileSync(
    pathfile,
    "utf8"
);

const jsonDataKodeSurat = JSON.parse(dataKodeSurat);

const seed = async () => {
    try{
        console.log('START SEED KODE SURAT');
        const masterData = await MailCode.findAll();
        if(masterData.length > 0) {
            return;
        }
        await seedKodeSurat(jsonDataKodeSurat);
    }catch(err){
        throw err;
    }finally {
        console.log('FINISH SEED KODE SURAT');
    }
}

module.exports = seed;