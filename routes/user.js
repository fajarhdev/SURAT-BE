const { createUserController, updateUserController, deleteUserController } = require("../src/controller/userController");
const verifyToken = require("../src/middleware/verifytoken");
const express = require("express");
const {getUserService} = require("../src/service/user");
const router = express.Router();

router.post("/create", verifyToken, createUserController);
router.patch("/update/:id", verifyToken, updateUserController);
router.delete("/delete/:id", verifyToken, deleteUserController);
router.get("/get", verifyToken, getUserService)

module.exports = router;