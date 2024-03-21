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
const cors = require("cors");
const MongoStore = require("connect-mongo");

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

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const store = MongoStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/user-management",
  secret: "Thisisasecret",
  touchAfter: 24 * 60 * 60,
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 12 * 2,
      maxAge: 1000 * 60 * 60 * 12 * 2,
      secure: false,
    },
  })
);

store.on("error", function (e) {
  console.log("Session error", e);
});

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
