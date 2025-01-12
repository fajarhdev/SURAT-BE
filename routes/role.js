const verifyToken = require("../src/middleware/verifytoken");
const express = require("express");
const {createRoleController, modifyRoleController, deleteRoleController, getRoleController} = require("../src/controller/roleController");
const router = express.Router();

router.post("/create", verifyToken, createRoleController);
router.patch("/update", verifyToken, modifyRoleController);
router.delete("/delete/:id", verifyToken, deleteRoleController);
router.get('/get', verifyToken, getRoleController);

module.exports = router;