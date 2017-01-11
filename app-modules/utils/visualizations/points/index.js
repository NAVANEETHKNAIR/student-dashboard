const _ = require('lodash');
const moment = require('moment');

function differenceInDays(dateA, dateB) {
  return Math.abs(Math.round((+dateA - +dateB) / (1000 * 60 * 60 * 24)));
}

function dateIsBefore(dateA, dateB) {
  return +dateA < +dateB;
}

function exerciseIdExists(exerciseIdToExercise) {
  return value => value.exercise_id && !!exerciseIdToExercise[value.exercise_id.toString()];
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
  const emptyPoints = {
    value: 0,
    meta: {
      averageDays: null,
      bestAverageDays: null,
      noData: true
    }
  };

  if(submissions.length === 0 || exercises.length === 0) {
    return emptyPoints;
  }

  const exerciseIdToExercise = exercises
    .reduce((exerciseMap, exercise) => {
      exerciseMap[exercise.id.toString()] =  exercise;

      return exerciseMap;
    }, {});

  const uniqueSubmissions = _.chain(submissions)
    .filter(exerciseIdExists(exerciseIdToExercise))
    .groupBy(submission => submission.exercise_id.toString())
    .mapValues(submissions => _.minBy(submissions, submission => +(new Date(submission.created_at))))
    .values()
    .value();

  if(uniqueSubmissions.length === 0) {
    return emptyPoints;
  }

  const exerciseIdToIsSubmitted = uniqueSubmissions
    .reduce((exerciseMap, submission) => {
      exerciseMap[submission.exercise_id.toString()] = true;

      return exerciseMap;
    }, {});

  const averageSubmissionDifferenceToDeadline = uniqueSubmissions.reduce((sum, submission) => {
    return sum + differenceInDays(new Date(exerciseIdToExercise[submission.exercise_id.toString()].deadline), new Date(submission.created_at))
  }, 0) / uniqueSubmissions.length;

  const deadlineDays = differenceInDays(new Date(exercises[0].deadline), new Date(exercises[0].published));

  return {
    value: _.round(Math.min(averageSubmissionDifferenceToDeadline / (deadlineDays * 0.6), 1), 2),
    meta: {
      averageDays: _.round(averageSubmissionDifferenceToDeadline, 1),
      bestAverageDays: _.round(deadlineDays * 0.6, 1)
    }
  }
}

/*
  Maximize number of submission dates
*/
function getSchedulingPoints({ exercises, submissions }) {
  if(submissions.length === 0 || exercises.length === 0) {
    return {
      value: 0,
      meta: {
        workingDays: null,
        bestWorkingDays: null,
        noData: true
      }
    }
  }

  const submissionDates = submissions.reduce((dateMap, submission) => {
    dateMap[moment(submission.created_at).format('DD.MM.YYYY')] = true;

    return dateMap;
  }, {});

  const daysToFinnish = differenceInDays(new Date(exercises[0].deadline), new Date(exercises[0].published));
  const optimalDayCount = Math.round(daysToFinnish * 0.4);
  const submissionDatesCount = _.keys(submissionDates).length;

  return {
    value: _.round(Math.min(submissionDatesCount, optimalDayCount) / optimalDayCount, 2),
    meta: {
      workingDays: submissionDatesCount,
      bestWorkingDays: optimalDayCount
    }
  }
}

/*
  Minimize earliest submission creation date to published at
*/
function getStartingPoints({ exercises, submissions }) {
  const emptyPoints = {
    value: 0,
    meta: {
      startingDate: null,
      bestStartingDate: null,
      noData: true
    }
  };

  if(submissions.length === 0 || exercises.length === 0) {
    return emptyPoints;
  }

  const exerciseIdToExercise = exercises
    .reduce((exerciseMap, exercise) => {
      exerciseMap[exercise.id.toString()] =  Object.assign({}, exercise, {
        daysToFinnish: differenceInDays(new Date(exercise.deadline), new Date(exercise.published))
      });

      return exerciseMap;
    }, {});

  const earliestSubmission = _.chain(submissions)
    .filter(exerciseIdExists(exerciseIdToExercise))
    .minBy(submission => +new Date(submission.created_at))
    .value();

  if(!earliestSubmission) {
    return emptyPoints;
  }

  const submissionExercise = exerciseIdToExercise[earliestSubmission.exercise_id.toString()];

  const submissionDelay = differenceInDays(new Date(earliestSubmission.created_at), new Date(submissionExercise.published));

  return {
    value: dateIsBefore(new Date(earliestSubmission.created_at), new Date(submissionExercise.published))
      ? 1
      : Math.min(1, _.round(1 - submissionDelay / submissionExercise.daysToFinnish, 2)),
    meta: {
      startingDate: new Date(earliestSubmission.created_at),
      bestStartingDate: new Date(submissionExercise.published)
    }
  }
}

module.exports = {
  getExercisePoints,
  getEarlinessPoints,
  getSchedulingPoints,
  getStartingPoints
};
