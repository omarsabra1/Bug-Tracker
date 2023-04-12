require("dotenv").config();
const mongoose = require("mongoose");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
const UserRoute = require("./routes/userRout");
const projectRoute = require("./routes/projectsRout");
const issueRoute = require("./routes/isssueRoute");
app.use("/user", UserRoute);
app.use(projectRoute);
app.use(issueRoute);
//error middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data, status: false });
});
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port);
    console.log("connected");
  })
  .catch((err) => console.log(err));
