const multer = require("multer");
const fs = require("fs");
const path = "../../public";

const uploadDir = path.join(__dirname, "public/upload");

if (!fs.existsSync(path)) {
	fs.mkdirSync(path, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir); // Specify upload directory
	},
	filename: (req, file, cb) => {
		const uniqueSuffix =
			Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
	},
});

// Set up multer with storage and file filter
const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
	fileFilter: (req, file, cb) => {
		// Accept only specific file types
		if (
			file.mimetype === "image/jpeg" ||
			file.mimetype === "image/png"
		) {
			cb(null, true);
		} else {
			cb(new Error("Only .jpeg and .png files are allowed"), false);
		}
	},
});

module.exports = upload;
