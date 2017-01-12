const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');

const ParticipantPerformance = require('app-modules/models/participant/participant-performance');
const tmcApi = require('app-modules/utils/tmc-api');
const points = require('app-modules/utils/visualizations/points');
const gradeEstimator = require('app-modules/utils/grade-estimator');

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

function groupByDateInterval({ dateGroups, date }) {
  const timestamp = +date;
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

function groupByPrefix({ dateGroups, string }) {
  const groupNames = Object.keys(dateGroups);

  let groupName = '_';

  groupNames.forEach(name => {
    const [,,prefix] = dateGroups[name];
    const regexp = new RegExp(`^${prefix}`);

    if(regexp.test(string)) {
      groupName = name;

      return;
    }
  });

  return groupName;
}

function groupExercise({ exercise, dateGroups }) {
  const groupConfig = _.values(dateGroups) || [];

  if(groupConfig[2]) {
    return groupByPrefix({ dateGroups, string: exercise.name });
  } else {
    return groupByDateInterval({ dateGroups, date: new Date(exercise.deadline) });
  }
}

function groupExercisesAndSubmissions({ exercises, submissions, dateGroups }) {
  const groupedExercises = _.chain(exercises || [])
    .groupBy(exercise => groupExercise({ exercise, dateGroups }))
    .mapValues((exercises, groupName) => {
      return (exercises || []).map(exercise => {
        const [start] = (dateGroups[groupName] || []);

        return Object.assign(
          {},
          exercise,
          { exerciseGroup: groupName, published: start ? moment.utc(start * 1000).toISOString() : null }
        );
      });
    })
    .value();

  const exerciseIdToGroup = _.zipObject(
    exercises.map(exercise => exercise.id.toString()),
    exercises.map(exercise => groupExercise({ exercise, dateGroups }))
  );

  return {
    groupedExercises,
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

  return _.mapValues(groupSums, sum => _.round(sum / numberOfGroups, 2));
}

function updateParticipantPerformance({ userId, courseId, average }) {
  const participantPerformanceAttributes = Object.assign(
    {},
    average,
    { userId, courseId }
  );

  ParticipantPerformance.updateParticipantsPerformance(participantPerformanceAttributes);
}

function getUsersProgressData({ userId, courseId, accessToken, query }) {
  const { exerciseGroups } = query;

  const getExercisesForCourse = tmcApi.getExercisesForCourse({ courseId, accessToken })
    .then(exercises => exercises.filter(exercise => !!exercise.deadline));

  const getUsersExercisePointsForCourse = tmcApi.getUsersExercisePointsForCourse({ courseId, userId, accessToken });
  const getUsersSubmissionsForCourse = tmcApi.getUsersSubmissionsForCourse({ courseId, userId, accessToken });

  let exerciseIdToPoints;
  let courseAveragePerformance;

  const promises = [
    getExercisesForCourse,
    getUsersSubmissionsForCourse,
    getUsersExercisePointsForCourse,
    ParticipantPerformance.getCourseAveragePerformance(courseId)
  ];

  return Promise.all(promises)
    .spread((exercises, submissions, points, coursePerformance) => {
      courseAveragePerformance = coursePerformance;

      const exerciseNameToId = getExerciseNameToId(exercises);

      submissions = submissions.map(submission => Object.assign({}, submission, { exercise_id: exerciseNameToId[submission.exercise_name] || null }));

      exerciseIdToPoints = getExerciseIdToPoints(points);

      return groupExercisesAndSubmissions({ exercises, submissions, dateGroups: exerciseGroups });
    })
    .then(({ groupedExercises, groupedSubmissions }) => {
      return mergeGroupedExercisesAndSubmissions({ groupedExercises, groupedSubmissions });
    })
    .then(groups => {
      return _.mapValues(exerciseGroups, (value, groupName) => {
        const { submissions, exercises } = groups[groupName] || {};

        return getPoints({ submissions: submissions || [], exercises: exercises || [], exerciseIdToPoints: exerciseIdToPoints || {} })
      });
    })
    .then(groups => {
      const participantAverage = getPointAverages(groups);

      updateParticipantPerformance({ userId, courseId, average: participantAverage });

      return {
        groups,
        average: participantAverage,
        courseAverage: courseAveragePerformance
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
