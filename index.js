const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

app.use((err, req, res, next) => {
  const { message = "Something went worng", code = 400 } = err;
  res.status(code).send(message);
});
