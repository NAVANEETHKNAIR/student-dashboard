const nock = require('nock');

let exported = {};

exported.mockAuthenticationSuccess = function({ accessToken, username = 'test' }) {
  nock(process.env.TMC_API_URL)
    .get(`/api/beta/participant?access_token=${accessToken}`)
    .reply(200, {
      username
    });

  return exported;
}

exported.mockAuthenticationFailure = function({ accessToken }) {
  nock(process.env.TMC_API_URL)
    .get(`/api/beta/participant?access_token=${accessToken}`)
    .reply(403);

  return exported;
}

exported.mockGetExercises = function(exercises) {
  nock(process.env.TMC_API_ALPHA_URL)
    .get(/\/api\/v8\/courses\/.+\/exercises\?access_token=.+$/)
    .reply(200, exercises)
    .persist();

  return exported;
}

exported.mockGetPoints = function(points) {
  nock(process.env.TMC_API_ALPHA_URL)
    .get(/\/api\/v8\/courses\/.+\/points\/user\?access_token=.+$/)
    .reply(200, points)
    .persist();

  return exported;
}

exported.mockGetSubmissions = function(submissions) {
  nock(process.env.TMC_API_ALPHA_URL)
    .get(/\/api\/v8\/courses\/.+\/exercises\/submissions\/user\?access_token=.+$/)
    .reply(200, submissions)
    .persist();

  return exported;
}

module.exports = exported;
