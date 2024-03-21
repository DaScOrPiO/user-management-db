const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocal = require("passport-local");
const multer = require("multer");
const session = require("express-session");
const authRoute = require("./routes/authentications/index");
const User = require("./models/users");

const path = process.env.PORT || 3000;
app.listen(path, () => {
  console.log("server Started at port:3000");
});

async function main() {
  try {
    const url = "mongodb://127.0.0.1:27017/user-management";
    await mongoose.connect(url);
    console.log("Mongoose connection successful");
  } catch (err) {
    console.log("something went wrong", err);
  }
}
main();
mongoose.connection.on("error", (err) =>
  console.log("Error! Something went wrong", err)
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 12 * 2,
      maxAge: 1000 * 60 * 60 * 24 * 2,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", authRoute);

app.use((err, req, res, next) => {
  const { message = "Something went worng", code = 400 } = err;
  res.status(code).send(message);
});
