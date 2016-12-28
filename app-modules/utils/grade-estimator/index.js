const Promise = require('bluebird');
const _ = require('lodash');

function getGradeEstimate(points) {
  if(points.exercises < 0.5) {
  	return Promise.resolve(0);
  }

  const weightedExercisePoints = points.exercises * 1.5;
  const restPoints = _.chain(points).omit(['exercises']).values().mean().value();
	const totalPoints = weightedExercisePoints + restPoints;

  const worstPoints = 0.5 * 1.5 + 0.4;
  const bestPoints = 0.9 * 1.5 + 0.9;

  if(totalPoints < worstPoints) {
  	return Promise.resolve(0);
  }

  if(totalPoints > bestPoints) {
  	return Promise.resolve(5);
  }

  const gradeEstimate = Math.round((totalPoints - worstPoints) / (bestPoints - worstPoints) * 5);

  return Promise.resolve(gradeEstimate);
}

module.exports = {
  getGradeEstimate
};
