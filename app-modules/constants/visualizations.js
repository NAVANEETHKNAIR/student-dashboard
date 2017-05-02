const mirror = require('keymirror');

const types = mirror({
  RADAR_VISUALIZATION: null,
  RADAR_VISUALIZATION_PLAIN: null,
  TEXTUAL_VISUALIZATION: null,
  NO_VISUALIZATION: null
});

const gradeEstimateTypes = [];

module.exports = Object.assign({}, types, { gradeEstimateTypes });
