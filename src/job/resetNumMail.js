const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");

const resetNumMail = async () => {
    console.log("START RESET NOMOR SURAT")

    try{
        const masterSurat = await System.findOne({
            where: {
                key: 'NUMMAIL'
            }
        });

        const updateNomorSurat = await SystemDetail.update({
            value: 1
        },{
            code: 'MAILROW',
            masterId: masterSurat.id
        });
    }catch(err){
        throw new Error(`Error job reset nomor email: ${err.message}`);
    }
}

module.exports = resetNumMail;