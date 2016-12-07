const expect = require('expect');

const database = require('app-modules/test-utils/database');
const gradeEstimator = require('app-modules/utils/grade-estimator');
const GradeEntity = require('app-modules/models/grade-entity');

console.log('ad')

describe('Grade estimator', () => {

  before(database.connect);

  it('should return grade of the closest neighbor', () => {
    const entityA = new GradeEntity({
      userId: '1',
      courseId: '1',
      grade: 5,
      starting: 0.8,
      exercises: 0.8,
      scheduling: 0.8,
      earliness: 0.8
    });

    const entityB = new GradeEntity({
      userId: '2',
      courseId: '1',
      grade: 3,
      starting: 0.5,
      exercises: 0.5,
      scheduling: 0.5,
      earliness: 0.5
    });

    return Promise.all([entityA.save(), entityB.save()])
      .then(() => {
        return gradeEstimator.getGradeEstimate({ starting: 0.7, exercises: 0.7, scheduling: 0.7, earliness: 0.7 })
      })
      .then(grade => {
        expect(grade).toBe(5);
      });
  });

  afterEach(database.clean);

  after(database.disconnect);

});
