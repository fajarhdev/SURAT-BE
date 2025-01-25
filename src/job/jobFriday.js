const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");
const sequelize = require('../../config/database');

const jobFriday = async (job) => {
        console.log('Worker for "nomor-surat-cadangan-update" has been running');

        try {
            // Get Tanggal
            const tanggal = await System.findOne({
                where: {
                    key: 'TGLTODAY'
                }
            });

            const tanggalDetail = await SystemDetail.findOne({
                where: {
                    masterId: tanggal.id
                }
            });
            // END GET TGL

            // GET NOMOR OTOMATIS
            const nomorOtomatis = await System.findOne({
                where: {
                    key: "NUMMAIL"
                }
            });

            const nomorOtomatisDetail = await SystemDetail.findOne({
                where: {
                    masterId: nomorOtomatis.id
                }
            });

            // END GET NOMOR OTOMATIS

            const masterCadangan = await System.findOne({
                where: {
                    key: 'NUMMAILCADANGAN'
                }
            });

            const oldVal = Number(nomorOtomatisDetail.value);

            const newVal = oldVal +21;

            const date = new Date(tanggalDetail.value); // Convert the input to a Date object

            if (date.getDay() === 6) {
                console.log('DALEM LOOP');
                const t = await sequelize.transaction(); // Start a transaction

                const newValues = [];
                for (let i = oldVal + 1; i <= oldVal + 20; i++) {
                    newValues.push({ code: 'NUMCAD', masterId: masterCadangan.id, value: i });
                }
                console.log(newValues)
                // insert data nomor cadangan
                await SystemDetail.bulkCreate(newValues, { transaction: t });

                // update nomor otomatis nya
                await SystemDetail.update({
                    value: newVal
                }, {
                    where: {
                        masterId: nomorOtomatis.id
                    }
                });
            }

            console.log('Worker for "nomor-surat-cadangan-update" has been finish');
        } catch (err) {
            console.error(`Job failed: ${job.id}, retrying...`);
            throw new Error(`Error job Friday: ${err.message}`);
        }
}

module.exports = jobFriday;