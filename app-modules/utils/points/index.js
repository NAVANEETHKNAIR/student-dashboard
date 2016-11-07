const _ = require('lodash');
const moment = require('moment');

function differenceInDays(dateA, dateB) {
  return Math.round((+dateA - +dateB) / (1000 * 60 * 60 * 24));
}

/*
  Maximize amount of points
*/
function getExercisePoints({ exercises, points }) {
  const allPoints = exercises.reduce((pointsArray, exercise) => [...pointsArray, exercise.available_points], []);

  const meta = {
    bestPoints: allPoints.length,
    points: points.length
  };

  if(allPoints.length === 0) {
    return {
      value: 1,
      meta
    };
  }

  return {
    value: _.round(points.length / allPoints.length, 2),
    meta
  };
}

/*
  Minimize average distance of the submission creation date to the published date
*/
function getEarlinessPoints({ exercises, submissions }) {
  if(submissions.length === 0) {
    return {
      value: 0
    }
  }

  const exerciseIdToExercise = exercises
    .reduce((exerciseMap, exercise) => {
      exerciseMap[exercise.id.toString()] =  exercise;

      return exerciseMap;
    }, {});

  const submissionDifferenceToDeadline = submissions.reduce((sum, submission) => sum + differenceInDays(new Date(exerciseIdToExercise[submission.exerciseId].deadlineAt), new Date(submission.createdAt)), 0);
  const deadlineDays = exercies.reduce((sum, exercise) => differenceInDays(new Date(exercise.deadlineAt), new Date(exercise.publishedAt)), 0)

  return {
    value: _.round(submissionDifferenceToDeadline / deadlineDays, 2)
  }
}

/*
  Maximize number of submission dates
*/
function getSchedulingPoints({ exercises, submissions }) {
  if(submissions.length === 0) {
    return {
      value: 0
    }
  }

  const submissionDates = submissions.reduce((dateMap, submission) => {
    dateMap[moment(submission.createdAt).format('DD.MM.YYYY')] = true;

    return dateMap;
  }, {});

  const daysToFinnish = differenceInDays(new Date(exercises[0].deadlineAt), new Date(exercises[0].publishedAt));
  const optimalDayCount = Math.round(daysToFinnish * 0.6);

  return {
    value: _.round(Math.min(Object.keys(submissionDates), optimalDayCount) / optimalDayCount, 2)
  }
}

/*
  Minimize earliest submission creation date to published at
*/
function getStartingPoints({ exercises, submissions }) {
  if(submissions.length === 0) {
    return {
      value: 0
    }
  }

  const exerciseIdToExercise = exercises
    .reduce((exerciseMap, exercise) => {
      exerciseMap[exercise.id.toString()] =  Object.assign({}, exercise, {
        daysToFinnish: differenceInDays(new Date(exercise.deadlineAt), new Date(exercise.publishedAt))
      });

      return exerciseMap;
    }, {});

  const earliestSubmission = _.minBy(submissions, () => +new Date(submission.createdAt));
  const submissionExercise = exerciseIdToExercise[earliestSubmission.exerciseId];
  const submissionDelay = differenceInDays(new Date(earliestSubmission.createdAt), new Date(submissionExercise.publishedAt));

  return {
    meta: {
      earliestSubmission,
      submissionExercise,
      submissionDelay
    },
    value: 1 - _.round(submissionDelay / submissionExercise.daysToFinnish, 2)
  }
}

module.exports = { getExercisePoints, getEarlinessPoints, getSchedulingPoints, getStartingPoints };
