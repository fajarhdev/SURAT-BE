const fs = require('fs').promises; // Use the promise-based fs module
const path = require('path');
const Masterjob = require('../model/masterjob');
const SystemDetail = require("../model/systemdetail");
const cronParser = require('cron-parser');

const deletePhoto = async () => {
    try {
        console.log("START JOB DELETE PHOTO");

        // Fetch job data for 'delete-photo'
        const jobData = await Masterjob.findOne({
            where: { name: 'delete-photo' },
        });

        if (!jobData) {
            console.error('Job "delete-photo" not found.');
            return;
        }

        // Fetch the system date (e.g., current date)
        const tanggalSystem = await SystemDetail.findOne({
            where: { code: 'TGLTODAY' },
        });

        if (!tanggalSystem || isNaN(new Date(tanggalSystem.value).getTime())) {
            console.error('Invalid system date (TGLTODAY) value.');
            return;
        }

        const tanggal = new Date(tanggalSystem.value); // Current system date
        const cronExpression = jobData.cron; // Cron expression stored in the database

        if (!cronExpression) {
            console.error('Cron expression is missing for the job.');
            return;
        }

        // Parse the cron expression and calculate the next execution date
        let nextExecution;
        try {
            const interval = cronParser.parseExpression(cronExpression, { currentDate: tanggal });
            nextExecution = interval.next().toDate();
        } catch (err) {
            console.error('Failed to parse cron expression:', err.message);
            return;
        }
        let updateDataJob;

        // update awal untuk inisiasi job
        if (jobData.lastRunning === null) {
            updateDataJob = await Masterjob.update({
                lastRunning: tanggal,
                nextRunning: nextExecution
            }, {
                where: {
                    name: 'delete-photo'
                }
            })
        }

        // Validate if today is the day to run the deletion
        const today = tanggal.toDateString(); // System date (e.g., 'Tue Jan 28 2025')
        const nextRunDate = updateDataJob.nextRunning.toDateString(); // Next scheduled execution date

        if (today !== nextRunDate) {
            console.log(`Today (${today}) is not the scheduled day to delete files. Next run is on ${nextRunDate}.`);
            return;
        }

        // Proceed with deleting files if today is the correct day
        const uploadDir = path.resolve(__dirname, '../../public/upload'); // Path to 'upload' folder

        // Check if the upload directory exists
        if (!(await fs.stat(uploadDir).catch(() => false))) {
            console.error(`Upload directory "${uploadDir}" does not exist.`);
            return;
        }

        const files = await fs.readdir(uploadDir); // Get all files/directories inside 'upload'

        // Loop through each file/directory and remove it
        for (const file of files) {
            const filePath = path.join(uploadDir, file);

            // Remove the file or directory (recursive for subdirectories)
            await fs.rm(filePath, { recursive: true, force: true });
        }

        // Update the job with the lastRunning and nextExecution dates
        await Masterjob.update(
            {
                lastRunning: tanggal, // Update the last running date
                nextRunning: nextExecution, // Update the next execution date
            },
            {
                where: { name: 'delete-photo' },
            }
        );

        console.log("Success deleted all contents inside upload folder");
        console.log(`Job 'delete-photo' will run next at: ${nextExecution}`);
    } catch (err) {
        console.error("Error while deleting photo:", err.stack || err);
    } finally {
        console.log("END JOB DELETE PHOTO");
    }
};

module.exports = deletePhoto;