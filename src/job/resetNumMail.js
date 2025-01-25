const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");

const resetNumMail = async () => {
    console.log("START RESET NOMOR SURAT");

    try {
        // Fetch the master record for NUMMAIL
        const masterSurat = await System.findOne({
            where: {
                key: 'NUMMAIL'
            }
        });

        if (!masterSurat) {
            throw new Error("Master Surat with key 'NUMMAIL' not found");
        }

        // Update the SystemDetail where code = 'MAILROW' and masterId = masterSurat.id
        const updateNomorSurat = await SystemDetail.update(
            { value: 1 }, // Fields to update
            {
                where: {
                    code: 'MAILROW',
                    masterId: masterSurat.id // Define the condition for which records to update
                }
            }
        );

        console.log(`Updated ${updateNomorSurat[0]} rows`);

        // If you need to delete records, you can use destroy:
        // const deleteSuratCadangan = await SystemDetail.destroy({
        //     where: {
        //         code: 'NUMCAD'
        //     }
        // });

    } catch (err) {
        throw new Error(`Error job reset nomor email: ${err.message}`);
    }
};

module.exports = resetNumMail;