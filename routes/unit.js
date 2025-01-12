const verifyToken = require("../src/middleware/verifytoken");
const {createUnitController, modifyUnitController, deleteUnitController} = require("../src/controller/unitController");
const express = require("express");
const { getUnitController } = require("../src/controller/sysController");
const router = express.Router();

router.post("/create", verifyToken, createUnitController);
router.patch("/update", verifyToken, modifyUnitController);
router.delete("/delete/:id", verifyToken, deleteUnitController);
router.get('/get', verifyToken, getUnitController);

module.exports = router;