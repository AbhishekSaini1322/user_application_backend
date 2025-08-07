const mongoose = require("mongoose");
const getNextTxId = require("./counter");

const userSchema = new mongoose.Schema({
  uid: {
    type: Number,
    unique: true,
  },
  username:{
    type:"String",
    unique:true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.uid = await getNextTxId("uid");
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
