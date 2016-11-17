const request = require('supertest');
const app = require('app');
const tmcApiMock = require('app-modules/test-utils/tmc-api-mock');
const nock = require('nock');

describe('Courses API', () => {

  before(() => {
    tmcApiMock.mockAuthenticationFailure('123');
  });

  it('should not be able to get visualization without a valid TMC access token', done => {
    request(app)
      .post('/api/v1/courses/1/visualization')
      .set('Authorization', 'Bearer 123')
      .expect(403, done);
  });

  after(() => {
    nock.cleanAll();
  });

});
