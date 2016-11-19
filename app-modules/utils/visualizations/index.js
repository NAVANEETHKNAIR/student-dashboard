const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');

const tmcApi = require('app-modules/utils/tmc-api');
const points = require('app-modules/utils/visualizations/points');
const gradeEstimator = require('app-modules/utils/grade-estimator');

function formatExercise(exercise) {
  return Object.assign({}, exercise, {
    published: exercise.deadline ? moment.utc(exercise.deadline).subtract(7, 'days').toISOString() : null
  });
}

function getExerciseIdToPoints(points) {
  return points.reduce((pointsMap, point) => {
    const exerciseId = point.exercise_id.toString();

    pointsMap[exerciseId] = pointsMap[exerciseId] || [];
    pointsMap[exerciseId] = [...pointsMap[exerciseId], point];

    return pointsMap;
  }, {});
}

function getExerciseNameToId(exercises) {
  return exercises.reduce((exercisesMap, exercise) => {
    exercisesMap[exercise.name || '_'] = exercise.id;

    return exercisesMap;
  }, {});
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
  const groupedExercises = _.groupBy(exercises || [], value => groupByDateInterval({ dateGroups, value, getDate: v => new Date(v.deadline) }));

  const exerciseIdToGroup = exercises.reduce((mapper, exercise) => {
    mapper[exercise.id.toString()] = groupByDateInterval({ dateGroups, value: exercise, getDate: e => new Date(e.deadline) });

    return mapper;
  }, {});

  return {
    groupedExercises: _.groupBy(exercises || [], value => groupByDateInterval({ dateGroups, value, getDate: v => new Date(v.deadline) })),
    groupedSubmissions: _.groupBy(submissions || [], value => {
      return !value.exercise_id || !exerciseIdToGroup[value.exercise_id.toString()]
        ? '_'
        : exerciseIdToGroup[value.exercise_id.toString()];
    })
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

function getUsersProgressData({ userId, courseId, accessToken, query }) {
  const { exerciseGroups } = query;

  const getExercisesForCourse = tmcApi.getExercisesForCourse({ courseId, accessToken })
    .then(exercises => exercises.filter(exercise => !!exercise.deadline));

  const getUsersExercisePointsForCourse = tmcApi.getUsersExercisePointsForCourse({ courseId, userId, accessToken });
  const getUsersSubmissionsForCourse = tmcApi.getUsersSubmissionsForCourse({ courseId, userId, accessToken });

  let exerciseIdToPoints;

  return Promise.all([getExercisesForCourse, getUsersSubmissionsForCourse, getUsersExercisePointsForCourse])
    .spread((exercises, submissions, points) => {
      exercises = exercises.map(formatExercise);

      const exerciseNameToId = getExerciseNameToId(exercises);

      submissions = submissions.map(submission => Object.assign({}, submission, { exercise_id: exerciseNameToId[submission.exercise_name] || null }));

      exerciseIdToPoints = getExerciseIdToPoints(points);

      return groupExercisesAndSubmissions({ exercises, submissions, dateGroups: exerciseGroups });
    })
    .then(({ groupedExercises, groupedSubmissions }) => {
      return mergeGroupedExercisesAndSubmissions({ groupedExercises, groupedSubmissions });
    })
    .then(groups => {
      return _.omit(groups, ['_']);
    })
    .then(groups => {
      return _.mapValues(groups, ({ submissions, exercises }) => getPoints({ submissions, exercises, exerciseIdToPoints }));
    })
    .then(groups => {
      return {
        groups,
        average: getPointAverages(groups)
      };
    });
}

function getUsersEstimatedGrade(progressData) {
  return gradeEstimator.getGradeEstimate(progressData);
}

module.exports = {
  getUsersProgressData,
  getUsersEstimatedGrade
}
