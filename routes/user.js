const { createUserController, updateUserController, deleteUserController, getUserController} = require("../src/controller/userController");
const verifyToken = require("../src/middleware/verifytoken");
const express = require("express");
const router = express.Router();

router.post("/create", verifyToken, createUserController);
router.patch("/update/:id", verifyToken, updateUserController);
router.delete("/delete/:id", verifyToken, deleteUserController);
router.get("/get", verifyToken, getUserController)

module.exports = router;