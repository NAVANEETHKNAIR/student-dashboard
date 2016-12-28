const expect = require('expect');

const database = require('app-modules/test-utils/database');
const gradeEstimator = require('app-modules/utils/grade-estimator');

describe.only('Grade estimator', () => {

  before(database.connect);

  it('should return 0 when exercise points are less than 0.5', () => {
    const points = {
      exercises: 0.4,
      starting: 0.9,
      earliness: 0.9,
      scheduling: 0.9,
    };

    return gradeEstimator.getGradeEstimate(points)
      .then(grade => {
        expect(grade).toBe(0)
      });
  });

  it('should return 0 when total points are below worst', () => {
    const points = {
      exercises: 0.5,
      starting: 0.3,
      earliness: 0.3,
      scheduling: 0.3,
    };

    return gradeEstimator.getGradeEstimate(points)
      .then(grade => {
        expect(grade).toBe(0)
      });
  });

  it('should return 5 when total points are above best', () => {
    const points = {
      exercises: 1,
      starting: 0.9,
      earliness: 0.9,
      scheduling: 0.9,
    };

    return gradeEstimator.getGradeEstimate(points)
      .then(grade => {
        expect(grade).toBe(5)
      });
  });

  it('should return a grade above 0 and below 5 with ok points', () => {
    const points = {
      exercises: 0.7,
      starting: 0.6,
      earliness: 0.7,
      scheduling: 0.8,
    };

    return gradeEstimator.getGradeEstimate(points)
      .then(grade => {
        expect(grade).toBeGreaterThan(0);
        expect(grade).toBeLessThan(5);
      });
  });

  afterEach(database.clean);

  after(database.disconnect);

});
