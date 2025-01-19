const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");

const jobFriday = async () => {
    try{
        const sys = await System.findOne({
            where: {
                key: 'TGLTODAY'
            }
        });

        const sysDetail = await SystemDetail.findOne({
            where: {
                masterId: sys.id
            }
        });

        const sysCad = await System.findOne({
            where: {
                key: "NUMMAILCADANGAN"
            }
        });

        const sysCadDetail = await SystemDetail.findOne({
            where: {
                masterId: sysCad.id
            },
            order:[['value', 'DESC']]
        });

        const oldVal = Number(sysCadDetail.value);
        let newVal = oldVal;
        const date = new Date(sysDetail.value); // Convert the input to a Date object
        if (date.getDay() === 5) {
            newVal = oldVal + 20;

            for (let i = oldVal+1; i <= oldVal+20; i++) {
                const insert = await SystemDetail.create({
                    code: 'NUMCAD',
                    masterId: sysCad.id,
                    value: i
                });
            }

        }
    }catch(err){
        throw new Error("Error job Friday", e.message);
    }
}

module.exports = jobFriday;