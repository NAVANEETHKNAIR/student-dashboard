const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: { type: String },
  visualizations: { type: [String] }
});

module.exports = mongoose.model('CourseConfig', schema);
