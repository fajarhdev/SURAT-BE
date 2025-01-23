const PgBoss = require('pg-boss');
const jobFriday = require("./jobFriday");
const resetNumMail = require("./resetNumMail");
const updateDate = require("./jobUpdateDate");
require("dotenv").config();


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
});

(async () => {
    await boss.start();
    console.log('pg-boss started!');

    // Register pekerjaan
    // await jobFriday(boss);
    // Register pekerjaan, check if it hasn't been registered before

    if (boss.getQueue('nomor-surat-cadangan-update')) {
        await boss.createQueue('nomor-surat-cadangan-update');
        await boss.work('nomor-surat-cadangan-update', { retryLimit: 3, retryDelay: 60000 }, jobFriday);
        console.log('Worker for "nomor-surat-cadangan-update" has been registered');
    }
    // Schedule the job to run every Friday at midnight
    await boss.schedule('nomor-surat-cadangan-update', '*/5 * * * *', {priority: 1}); //0 0 * * 5
    console.log('Job scheduled to run every Friday at midnight');

    // Register pekerjaan, check if it hasn't been registered before
    if (boss.getQueue('reset-nomor-surat')) {
        await boss.createQueue('reset-nomor-surat');
        await boss.work('reset-nomor-surat', { retryLimit: 3, retryDelay: 60000 }, jobFriday);
        console.log('Worker for "reset-nomor-surat" has been registered');
    }
    // await boss.createQueue('reset-nomor-surat');
    // await boss.work('reset-nomor-surat', {retryLimit: 3, retryDelay: 60000}, resetNumMail);
    await boss.schedule('reset-nomor-surat', '*/5 * * * *', {priority: 2}); //0 0 1 1 *

    // await boss.createQueue('update-date');
    // await boss.work('update-date', {retryLimit: 3, retryDelay: 60000 }, updateDate);
    // await boss.schedule('update-date', '*/5 * * * *', {}) //0 0 * * *
})();
