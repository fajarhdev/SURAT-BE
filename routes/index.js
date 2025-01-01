const express = require("express");
const { loginController } = require("../src/controller/login");
const router = express.Router();

/* GET home page. */
router.get("/login", loginController);

module.exports = router;
