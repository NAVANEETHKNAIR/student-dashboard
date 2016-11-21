const request = require('supertest');
const moment = require('moment');
const expect = require('expect');
const _ = require('lodash');
const async = require('async');
const Promise = require('bluebird');
const sinon = require('sinon');

const visualizationTypes = require('app-modules/constants/visualizations');
const database = require('app-modules/test-utils/database');

const tmcApi = require('app-modules/utils/tmc-api');
const gradeEstimator = require('app-modules/utils/grade-estimator');
const cacheUtil = require('app-modules/utils/cache');

const toDate = dateString => moment(dateString, 'DD.MM').unix() * 1000;
const toUnix = t => Math.floor(t / 1000);

describe('Courses API', () => {
  let app, gradeEstimatorStub, tmcApiExercisesStub, tmcApiPointsStub, tmcApiSubmissionsStub, cacheGetStub, cacheSetStub;

  before(() => {
    const exercises = [
      {
        id: '1',
        name: 'Ex 1',
        deadline: toDate('20.11'),
        available_points: ['1', '2', '3']
      },
      {
        id: '2',
        name: 'Ex 2',
        deadline: toDate('20.11'),
        available_points: ['4', '5', '6']
      }
    ];

    const points = [
      {
        exercise_id: '1'
      },
      {
        exercise_id: '1'
      },
      {
        exercise_id: '2'
      }
    ];

    const submissions = [
      {
        created_at: toDate('18.11'),
        exercise_name: 'Ex 1'
      }
    ];

    cacheGetStub = sinon.stub(cacheUtil, 'withCacheGetAndSet', getPromise => getPromise());
    cacheSetStub = sinon.stub(cacheUtil, 'withCacheSet', getPromise => getPromise());

    gradeEstimatorStub = sinon.stub(gradeEstimator, 'getGradeEstimate').returns(Promise.resolve(5));
    tmcApiExercisesStub = sinon.stub(tmcApi, 'getExercisesForCourse').returns(Promise.resolve(exercises));
    tmcApiPointsStub = sinon.stub(tmcApi, 'getUsersExercisePointsForCourse').returns(Promise.resolve(points));
    tmcApiSubmissionsStub = sinon.stub(tmcApi, 'getUsersSubmissionsForCourse').returns(Promise.resolve(submissions));

    app = require('app');

    return database.connect();
  });

  it('should not be able to get visualization without a valid TMC access token', done => {
    const tmcApiStub = sinon.stub(tmcApi, 'getProfile')
      .returns(Promise.reject());

    request(app)
      .post('/api/v1/courses/1/visualization/user')
      .set('Authorization', 'Bearer 123')
      .expect(403, () => {
        tmcApiStub.restore();
        done();
      });
  });

  it('should be able to get visualization with a valid TMC access token', done => {
    const body = {
      exerciseGroups: {
        'Week 1': [toUnix(toDate('14.11')), toUnix(toDate('20.11'))]
      }
    }

    const tmcApiProfileStub = sinon.stub(tmcApi, 'getProfile')
      .returns(Promise.resolve({
        accessToken: '456',
        id: '1'
      }));

    request(app)
      .post('/api/v1/courses/1/visualization/user')
      .send(body)
      .set('Authorization', 'Bearer 456')
      .expect(200)
      .end((err, res) => {
        expect(res.body.type).toExist();
        expect(res.body.data).toExist();
        expect(res.body.data.groups['Week 1']).toExist();

        _.values(res.body.data.groups['Week 1'])
          .forEach(param => {
            expect(param.value).toNotBe(0);
          });

        tmcApiProfileStub.restore();

        done();
      });
  });

  it('should give correct visualization type', done => {
    const body = {
      exerciseGroups: {
        'Week 1': [toUnix(toDate('14.11')), toUnix(toDate('20.11'))]
      }
    }

    const makeRequest = () => {
      return request(app)
        .post('/api/v1/courses/1/visualization/user')
        .send(body);
    }

    async.series([
      cb => {
        const tmcApiProfileStub = sinon.stub(tmcApi, 'getProfile')
          .returns(Promise.resolve({ accessToken: '456', id: '1' }));

        makeRequest()
          .set('Authorization', 'Bearer 456')
          .end((err, res) => {
            expect(res.body.type).toBe(visualizationTypes.RADAR_VISUALIZATION);

            tmcApiProfileStub.restore();
            cb();
          })
      },
      cb => {
        const tmcApiProfileStub = sinon.stub(tmcApi, 'getProfile')
          .returns(Promise.resolve({ accessToken: '567', id: '2' }));

        makeRequest()
          .set('Authorization', 'Bearer 567')
          .end((err, res) => {
            expect(res.body.type).toBe(visualizationTypes.RADAR_VISUALIZATION_WITH_GRADE);

            tmcApiProfileStub.restore();
            cb();
          });
      },
      cb => {
        const tmcApiProfileStub = sinon.stub(tmcApi, 'getProfile')
          .returns(Promise.resolve({ accessToken: '678', id: '3' }));

        makeRequest()
          .set('Authorization', 'Bearer 678')
          .end((err, res) => {
            expect(res.body.type).toBe(visualizationTypes.NO_VISUALIZATION);

            tmcApiProfileStub.restore();
            cb();
          });
      },
      cb => {
        const tmcApiProfileStub = sinon.stub(tmcApi, 'getProfile')
          .returns(Promise.resolve({ accessToken: '789', id: '4' }));

        makeRequest()
          .set('Authorization', 'Bearer 789')
          .end((err, res) => {
            expect(res.body.type).toBe(visualizationTypes.RADAR_VISUALIZATION);

            tmcApiProfileStub.restore();
            cb();
          });
      }
    ], done);
  });

  it('should give the same user the same visualization type', done => {
    const body = {
      exerciseGroups: {
        'Week 1': [toUnix(toDate('14.11')), toUnix(toDate('20.11'))]
      }
    }

    const tmcApiProfileStub = sinon.stub(tmcApi, 'getProfile')
      .returns(Promise.resolve({ accessToken: '456', id: '1' }));

    const makeRequest = () => {
      return request(app)
        .post('/api/v1/courses/1/visualization/user')
        .send(body);
    }

    async.series([
      cb => {
        makeRequest()
          .set('Authorization', 'Bearer 456')
          .end((err, res) => {
            expect(res.body.type).toBe(visualizationTypes.RADAR_VISUALIZATION);
            cb();
          })
      },
      cb => {
        makeRequest()
          .set('Authorization', 'Bearer 456')
          .end((err, res) => {
            expect(res.body.type).toBe(visualizationTypes.RADAR_VISUALIZATION);
            cb();
          });
      }
    ], err => {
      tmcApiProfileStub.restore();
      done(err);
    });
  });

  afterEach(() => {
    return database.clean();
  });

  after(() => {
    gradeEstimatorStub.restore();
    tmcApiExercisesStub.restore();
    tmcApiPointsStub.restore();
    tmcApiSubmissionsStub.restore();
    cacheGetStub.restore();
    cacheSetStub.restore();

    return database.disconnect();
  });
});
