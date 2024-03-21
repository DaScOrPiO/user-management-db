const User = require("../models/users");
const Details = require("../models/details");

// Authentication
module.exports.registerUser = async (req, res, next) => {
  try {
    const item = req.body;
    const user = new User({
      firstname: item.firstname,
      lastname: item.lastname,
      username: item.username,
      email: item.email,
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
      req.session.destroy();
      res.status(200).send("successful");
    });
  } catch (err) {
    next(err);
  }
};
// End of authentication

module.exports.addUserDetails = async (req, res, next) => {
  try {
    const { firstname, lastname, email, dob } = req.body;
    if (req.user) {
      const newDetails = new Details({
        firstname,
        lastname,
        email,
        dob,
        owner: req.user._id,
      });
      await newDetails.save();
      res.status(200).send("sucessful");
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getUserDetails = async (req, res, next) => {
  try {
    if (req.user) {
      const items = await Details.find({ owner: req.user._id });
      res.status(200).json(items);
    } else {
      req.status(404).send("user not found");
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserDetails = async (req, res, next) => {
  try {
    if (req.user) {
      const { firstname, lastname, email, dob } = req.body;

      const updatedDetails = await Details.findOneAndUpdate(
        { owner: req.user._id, email },
        { firstname, lastname, email, dob },
        { new: true }
      );

      if (!updatedDetails) {
        return res.status(404).send("User details not found");
      }

      res.status(200).send("Action successful");
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUserDetails = async (req, res, next) => {
  if (req.user) {
    const { email } = req.body;
    const details = await Details.deleteMany({ owner: req.user._id, email });

    if (!details) {
      return res.status(404).send("details not found");
    }
    res.status(200).send("Action sucessful");
  } else {
    res.status(404).send("user not found");
  }
};
