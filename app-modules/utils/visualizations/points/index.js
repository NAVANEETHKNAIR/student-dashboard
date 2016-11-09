const _ = require('lodash');
const moment = require('moment');

function differenceInDays(dateA, dateB) {
  return Math.round((+dateA - +dateB) / (1000 * 60 * 60 * 24));
}

/*
  Maximize amount of points
*/
function getExercisePoints({ exercises, points }) {
  const allPoints = _.flatMap(exercises || [], exercise => exercise.available_points);

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
      value: 0,
      meta: {
        averageDays: null,
        bestAverageDays: null
      }
    }
  }

  const exerciseIdToExercise = exercises
    .reduce((exerciseMap, exercise) => {
      exerciseMap[exercise.id.toString()] =  exercise;

      return exerciseMap;
    }, {});

  const lazyDays = 2;
  const submissionDifferenceToDeadline = submissions.reduce((sum, submission) => sum + differenceInDays(new Date(exerciseIdToExercise[submission.exercise_id].deadline_at), new Date(submission.created_at)), 0);
  const deadlineDays = exercies.reduce((sum, exercise) => sum + differenceInDays(new Date(exercise.deadline_at), moment.utc(exercise.published_at).add(lazyDays, 'days').toDate()), 0)

  return {
    value: _.round(Math.min(submissionDifferenceToDeadline / deadlineDays, 1), 2),
    meta: {
      averageDays: null,
      bestAverageDays: null
    }
  }
}

/*
  Maximize number of submission dates
*/
function getSchedulingPoints({ exercises, submissions }) {
  if(submissions.length === 0) {
    return {
      value: 0,
      meta: {
        workingDays: null,
        bestWorkingDays: null
      }
    }
  }

  const submissionDates = submissions.reduce((dateMap, submission) => {
    dateMap[moment(submission.createdAt).format('DD.MM.YYYY')] = true;

    return dateMap;
  }, {});

  const daysToFinnish = differenceInDays(new Date(exercises[0].deadline_at), new Date(exercises[0].published_at));
  const optimalDayCount = Math.round(daysToFinnish * 0.6);

  return {
    value: _.round(Math.min(Object.keys(submissionDates), optimalDayCount) / optimalDayCount, 2),
    meta: {
      workingDays: null,
      bestWorkingDays: null
    }
  }
}

/*
  Minimize earliest submission creation date to published at
*/
function getStartingPoints({ exercises, submissions }) {
  if(submissions.length === 0) {
    return {
      value: 0,
      meta: {
        startingDate: null,
        bestStartingDate: null
      }
    }
  }

  const exerciseIdToExercise = exercises
    .reduce((exerciseMap, exercise) => {
      exerciseMap[exercise.id.toString()] =  Object.assign({}, exercise, {
        daysToFinnish: differenceInDays(new Date(exercise.deadline_at), new Date(exercise.published_at))
      });

      return exerciseMap;
    }, {});

  const earliestSubmission = _.minBy(submissions, () => +new Date(submission.created_at));
  const submissionExercise = exerciseIdToExercise[earliestSubmission.exercise_id];

  const submissionDelay = differenceInDays(new Date(earliestSubmission.created_at), new Date(submissionExercise.published_at));
  const handicapSubmissionDelay = Math.max(submissionDelay - 1, 0);

  return {
    value: 1 - _.round(handicapSubmissionDelay / submissionExercise.daysToFinnish, 2),
    meta: {
      startingDate: null,
      bestStartingDate: null
    }
  }
}

module.exports = { getExercisePoints, getEarlinessPoints, getSchedulingPoints, getStartingPoints };
