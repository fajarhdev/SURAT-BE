const { createUserController, updateUserController, deleteUserController } = require("../src/controller/userController");
const verifyToken = require("../src/middleware/verifytoken");
const router = express.Router();

router.get("/create", verifyToken, createUserController);
router.get("/update", verifyToken, updateUserController);
router.get("/delete/:id", verifyToken, deleteUserController);

module.exports = router;