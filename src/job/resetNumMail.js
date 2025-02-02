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

        const tanggal = await SystemDetail.findOne({
            where: {
                code: 'TGLTODAY'
            }
        });

        const date = new Date(tanggal.value);

        // Check if the date is January 1st
        const isNewYear = date.getDate() === 1 && date.getMonth() === 0;

        if (isNewYear) {
            // Update the SystemDetail where code = 'NUMMAIL' and masterId = masterSurat.id
            const updateNomorSurat = await SystemDetail.update(
                { value: 0 }, // Fields to update
                {
                    where: {
                        code: 'NUMMAIL',
                        masterId: masterSurat.id // Define the condition for which records to update
                    }
                }
            );

            console.log(`Updated ${updateNomorSurat[0]} rows`);
        }


    } catch (err) {
        throw new Error(`Error job reset nomor email: ${err.message}`);
    }
};

module.exports = resetNumMail;