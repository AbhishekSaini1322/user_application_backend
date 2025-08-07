const mongoose = require("mongoose");
const getNextTxId = require("./counter");

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    uid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

itemSchema.pre("save", async function (next) {
    if (this.isNew) {
      this.itemId = await getNextTxId("itemId");
    }
    next();
  });

module.exports = mongoose.model("Item", itemSchema);
