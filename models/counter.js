const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  seq: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', CounterSchema);

async function getNextTxId(ID) {
  try {
    const result = await Counter.findOneAndUpdate(
      { ID },
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return result.seq;
  } catch (error) {
    console.error('Error in getting next transaction ID:', error);
    throw error;
  }
}

module.exports = getNextTxId;
