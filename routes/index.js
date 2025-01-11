const express = require("express");
const { loginController } = require("../src/controller/loginController");
const RefreshTokenController = require("../src/controller/refreshtokenController");
const verifyToken = require("../src/middleware/verifytoken");
const router = express.Router();

/* GET home page. */
router.post("/login", loginController);
router.post("/refreshtoken", RefreshTokenController);

module.exports = router;
