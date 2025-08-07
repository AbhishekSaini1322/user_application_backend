const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.DATA_BASE_URL;

const connectWithDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection issue");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectWithDB;
