const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const indexRouter = require("./routes/indexRoutes.js");





app.use("/",indexRouter);

module.exports = app;