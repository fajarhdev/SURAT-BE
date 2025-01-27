const fs = require('fs').promises; // Use the promise-based fs module
const path = require('path');
const Masterjob = require('../model/masterjob');
const SystemDetail = require("../model/systemdetail");
const cronParser = require('cron-parser');

const deletePhoto = async () => {
    try {
        // Fetch job data for 'delete-photo'
        const jobData = await Masterjob.findOne({
            where: {
                name: 'delete-photo'
            }
        });

        if (!jobData) {
            console.error('Job "delete-photo" not found.');
            return;
        }

        const uploadDir = path.join(__dirname, '/../..', 'public', 'upload'); // Path to the 'uploads' folder
        const files = await fs.readdir(uploadDir); // Get all files and directories inside 'upload'

        // Loop through each file/directory and remove it
        for (const file of files) {
            const filePath = path.join(uploadDir, file);

            // Remove the file or directory (recursive for subdirectories)
            await fs.rm(filePath, { recursive: true, force: true });
        }

        // Fetch the system date
        const tanggalSystem = await SystemDetail.findOne({
            where: {
                code: 'TGLTODAY'
            }
        });

        if (!tanggalSystem) {
            console.error('System date (TGLTODAY) not found.');
            return;
        }

        const tanggal = new Date(tanggalSystem.value); // Get the current date from system

        // Calculate the next execution date using the cron expression
        let nextExecution;
        try {
            const cronExpression = jobData.cron; // Assuming the cron expression is stored in the job
            const interval = cronParser.parseExpression(cronExpression, { currentDate: tanggal });
            nextExecution = interval.next().toDate(); // Calculate the next execution date
        } catch (err) {
            console.error('Failed to parse cron expression:', err.message);
            return;
        }

        // Update the job with the lastRunning and nextExecution dates
        await Masterjob.update({
            lastRunning: tanggal,      // Update the last running date
            nextExecution: nextExecution // Update the next execution date
        }, {
            where: {
                name: 'delete-photo'
            }
        });

        console.log("Success deleted all contents inside upload folder");
        console.log(`Job 'delete-photo' will run next at: ${nextExecution}`);
    } catch (err) {
        console.log("Error while deleting photo:", err);
    } finally {
        console.log("END JOB DELETE PHOTO");
    }
};

module.exports = deletePhoto;