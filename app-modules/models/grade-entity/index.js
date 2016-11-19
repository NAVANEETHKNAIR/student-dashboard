const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  courseId: { type: String, required: true },
  userId: { type: String, required: true },
  grade: { type: Number, required: true },
  earliness: { type: Number, required: true },
  exercises: { type: Number, required: true },
  starting: { type: Number, required: true },
  scheduling: { type: Number, required: true }
});

module.exports = mongoose.model('GradeEntity', schema);
