const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");

const updateDate = async () => {
    try{
        const date = new Date();

        const sys = await System.findOne({
            where: {
                key: 'TGLTODAY'
            }
        });

        const sysDetail = await SystemDetail.update({
            value: date
        }, {
            masterId: sys.id
        });

    }catch(err){
        throw new Error("Error job update date")
    }
}