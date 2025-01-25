const { exec } = require('child_process');

// Using async/await for better readability
const runBackup = async () => {
    try {
        const result = await new Promise((resolve, reject) => {
            exec('/path/to/your/backup.sh', (error, stdout, stderr) => {
                if (error) {
                    reject(`Error: ${error.message}`);
                }
                if (stderr) {
                    reject(`stderr: ${stderr}`);
                }
                resolve(stdout);
            });
        });
        return result;  // If successful, return the result
    } catch (error) {
        throw new Error(error);  // If an error occurs, throw it
    }
};


module.exports = runBackup;