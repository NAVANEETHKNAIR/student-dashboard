const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  source: { type: String, required: true },
  userId: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed },
  createdAtAdjustedToTz: { type: Number, required: true },
  hour: { type: Number, required: true },
  weekday: { type: Number, required: true },
  createdAt: { type: Date, required: true }
});

module.exports = mongoose.model('Action', schema);
