const expect = require('expect');
const _ = require('lodash');
const moment = require('moment');

const points = require('./index.js');

const isAround = (a, b, maxDistance = 0.2) => Math.abs(a - b) <= maxDistance;
const toDate = dateString => moment(dateString, 'DD.MM').unix() * 1000;

describe('Points', () => {

  it('should calculate exercise points correctly', () => {
    const exercises = _.chain(new Array(5)).fill(0).map((e, i) => ({ exercise_id: i.toString(), available_points: _.fill(new Array(2), '1') })).value();
    const pointsReceived = _.chain(new Array(10)).fill(0).map((p, i) => ({ exercise_id: i.toString() })).value();

    const pointsBad = points.getExercisePoints({ exercises, points: _.take(pointsReceived, 0) });

    expect(pointsBad.value).toBe(0);
    expect(pointsBad.meta.points).toBe(0);
    expect(pointsBad.meta.bestPoints).toBe(10);

    const pointsOk = points.getExercisePoints({ exercises, points: _.take(pointsReceived, 5) });

    expect(pointsOk.value).toBe(0.5);
    expect(pointsOk.meta.points).toBe(5);
    expect(pointsOk.meta.bestPoints).toBe(10);

    const pointsGood = points.getExercisePoints({ exercises, points: pointsReceived });

    expect(pointsGood.value).toBe(1);
    expect(pointsGood.meta.points).toBe(10);
    expect(pointsGood.meta.bestPoints).toBe(10);
  });

  it('should calculate earliness points correctly', () => {
    const exercises = _.chain(new Array(3)).fill(0).map((e, i) => ({ id: i.toString(), published: toDate('14.11'), deadline: toDate('20.11') })).value();

    const submissionsBad = [
      {
        exercise_id: '0',
        created_at: toDate('20.11')
      }
    ];

    const pointsBad = points.getEarlinessPoints({ exercises, submissions: submissionsBad });

    expect(pointsBad.value).toBe(0);
    expect(pointsBad.meta.averageDays).toBe(0);
    expect(pointsBad.meta.bestAverageDays).toBe(4.8);

    const submissionsOk = [
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

    const pointsOk = points.getEarlinessPoints({ exercises, submissions: submissionsOk });

    expect(pointsOk.value).toBeGreaterThan(0.4).toBeLessThan(0.6);
    expect(pointsOk.meta.averageDays).toBe(2.7);
    expect(pointsOk.meta.bestAverageDays).toBe(4.8);

    const submissionsGood = [
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

    const pointsGood = points.getEarlinessPoints({ exercises, submissions: submissionsGood });

    expect(pointsGood.value).toBe(1);
    expect(pointsGood.meta.averageDays).toBe(5);
    expect(pointsGood.meta.bestAverageDays).toBe(4.8);
  });

  it('should calculate scheduling points correctly', () => {
    const exercises = [
      {
        exercise_id: '0',
        published: toDate('14.11'),
        deadline: toDate('20.11')
      }
    ];

    const submissionsBad = [
      {
        exercise_id: '0',
        created_at: toDate('14.11')
      }
    ];

    const pointsBad = points.getSchedulingPoints({ exercises, submissions: submissionsBad });

    expect(pointsBad.value).toBe(0.25);
    expect(pointsBad.meta.workingDays).toBe(1);
    expect(pointsBad.meta.bestWorkingDays).toBe(4);

    const submissionsOk = [
      ...submissionsBad,
      {
        id: '0',
        created_at: toDate('15.11')
      },
      {
        id: '0',
        created_at: toDate('16.11')
      }
    ];

    const pointsOk = points.getSchedulingPoints({ exercises, submissions: submissionsOk });

    expect(pointsOk.value).toBe(0.75);
    expect(pointsOk.meta.workingDays).toBe(3);
    expect(pointsOk.meta.bestWorkingDays).toBe(4);

    const submissionsGood = [
      ...submissionsOk,
      {
        exercise_id: '0',
        created_at: toDate('18.11'),
      },
      {
        created_at: toDate('19.11')
      }
    ];

    const pointsGood = points.getSchedulingPoints({ exercises, submissions: submissionsGood });

    expect(pointsGood.value).toBe(1);
    expect(pointsGood.meta.workingDays).toBe(5);
    expect(pointsOk.meta.bestWorkingDays).toBe(4);
  });

  it('should calculate correct starting points', () => {
    const exercises = [
      {
        id: '0',
        published: toDate('14.11'),
        deadline: toDate('20.11')
      }
    ];

    const submissionsBad = [
      {
        exercise_id: '0',
        created_at: toDate('20.11')
      }
    ];

    const pointsBad = points.getStartingPoints({ exercises, submissions: submissionsBad });

    expect(pointsBad.value).toBe(0);
    expect(moment(pointsBad.meta.startingDate).format('DD.MM')).toBe('20.11')
    expect(moment(pointsBad.meta.bestStartingDate).format('DD.MM')).toBe('14.11');

    const submissionsOk = [
      {
        exercise_id: '0',
        created_at: toDate('16.11')
      }
    ];

    const pointsOk = points.getStartingPoints({ exercises, submissions: submissionsOk });

    expect(pointsOk.value).toBe(0.67);
    expect(moment(pointsOk.meta.startingDate).format('DD.MM')).toBe('16.11')
    expect(moment(pointsOk.meta.bestStartingDate).format('DD.MM')).toBe('14.11');


    const submissionsGood = [
      {
        exercise_id: '0',
        created_at: toDate('14.11')
      }
    ];

    const pointsGood = points.getStartingPoints({ exercises, submissions: submissionsGood });

    expect(pointsGood.value).toBe(1);
    expect(moment(pointsGood.meta.startingDate).format('DD.MM')).toBe('14.11')
    expect(moment(pointsGood.meta.bestStartingDate).format('DD.MM')).toBe('14.11');
  });

});
