const request = require('supertest');
const sinon = require('sinon');
const Promise = require('bluebird');
const expect = require('expect');

const app = require('app');
const tmcApi = require('app-modules/utils/tmc-api');
const database = require('app-modules/test-utils/database');

describe('Actions API', () => {

  before(() => {
    return database.connect();
  });

  it('should not be able to create an survey answer without a valid TCM access token', done => {
    const tmcApiProfileStub = sinon.stub(tmcApi, 'getProfile')
      .returns(Promise.reject());

    request(app)
      .post('/api/v1/courses/123/survey-actions')
      .set('Authorization', 'Bearer 123')
      .expect(403, () => {
        tmcApiProfileStub.restore();
        done();
      });
  });

  it('should be able to create an survey answer with valid TMC access token and data', done => {
    const tmcApiProfileStub = sinon.stub(tmcApi, 'getProfile')
      .returns(Promise.resolve({
        accessToken: '456',
        id: '1'
      }));

    request(app)
      .post('/api/v1/courses/123/survey-answers')
      .send({ data: { lorem: 'ipsum' } })
      .set('Authorization', 'Bearer 456')
      .expect(200, (err, res) => {
        expect(res.body.userId).toBe('1');
        expect(res.body._id).toBe('123_1');

        tmcApiProfileStub.restore();
        done();
      });
  });

  afterEach(() => {
    return database.clean();
  });

  after(() => {
    return database.disconnect();
  });
});
