const expect = require('expect');
const _ = require('lodash');
const moment = require('moment');

const points = require('./index.js');

const isAround = (a, b, maxDistance = 0.2) => Math.abs(a - b) <= maxDistance;
const toDate = dateString => moment(dateString, 'DD.MM').unix() * 1000;

describe('points', () => {

  it('should calculate exercise points correctly', () => {
    const exercises = _.chain(new Array(5)).fill(0).map((e, i) => ({ exercise_id: i.toString(), available_points: _.fill(new Array(2), '1') })).value();
    const pointsReceived = _.chain(new Array(10)).fill(0).map((p, i) => ({ exercise_id: i.toString() })).value();

    expect(
      points.getExercisePoints({ exercises, points: _.take(pointsReceived, 0) }).value
    ).toBe(0);

    expect(
      points.getExercisePoints({ exercises, points: _.take(pointsReceived, 5) }).value
    ).toBe(0.5);

    expect(
      points.getExercisePoints({ exercises, points: pointsReceived }).value
    ).toBe(1);
  });

  it('should calculate earliness points correctly', () => {
    const exercises = _.chain(new Array(3)).fill(0).map((e, i) => ({ id: i.toString(), published_at: toDate('14.11'), deadline_at: toDate('20.11') })).value();

    const submissionsA = [
      {
        exercise_id: '0',
        created_at: toDate('15.11')
      },
      {
        exercise_id: '0',
        created_at: toDate('19.11')
      },
      {
        exercise_id: '1',
        created_at: toDate('15.11')
      }
    ];

    expect(
      points.getEarlinessPoints({ exercises, submissions: submissionsA }).value
    ).toBe(1);

    const submissionsB = [
      {
        exercise_id: '0',
        created_at: toDate('16.11')
      },
      {
        exercise_id: '1',
        created_at: toDate('17.11')
      },
      {
        exercise_id: '2',
        created_at: toDate('19.11')
      }
    ];

    expect(
      isAround(points.getEarlinessPoints({ exercises, submissions: submissionsB }).value, 0.5)
    ).toBe(true);

    const submissionsC = [
      {
        exercise_id: '0',
        created_at: toDate('20.11')
      }
    ];

    expect(
      isAround(points.getEarlinessPoints({ exercises, submissions: submissionsC }).value, 0)
    ).toBe(true);
  });

  it('should calculate scheduling points correctly', () => {
    const exercises = [
      {
        exercise_id: '0',
        published_at: toDate('14.11'),
        deadline_at: toDate('20.11')
      }
    ];

    const submissionsA = [
      {
        exercise_id: '0',
        created_at: toDate('14.11')
      }
    ];

    expect(
      isAround(points.getSchedulingPoints({ exercises, submissions: submissionsA }).value, 0.25)
    ).toBe(true);

    const submissionsB = [
      ...submissionsA,
      {
        id: '0',
        created_at: toDate('15.11')
      },
      {
        id: '0',
        created_at: toDate('16.11')
      }
    ];

    expect(
      isAround(points.getSchedulingPoints({ exercises, submissions: submissionsB }).value, 0.75)
    ).toBe(true);

    const submissionsC = [
      ...submissionsB,
      {
        exercise_id: '0',
        created_at: toDate('18.11'),
      },
      {
        created_at: toDate('19.11')
      }
    ];

    expect(
      points.getSchedulingPoints({ exercises, submissions: submissionsC }).value
    ).toBe(1);
  });

  it('should calculate correct starting points', () => {
    const exercises = [
      {
        id: '0',
        published_at: toDate('14.11'),
        deadline_at: toDate('20.11')
      }
    ];

    const submissionsA = [
      {
        exercise_id: '0',
        created_at: toDate('14.11')
      }
    ];

    expect(
      points.getStartingPoints({ exercises, submissions: submissionsA }).value
    ).toBe(1);

    const submissionsB = [
      {
        exercise_id: '0',
        created_at: toDate('16.11')
      }
    ];

    expect(
      isAround(points.getStartingPoints({ exercises, submissions: submissionsB }).value, 0.5)
    ).toBe(true);

    const submissionsC = [
      {
        exercise_id: '0',
        created_at: toDate('20.11')
      }
    ];

    expect(
      points.getStartingPoints({ exercises, submissions: submissionsC }).value
    ).toBe(0);
  });

});
