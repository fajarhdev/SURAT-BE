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

            const newVal = oldVal +20;

            const date = new Date(tanggalDetail.value); // Convert the input to a Date object
            console.log("DATE: " + date);
            console.log("TODAY"+date.getDay());
            const t = await sequelize.transaction(); // Start a transaction
            if (date.getDay() === 0) { // Check if it's Sunday
                const tanggalTerbaru = await SystemDetail.findOne({
                    where: {
                        code: 'NUMCAD',
                        masterId: masterCadangan.id,
                    },
                    order: [["createdAt", "ASC"]]
                });

                // Extract only the date part for comparison
                const tanggalDetailDate = new Date(tanggalDetail.value);
                const tanggalTerbaruDate = new Date(tanggalTerbaru.createdAt);

                const isSameDate =
                    tanggalDetailDate.getFullYear() === tanggalTerbaruDate.getFullYear() &&
                    tanggalDetailDate.getMonth() === tanggalTerbaruDate.getMonth() &&
                    tanggalDetailDate.getDate() === tanggalTerbaruDate.getDate();

                if (!isSameDate) { // If dates are different
                    const newValues = [];
                    for (let i = oldVal; i <= oldVal + 20; i++) {
                        newValues.push({ code: 'NUMCAD', masterId: masterCadangan.id, value: i });
                    }
                    console.log(newValues);

                    // Insert new data
                    await SystemDetail.bulkCreate(newValues);

                    // Update nomor otomatis
                    await SystemDetail.update(
                        { value: newVal },
                        {
                            where: {
                                masterId: nomorOtomatis.id
                            },
                        }
                    );
                }
            }


            console.log('Worker for "nomor-surat-cadangan-update" has been finish');
        } catch (err) {
            // await t.rollback();
            console.error(`Job failed: ${job.id}, retrying...`);
            throw new Error(`Error job Friday: ${err.message}`);
        }
}

module.exports = jobFriday;