const fs = require('fs').promises;
const path = require('path');
const Masterjob = require('../model/masterjob');
const SystemDetail = require("../model/systemdetail");
const cronParser = require('cron-parser');

const deletePhoto = async () => {
    console.log("START JOB DELETE PHOTO");

    try {
        // Fetch job data and system date in parallel
        const [jobData, tanggalSystem] = await Promise.all([
            Masterjob.findOne({ where: { name: 'delete-photo' } }),
            SystemDetail.findOne({ where: { code: 'TGLTODAY' } })
        ]);

        // Early exit for missing/invalid data
        if (!jobData) {
            console.error('Job "delete-photo" not found.');
            return;
        }

        if (!tanggalSystem?.value || !Date.parse(tanggalSystem.value)) {
            console.error('Invalid system date (TGLTODAY) value.');
            return;
        }

        const tanggal = new Date(tanggalSystem.value);
        const cronExpression = jobData.cron;

        if (!cronExpression) {
            console.error('Cron expression is missing for the job.');
            return;
        }

        // Calculate next execution
        let nextExecution;
        try {
            const interval = cronParser.parseExpression(cronExpression, { currentDate: tanggal });
            nextExecution = interval.next().toDate();
        } catch (err) {
            console.error('Failed to parse cron expression:', err.message);
            return;
        }

        // Handle initial job state
        if (jobData.lastRunning === null) {
            await Masterjob.update({
                lastRunning: tanggal,
                nextRunning: nextExecution
            }, { where: { name: 'delete-photo' } });

            // Update local job data to avoid extra query
            jobData.lastRunning = tanggal;
            jobData.nextRunning = nextExecution;
        }

        // Check execution timing using actual date comparison
        const currentTime = tanggal.getTime();
        const nextRunTime = new Date(jobData.nextRunning).getTime();

        if (currentTime < nextRunTime) {
            console.log(`Next run scheduled at: ${jobData.nextRunning}`);
            return;
        }

        // Process file deletion
        const uploadDir = path.resolve(__dirname, '../../public/upload');

        // Delete and recreate directory for faster cleanup
        await fs.rm(uploadDir, { recursive: true, force: true });
        await fs.mkdir(uploadDir, { recursive: true });

        // Update job status
        await Masterjob.update({
            lastRunning: tanggal,
            nextRunning: nextExecution
        }, { where: { name: 'delete-photo' } });

        console.log("Successfully deleted all contents in upload folder");
        console.log(`Next scheduled run at: ${nextExecution}`);
    } catch (err) {
        console.error("Error during photo deletion job:", err.stack || err);
    } finally {
        console.log("END JOB DELETE PHOTO");
    }
};

module.exports = deletePhoto;