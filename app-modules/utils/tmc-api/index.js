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
  return apiV8Client
    .get(`/courses/${courseId}`, { params: { access_token: accessToken } })
    .then(response => response.data);
}

function getUsersSubmissionsForCourse({ accessToken, courseId }, { cache = true } = {}) {
  return apiV8Client
    .get(`/courses/${courseId}/exercises/submissions/user`, { params: { access_token: accessToken } })
    .then(response => response.data.submissions || []);
}

function getUsersExercisePointsForCourse({ accessToken, courseId }, { cache = true } = {}) {
  return apiV8Client
    .get(`/courses/${courseId}/points/user`, { params: { access_token: accessToken } })
    .then(response => response.data);
}

function getExercisesForCourse({ accessToken, courseId }, { cache = true } = {}) {
  return apiV8Client
    .get(`/courses/${courseId}/exercises`, { params: { access_token: accessToken } })
    .then(response => response.data);
}

module.exports = { getCourse, getUsersSubmissionsForCourse, getUsersExercisePointsForCourse, getExercisesForCourse, getProfile };
