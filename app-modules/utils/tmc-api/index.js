const Promise = require('bluebird');
const request = require('request-promise');

const { withCacheGetAndSet } = require('app-modules/utils/cache');

function getProfile(accessToken, { cache = true } = {}) {
  const options = {
    method: 'GET',
    uri: `${process.env.TMC_AUTH_URL}/api/beta/participant?access_token=${accessToken}`
  };

  const getProfileRequest = () => {
    return request(options)
      .then(response => JSON.parse(response));
  };

  return getProfileRequest();
}

function getCourse({ accessToken, courseId }, { cache = true } = {}) {
  const options = {
    method: 'GET',
    uri: `${process.env.TMC_URL}/api/v8/courses/${courseId}?access_token=${accessToken}`
  };

  const getCourseRequest = () => {
    return request(options)
      .then(response => JSON.parse(response));
  };

  if(cache) {
    return withCacheGetAndSet(getCourseRequest, { key: `course-${courseId}`, ttl: '2h' })
  } else {
    return getCourseRequest();
  }
}

function getUsersSubmissionsForCourse({ accessToken, courseId }, { cache = true } = {}) {
  return Promise.resolve([]);
}

function getUsersExercisePointsForCourse({ accessToken, courseId }, { cache = true } = {}) {
  return Promise.resolve([]);
}

function getExercisesForCourse({ accessToken, courseId }, { cache = true } = {}) {
  const options = {
    method: 'GET',
    uri: `${process.env.TMC_URL}/api/v8/courses/${courseId}/exercises?access_token=${accessToken}`
  };

  const getPointsRequest = () => {
    return request(options)
      .then(response => JSON.parse(response));
  };

  if(cache) {
    return withCacheGetAndSet(getPointsRequest, { key: `points-${courseId}`, ttl: '2h' });
  } else {
    return getPointsRequest();
  }
}

module.exports = { getCourse, getUsersSubmissionsForCourse, getUsersExercisePointsForCourse, getExercisesForCourse, getProfile };
