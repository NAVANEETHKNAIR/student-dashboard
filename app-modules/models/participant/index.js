const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  courseId: { type: String, required: true },
  userId: { type: String, required: true },
  group: { type: String, required: true }
});

require('./methods')(schema);

module.exports = mongoose.model('Participant', schema);
