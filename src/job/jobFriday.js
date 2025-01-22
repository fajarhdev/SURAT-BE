const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");

const jobFriday = async (boss) => {
    // await boss.work('nomor-surat-cadangan-update', {retryLimit: 3, retryDelay: 60000}, async () => {
        console.log('Worker for "nomor-surat-cadangan-update" has been running');

        try {
            // Get Tanggal
            const sys = await System.findOne({
                where: {
                    key: 'TGLTODAY'
                }
            });

            console.log(`SYSTEM, ${sys.key}`);

            const sysDetail = await SystemDetail.findOne({
                where: {
                    masterId: sys.id
                }
            });
            // END GET TGL
            console.log("SYSTEM DETAIL" + sysDetail.code);

            if (!sys) {
                console.log("GK KETEMU UY");
                throw new Error("System with key 'TGLTODAY' not found");
            }

            if (!sysDetail) {
                console.log("GK KETEMU UY");
                throw new Error(`SystemDetail for masterId ${sys.id} not found`);
            }
            console.log("YOOYOYOYOYOYOYOYOOYOY");

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

            const sysCad = await System.findOne({
                where: {
                    key: 'NUMMAILCADANGAN'
                }
            });

            const oldVal = Number(nomorOtomatisDetail.value);

            const newVal = oldVal +21;

            const date = new Date(sysDetail.value); // Convert the input to a Date object

            if (date.getDay() === 3) {
                console.log('DALEM LOOP');

                const newValues = [];
                for (let i = oldVal + 1; i <= oldVal + 20; i++) {
                    newValues.push({ code: 'NUMCAD', masterId: sysCad.id, value: i });
                }
                console.log(newValues)
                await SystemDetail.bulkCreate(newValues);

                // const sysCadDetail = await SystemDetail.findOne({
                //     where: {
                //         masterId: sysCad.id
                //     },
                //     order: [['value', 'DESC']]
                // });

                await SystemDetail.update({
                    value: newVal
                }, {
                    where: {
                        masterId: sysDetail
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