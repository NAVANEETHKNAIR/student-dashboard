const nock = require('nock');

function mockAuthenticationSuccess(accessToken, username = 'test') {
  nock(process.env.TMC_API_URL)
    .get(`/api/beta/participant?access_token=${accessToken}`)
    .reply(200, {
      username
    });
}

function mockAuthenticationFailure(accessToken) {
  nock(process.env.TMC_API_URL)
    .get(`/api/beta/participant?access_token=${accessToken}`)
    .reply(403);
}

module.exports = {
  mockAuthenticationSuccess,
  mockAuthenticationFailure
}
