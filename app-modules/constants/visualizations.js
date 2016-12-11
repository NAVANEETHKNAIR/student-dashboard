const mirror = require('keymirror');

const types = mirror({
  RADAR_VISUALIZATION: null,
  RADAR_VISUALIZATION_WITH_GRADE: null,
  TEXTUAL_VISUALIZATION: null,
  TEXTUAL_VISUALIZATION_WITH_GRADE: null,
  NO_VISUALIZATION: null
});

const gradeEstimateTypes = [
  types.RADAR_VISUALIZATION_WITH_GRADE,
  types.TEXTUAL_VISUALIZATION_WITH_GRADE
];

module.exports = Object.assign({}, types, { gradeEstimateTypes });
