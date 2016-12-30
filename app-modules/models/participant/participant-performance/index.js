const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  starting: { type: Number, required: true },
  earliness: { type: Number, required: true },
  exercises: { type: Number, required: true },
  scheduling: { type: Number, required: true }
});

require('./methods')(schema);

module.exports = mongoose.model('ParticipantPerformance', schema);
