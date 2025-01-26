const PgBoss = require('pg-boss');
const jobFriday = require("./jobFriday");
const resetNumMail = require("./resetNumMail");
const updateDate = require("./jobUpdateDate");
const deletePhoto = require("./deletePhoto");
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
    await boss.work('delete-photo', {retryLimit: 3, retryDelay: 60000}, deletePhoto);

    // Schedule the jobs
    await boss.schedule('nomor-surat-cadangan-update', '*/50 * * * *', { priority: 2 });
    await boss.schedule('update-tanggal', '*/50 * * * *', { priority: 1 });
    await boss.schedule('reset-nomor-surat', '*/50 * * * *', { priority: 2 });
    await boss.schedule('delete-photo', '*/1 * * * *', { priority: 3 });


    console.log('pg-boss finished!');
})();

