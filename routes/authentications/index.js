const express = require("express");
const router = express.Router();
const controllerFunc = require("../../controller/controller");
const passport = require("passport");

router.post("/signup", controllerFunc.registerUser);

router.post(
  "/login",
  passport.authenticate("local"),
  controllerFunc.authenticateUser
);

router.get("/logout", controllerFunc.logout);

module.exports = router;
