const fs = require('fs').promises; // Use the promise-based fs module
const path = require('path');

const deletePhoto = async () => {
    try {
        console.log("START JOB DELETE PHOTO");

        const uploadDir = path.join(__dirname, '/../..', 'public', 'upload'); // Path to the 'uploads' folder

        // Get all the files and directories inside the 'upload' folder
        const files = await fs.readdir(uploadDir);

        // Loop through each file/directory and remove it
        for (const file of files) {
            const filePath = path.join(uploadDir, file);

            // Remove the file or directory (recursive for subdirectories)
            await fs.rm(filePath, { recursive: true, force: true });
        }

        console.log("Success deleted all contents inside upload folder");
    } catch (err) {
        console.log("Error while deleting photo:", err);
    } finally {
        console.log("END JOB DELETE PHOTO");
    }
};

module.exports = deletePhoto;