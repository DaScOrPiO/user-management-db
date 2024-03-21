module.exports.userIsLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("unauthorised")
  }
};
