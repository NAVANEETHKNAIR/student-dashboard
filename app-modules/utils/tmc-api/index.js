const Promise = require('bluebird');
const axios = require('axios');

const { withCacheGetAndSet } = require('app-modules/utils/cache');

const apiV8Client = axios.create({
  baseURL: `${process.env.TMC_API_ALPHA_URL}/api/v8`
});

const apiBetaClient = axios.create({
  baseURL: `${process.env.TMC_API_URL}/api/beta`
});

function getProfile(accessToken, { cache = true } = {}) {
  return apiBetaClient
    .get('/participant', { params: { access_token: accessToken } })
    .then(response => response.data);
}

function getCourse({ accessToken, courseId }, { cache = true } = {}) {
  const getCourseRequest = () => {
    return apiV8Client
      .get(`/courses/${courseId}`, { params: { access_token: accessToken } })
      .then(response => response.data);
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
  const getPointsRequest = () => {
    return apiV8Client
      .get(`/courses/${courseId}/exercises`, { params: { access_token: accessToken } })
      .then(response => response.data);
  };

  if(cache) {
    return withCacheGetAndSet(getPointsRequest, { key: `points-${courseId}`, ttl: '2h' });
  } else {
    return getPointsRequest();
  }
}

module.exports = { getCourse, getUsersSubmissionsForCourse, getUsersExercisePointsForCourse, getExercisesForCourse, getProfile };
