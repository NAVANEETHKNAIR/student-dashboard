const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: { type: String },
  value: { type: Number }
});

require('./methods')(schema);

module.exports = mongoose.model('ParticipantCounter', schema);
