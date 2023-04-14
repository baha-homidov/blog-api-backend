const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/authController");

/* POST login */
router.post("/login", auth_controller.login_post);

/* POST register */
router.post("/register", auth_controller.register_post);

/* GET user */
router.get("/getuser", auth_controller.user_get);

/* POST logout */
router.post("/logout", auth_controller.logout_post);

module.exports = router;
