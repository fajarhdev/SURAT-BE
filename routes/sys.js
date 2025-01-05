const express = require("express");
const verifyToken = require("../src/middleware/verifytoken");
const {
	getTopicController,
	getUnitController,
	getExecutiveController,
	getNomorCadanganController,
} = require("../src/controller/sysController");
const router = express.Router();

/* GET home page. */
router.get("/getunit", verifyToken, getUnitController);
router.get("/gettopic", verifyToken, getTopicController);
router.get("/getexecutive", verifyToken, getExecutiveController);
router.get("/getnumsub", verifyToken, getNomorCadanganController);

module.exports = router;
