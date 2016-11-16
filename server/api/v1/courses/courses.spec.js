const request = require('supertest');
const app = require('app');
const nock = require('nock');

describe('Courses API', () => {

  before(() => {
    nock(process.env.TMC_API_URL)
      .get('/api/beta/participant')
      .reply(401, {});
  });

  describe('Visualization API', () => {

    it('should respond with 403 without a valid TMC access token', done => {
      request(app)
        .post('/api/v1/courses/1/visualization')
        .set('Authorization', 'Bearer 123')
        .expect(403, done);
    });

  });

});
