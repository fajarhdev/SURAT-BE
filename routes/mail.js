const express = require("express");
const verifyToken = require("../src/middleware/verifytoken");
const {
	getIncomingMailController,
	createIncomingMailController,
} = require("../src/controller/incomingController");
const upload = require("../src/middleware/multer");
const {
	getOutgoingMailController,
	createOutgoingMailController,
} = require("../src/controller/outgoingController");
const router = express.Router();

router.get("/getincomingmail", verifyToken, getIncomingMailController);
router.post(
	"/createincomingmail",
	verifyToken,
	upload.single("file"),
	createIncomingMailController
);

router.get("/getoutgoingmail", verifyToken, getOutgoingMailController);
router.post("/createoutgoingmail", verifyToken, createOutgoingMailController);

module.exports = router;
