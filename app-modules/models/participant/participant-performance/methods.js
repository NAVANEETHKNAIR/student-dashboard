const _ = require('lodash');

module.exports = schema => {

  schema.statics.updateParticipantsPerformance = function(attributes) {
    const { userId, courseId, starting, earliness, exercises, scheduling } = attributes;

    return this.update(
      { userId, courseId },
      { $set: { starting, earliness, exercises, scheduling } },
      { upsert: true }
    ).exec();
  };

  schema.statics.getCourseAveragePerformance = function(courseId) {
    const match = { courseId };

    const group = {
      _id: '$courseId',
      starting: { $sum: '$starting' },
      earliness: { $sum: '$earliness' },
      exercises: { $sum: '$exercises' },
      scheduling: { $sum: '$scheduling' },
      count: { $sum: 1 }
    };

    const pipeline = [
      { $match: match },
      { $group: group }
    ];

    return this.aggregate(pipeline)
      .exec()
      .then(aggregation => {
        if(aggregation.length === 0 || aggregation[0].count === 0) {
          return {
            starting: 0,
            earliness: 0,
            exercises: 0,
            scheduling: 0
          };
        }

        const data = aggregation[0];

        return _.mapValues({
          starting: data.starting,
          earliness: data.earliness,
          exercises: data.exercises,
          scheduling: data.scheduling
        }, value => _.round(value / data.count, 2));
      });
  }

};
