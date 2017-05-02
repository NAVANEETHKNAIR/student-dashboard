const Promise = require('bluebird');

const ParticipantCounter = require('./participant-counter');
const CourseConfig = require('../course-config');

const { GROUP_COUNT } = require('app-modules/constants/participants');

module.exports = schema => {

  schema.statics.getGroup = function({ userId, courseId }) {
    return Promise.all([
      CourseConfig.findById(courseId), 
      this.findOne({ userId, courseId })
    ])
      .spread((courseConfig, user) => {
        const groupCount = courseConfig && courseConfig.visualizations
          ? courseConfig.visualizations.length
          : GROUP_COUNT;
          
        if(user) {
          return user.group;
        } else {
          return ParticipantCounter.increaseAndGetCounter(courseId)
            .then(value => value % groupCount)
            .then(group => {
              const newParticipant = new this({ userId, courseId, group });

              return newParticipant.save()
                .then(() => newParticipant.group);
            });
        }
      });
  }

}
