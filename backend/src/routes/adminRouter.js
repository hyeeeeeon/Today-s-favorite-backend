const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login/:user_id", adminController.login);

module.exports = router;