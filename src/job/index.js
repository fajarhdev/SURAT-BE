const deletePhoto = require("./deletePhoto");
const jobFriday = require("./jobFriday");
const resetNumMail = require("./resetNumMail");
const updateDate = require("./jobUpdateDate");

const Masterjob = require("../model/masterjob");
require("dotenv").config();
const PgBoss = require('pg-boss');

const boss = new PgBoss({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false, // Accept self-signed certificates (optional, for development)
    },
    max: 10, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 20000, // Timeout for connecting to the database
    schema: 'surat'
});

async function startPgBoss() {
    await boss.on('failed', console.error);
    await boss.start();
    await boss.clearStorage(); // Optional: Remove all jobs in storage
    console.log('pg-boss started!');

    // Create the queues (ensure they exist)
    await boss.createQueue('nomor-surat-cadangan-update');
    await boss.createQueue('update-tanggal');
    await boss.createQueue('reset-nomor-surat');
    await boss.createQueue('delete-photo');

    // Send jobs to the queues
    await boss.send('nomor-surat-cadangan-update', {});
    await boss.send('update-tanggal', {});
    await boss.send('reset-nomor-surat', {});
    await boss.send('delete-photo', {});

    // Register workers for the queues
    await boss.work('nomor-surat-cadangan-update', { retryLimit: 3, retryDelay: 60000 }, jobFriday);
    await boss.work('update-tanggal', { retryLimit: 3, retryDelay: 60000 }, updateDate);
    await boss.work('reset-nomor-surat', { retryLimit: 3, retryDelay: 60000 }, resetNumMail);
    await boss.work('delete-photo', { retryLimit: 3, retryDelay: 60000 }, deletePhoto);

    // Schedule the jobs
    await boss.schedule('nomor-surat-cadangan-update', '0 0 * * 5', { priority: 2, timezone: 'Asia/Jakarta' }); // every Friday
    await boss.schedule('update-tanggal', '0 0 * * *', { priority: 1, timezone: 'Asia/Jakarta' }); // every day 00:00
    await boss.schedule('reset-nomor-surat', '0 0 1 1 *', { priority: 2, timezone: 'Asia/Jakarta' }); // every year
    await boss.schedule('delete-photo', '0 0 1 */6 *', { priority: 3, timezone: 'Asia/Jakarta' }); // every 6 months

    const jobList = await boss.getSchedules();
    let jobListObj = [];

    for (const job of jobList) {
        jobListObj.push({
            name: job.name,
            desc: null,
            lastRunning: null,
            cron: job.cron
        });
    }

    try {
        // Fetch existing records from Masterjob
        const existingJobs = await Masterjob.findAll();
        const existingJobMap = new Map();

        // Create a map for quick lookup of existing jobs
        for (const existingJob of existingJobs) {
            existingJobMap.set(existingJob.name, {
                cron: existingJob.cron,
            });
        }

        // Process jobs
        for (const job of jobListObj) {
            const existingJob = existingJobMap.get(job.name);

            if (!existingJob) {
                // Job doesn't exist, insert it
                await Masterjob.create(job);
            } else if (job.cron !== existingJob.cron) {
                // Job exists but cron is different, update it
                await Masterjob.update(
                    { cron: job.cron },
                    { where: { name: job.name } }
                );
            }
        }
    } catch (e) {
        throw e;
    }

    console.log('pg-boss finished!');
}

// Export the function
module.exports = startPgBoss;