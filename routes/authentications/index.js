const express = require("express");
const router = express.Router();
const controllerFunc = require("../../controller/controller");
const passport = require("passport");
const middleware = require("../../middleware/middleware");

router.post("/signup", controllerFunc.registerUser);

router.post(
  "/login",
  passport.authenticate("local"),
  controllerFunc.authenticateUser
);

router.get("/logout", controllerFunc.logout);

router.post(
  "/add_user",
  middleware.userIsLoggedIn,
  controllerFunc.addUserDetails
);

router.get(
  "/get_user",
  middleware.userIsLoggedIn,
  controllerFunc.getUserDetails
);

router.patch(
  "/update_user",
  middleware.userIsLoggedIn,
  controllerFunc.updateUserDetails
);

router.delete(
  "/delete_user",
  middleware.userIsLoggedIn,
  controllerFunc.deleteUserDetails
);

module.exports = router;
