const request = require('supertest');
const nock = require('nock');
const moment = require('moment');
const expect = require('expect');
const _ = require('lodash');
const async = require('async');

const visualizationTypes = require('app-modules/constants/visualizations');
const app = require('app');
const tmcApiMock = require('app-modules/test-utils/tmc-api-mock');
const database = require('app-modules/test-utils/database');

const toDate = dateString => moment(dateString, 'DD.MM').unix() * 1000;
const toUnix = t => Math.floor(t / 1000);

describe('Courses API', () => {

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

    const submissions = {
      submissions: [
        {
          created_at: toDate('18.11'),
          exercise_name: 'Ex 1'
        }
      ]
    };

    tmcApiMock
      .mockAuthenticationFailure({ accessToken: '123' })
      .mockAuthenticationSuccess({ accessToken: '456', username: 'test1' })
      .mockAuthenticationSuccess({ accessToken: '567', username: 'test2' })
      .mockAuthenticationSuccess({ accessToken: '678', username: 'test3' })
      .mockAuthenticationSuccess({ accessToken: '789', username: 'test4' })
      .mockGetExercises(exercises)
      .mockGetPoints(points)
      .mockGetSubmissions(submissions);

    return database.connect();
  });

  it('should not be able to get visualization without a valid TMC access token', done => {
    request(app)
      .post('/api/v1/courses/1/visualization')
      .set('Authorization', 'Bearer 123')
      .expect(403, done);
  });

  it('should be abole to get visualization with a valid TMC access token', done => {
    const body = {
      exerciseGroups: {
        'Week 1': [toUnix(toDate('14.11')), toUnix(toDate('20.11'))]
      }
    }

    request(app)
      .post('/api/v1/courses/1/visualization')
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
        .post('/api/v1/courses/1/visualization')
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
          .set('Authorization', 'Bearer 567')
          .end((err, res) => {
            expect(res.body.type).toBe(visualizationTypes.RADAR_VISUALIZATION_WITH_GRADE);
            cb();
          });
      },
      cb => {
        makeRequest()
          .set('Authorization', 'Bearer 678')
          .end((err, res) => {
            expect(res.body.type).toBe(visualizationTypes.NO_VISUALIZATION);
            cb();
          });
      },
      cb => {
        makeRequest()
          .set('Authorization', 'Bearer 789')
          .end((err, res) => {
            expect(res.body.type).toBe(visualizationTypes.RADAR_VISUALIZATION);
            cb();
          });
      }
    ], done);
  });

  afterEach(() => {
    return database.clean();
  });

  after(() => {
    nock.cleanAll();

    return database.disconnect();
  });
});
