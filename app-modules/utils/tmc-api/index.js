const Promise = require('bluebird');
const request = require('request-promise');

const cache = require('app-modules/utils/cache');

function getProfile(accessToken, { cache = true } = {}) {
  const options = {
    method: 'GET',
    uri: `${process.env.TMC_URL}/api/beta/participant?access_token=${accessToken}`
  }

  const getProfileRequest = () => {
    return request(options)
      .then(response => JSON.parse(response));
  };

  if(cache) {
    return cache.withCacheGetAndSet(getProfileRequest, { key: `profile-${accessToken}`, ttl: '1d' });
  } else {
    return getProfileRequest();
  }
}

function getCourse({ accessToken, courseId }, { cache = true } = {}) {
  return Promise.resolve({});
}

function getUsersSubmissionsForCourse({ accessToken, courseId }, { cache = true } = {}) {
  return Promise.resolve([]);
}

function getUsersPointsForCourse({ accessToken, courseId }, { cache = true } = {}) {
  return Promise.resolve([]);
}

module.exports = { getCourse, getUsersSubmissionsForCourse, getUsersPointsForCourse, getProfile };
