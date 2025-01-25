const fs = require('fs');
const path = require('path');

const deletePhoto = async () => {
    const uploadDir = path.join(__dirname, '../../..', 'public', 'upload'); // Path to the 'uploads' folder

    fs.rm(uploadDir, { recursive: true, force: true }, (err) => {
        if (err) {
            console.log(err);
        }
        return 'Success deleted photo';
    });
}

module.exports = deletePhoto;