const express = require("express");
const verifyToken = require("../src/middleware/verifytoken");
const {
	getIncomingMailController,
	createIncomingMailController,
	updateIncomingMailController,
	deleteIncomingMailController,
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
router.patch(
	"/updateincomingmail/:id",
	verifyToken,
	upload.single("file"),
	updateIncomingMailController
);
router.delete(
	"/deleteincomingmail/:id",
	verifyToken,
	deleteIncomingMailController
);

router.get("/getoutgoingmail", verifyToken, getOutgoingMailController);
router.post("/createoutgoingmail", verifyToken, createOutgoingMailController);

module.exports = router;
