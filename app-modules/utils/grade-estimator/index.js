const hl = require('highland');

const GradeEntity = require('app-modules/models/grade-entity');
const Promise = require('bluebird');

function getGradeEstimate(points) {
  return new Promise((resolve, reject) => {
    hl(GradeEntity.find().cursor())
      .map(entity => {
        const { exercises, earliness, starting, scheduling, grade } = entity;
        const sqrt = value => Math.sqrt(value);
        const pow2 = value => Math.pow(value, 2);

        const sum = pow2(points.exercises - exercises) + pow2(points.earliness - earliness) + pow2(points.starting - starting) + pow2(points.scheduling - scheduling);

        return {
          grade,
          distance: sqrt(sum)
        };
      })
      .sortBy((a, b) => a.distance - b.distance)
      .take(1)
      .toCallback((err, entity) => {
        if(err) {
          reject(err);
        } else {
          resolve(entity.grade);
        }
      });
  });
}

module.exports = {
  getGradeEstimate
};
