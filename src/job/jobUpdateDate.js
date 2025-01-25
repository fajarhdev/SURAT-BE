const System = require("../model/system");
const SystemDetail = require("../model/systemdetail");

const updateDate = async () => {
    try {
        const date = new Date();

        // Convert Date to ISO String (adjust format as necessary for your database)
        const dateString = date.toISOString(); // Example: "2025-01-22T16:15:16.842Z"

        // Check if sys exists
        const sys = await System.findOne({
            where: {
                key: 'TGLTODAY'
            }
        });

        if (!sys) {
            console.log("System with key 'TGLTODAY' not found");
            throw new Error("System with key 'TGLTODAY' not found");
        }

        // Log sys for debugging purposes
        console.log('System found:', sys);

        const sysDetail = await SystemDetail.update(
            { value: dateString }, // Update with string format
            { where: { masterId: sys.id } } // Correct `where` clause for the update
        );

        if (sysDetail[0] === 0) {
            console.log("No records updated in SystemDetail");
        } else {
            console.log("SystemDetail updated successfully");
        }

    } catch (err) {
        console.error("Error in updateDate job:", err);
        throw new Error("Error job update date");
    }
}

module.exports = updateDate;