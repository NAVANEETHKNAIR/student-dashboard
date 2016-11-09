const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');

const tmcApi = require('app-modules/utils/tmc-api');
const points = require('app-modules/utils/visualizations/points');

function formatExercise(exercise) {
  return Object.assign({}, exercise, {
    published: exercise.deadline ? moment.utc(exercise.deadline).subtract(7, 'days').toISOString() : null
  });
}

function groupByDateInterval({ dateGroups, value, getDate }) {
  const timestamp = +getDate(value);
  const groupNames = Object.keys(dateGroups);

  let groupName = '_';

  groupNames.forEach(name => {
    const [start, end] = dateGroups[name];

    if(timestamp >= start * 1000 && timestamp <= end * 1000) {
      groupName = name;

      return;
    }
  });

  return groupName;
}

function groupExercisesAndSubmissions({ exercises, submissions, dateGroups }) {
  return {
    groupedExercises: _.groupBy(exercises || [], value => groupByDateInterval({ dateGroups, value, getDate: v => new Date(v.deadline) })),
    groupedSubmissions: _.groupBy(submissions || [], value => groupByDateInterval({ dateGroups, value, getDate: v => new Date(v.created_at) }))
  }
}

function mergeGroupedExercisesAndSubmissions({ groupedExercises, groupedSubmissions }) {
  return Object.keys(groupedExercises).reduce((merged, key) => {
    merged[key] = {
      submissions: groupedSubmissions[key] || [],
      exercises: groupedExercises[key] || []
    };

    return merged;
  }, {});
}

function getPoints({ submissions, exercises, exerciseIdToPoints }) {
  const exercisePoints = exercises.reduce((pointsArray, exercise) => [...pointsArray, ...(exerciseIdToPoints[exercise.id] || [])], []);

  return {
    earliness: points.getEarlinessPoints({ submissions, exercises }),
    exercises: points.getExercisePoints({ exercises, points: exercisePoints }),
    scheduling: points.getSchedulingPoints({ submissions, exercises }),
    starting: points.getStartingPoints({ submissions, exercises })
  }
}

function getPointAverages(groups) {
  const numberOfGroups = Object.keys(groups).length;

  const groupSums = _.values(groups).reduce((sums, group) => {
    Object.keys(group).forEach(key => {
      sums[key] = sums[key] || 0;
      sums[key] = sums[key] + group[key].value;
    });

    return sums;
  }, {});

  return _.mapValues(groupSums, sum => _.round(sum / numberOfGroups, 1));
}

function getUsersProgressData({ userId, courseId, accessToken, query }, { cache = true } = {}) {
  const { exerciseGroups } = query;

  const apiOptions = { cache };

  const getExercisesForCourse = tmcApi.getExercisesForCourse({ courseId, accessToken }, apiOptions)
    .then(exercises => exercises.filter(exercise => !!exercise.deadline));

  const getUsersExercisePointsForCourse = tmcApi.getUsersExercisePointsForCourse({ courseId, accessToken }, apiOptions);
  const getUsersSubmissionsForCourse = tmcApi.getUsersSubmissionsForCourse({ courseId, accessToken }, apiOptions);

  let exerciseIdToPoints = {};

  Promise.all([getExercisesForCourse, getUsersSubmissionsForCourse, getUsersExercisePointsForCourse])
    .spread((exercises, submissions, points) => {
      exercises = exercises.map(formatExercise);

      exerciseIdToPoints = points.reduce((pointsMap, point) => {
        pointsMap[point.exercise_id.toString()] = point;

        return pointsMap;
      }, {});

      return groupExercisesAndSubmissions({ exercises, submissions, dateGroups: exerciseGroups });
    })
    .then(({ groupedExercises, groupedSubmissions }) => {
      return mergeGroupedExercisesAndSubmissions({ groupedExercises, groupedSubmissions });
    })
    .then(groups => {
      return _.mapValues(groups, ({ submissions, exercises }) => getPoints({ submissions, exercises, exerciseIdToPoints }));
    })

  const groups = _.mapValues(exerciseGroups, () => {
    return {
      earliness: {
        value: _.random(0, 10) / 10,
        meta: {
          averageDays: _.random(1, 7),
          bestAverageDays: 3
        }
      },
      exercises: {
        value: _.random(0, 10) / 10,
        meta: {
          points: _.random(0, 10),
          bestPoints: 10
        }
      },
      scheduling: {
        value: _.random(0, 10) / 10,
        meta: {
          workingDays: _.random(1, 7),
          bestWorkingDays: 4
        }
      },
      starting: {
        value: _.random(0, 10) / 10,
        meta: {
          startingDate: Math.floor(+(new Date()) / 1000),
          bestStartingDate: Math.floor(+(new Date()) / 1000)
        }
      }
    }
  });

  return Promise.resolve({
    groups,
    average: getPointAverages(groups)
  });
}

function getUsersEstimatedGrade(progressData) {
  const values = _.values(progressData)

  const optimalValueSum = values.length * 0.9;
  const valueSum = Math.min(optimalValueSum, values.reduce((sum, value) => sum + value));

  return optimalValueSum === 0
    ? 0
    : Math.round(valueSum / optimalValueSum * 5);
}

module.exports = { getUsersProgressData, getUsersEstimatedGrade }
