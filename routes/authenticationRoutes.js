const express = require("express");
const router = express.Router();

const {
  register,
  login,
  checkEmail,
} = require("../controllers/authenticationController");

//-------------------Registration-------------------------

router.post("/check-user", checkEmail);
router.post("/register", register);

//---------------------Login--------------------------

router.post("/login", login);

module.exports = router;
