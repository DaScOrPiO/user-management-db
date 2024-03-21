const User = require("../models/users");
const passport = require("passport");

module.exports.registerUser = async (req, res, next) => {
  try {
    const item = req.body;
    const user = new User({
      firstname: item.firstname,
      lastname: item.lastname,
      username: item.username,
      email: item.email,
      phone: item.phone,
    });
    await User.register(user, item.password);
    res.status(200).send("Successful");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.authenticateUser = async (req, res, next) => {
  try {
    res.status(200).send("successful");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).send("successful");
    });
  } catch (err) {
    next(err);
  }
};
