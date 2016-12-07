const hl = require('highland');
const _ = require('lodash');

const GradeEntity = require('app-modules/models/grade-entity');
const Promise = require('bluebird');

function getGradeEstimate(points) {
  return new Promise((resolve, reject) => {
    let nearestNeighbours = [];
    let n = 2;

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
      .each(entity => {
        nearestNeighbours = _.chain([...nearestNeighbours, entity]).sortBy(['distance']).take(n).value();
      })
      .toCallback(err => {
        if(err) {
          reject(err);
        } else {
          resolve(Math.max(nearestNeighbours[0].grade, nearestNeighbours[1].grade));
        }
      });
  });
}

module.exports = {
  getGradeEstimate
};
