const request = require('supertest');
const app = require('app');
const nock = require('nock');
const tmcApiMock = require('app-modules/test-utils/tmc-api-mock');
const database = require('app-modules/test-utils/database');

describe('Actions API', () => {

  before(() => {
    tmcApiMock.mockAuthenticationFailure('123');
    tmcApiMock.mockAuthenticationSuccess('456');

    return database.connect();
  });

  it('should not be able to create an action without a valid TCM access token', done => {
    request(app)
      .post('/api/v1/actions')
      .set('Authorization', 'Bearer 123')
      .expect(403, done);
  });

  it('should be able to create an action with valid TMC access token and data', done => {
    request(app)
      .post('/api/v1/actions')
      .send({ name: 'TEST_ACTION', source: 'test', userId: 'test', createdAtAdjustedToTz: 1, hour: 1, weekday: 1, createdAt: new Date() })
      .set('Authorization', 'Bearer 456')
      .expect(200, done);
  });

  afterEach(() => {
    return database.clean();
  });

  after(() => {
    nock.cleanAll();

    return database.disconnect();
  });
});
