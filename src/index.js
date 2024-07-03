const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = require('./app');
const connectDb = require('./utils//db.js');

port = process.env.PORT || 6000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to the database', err);
  });
