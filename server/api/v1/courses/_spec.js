const request = require('supertest');
const app = require('app');
const nock = require('nock');

describe('Courses API', () => {

  before(() => {
    nock(process.env.TMC_API_URL)
      .get('/api/beta/participant?access_token=123')
      .reply(403, {});
  });

  it('should not be able to get visualization without a valid TMC access token', done => {
    request(app)
      .post('/api/v1/courses/1/visualization')
      .set('Authorization', 'Bearer 123')
      .expect(403, done);
  });

});
