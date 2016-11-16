const ParticipantCounter = require('./participant-counter');
const { GROUP_COUNT } = require('app-modules/constants/participants');

module.exports = schema => {

  schema.statics.getGroup = function({ userId, courseId }) {
    return this.findOne({ userId, courseId })
      .then(user => {
        if(user) {
          return user.group;
        } else {
          return ParticipantCounter.increaseAndGetCounter(courseId)
            .then(value => value % GROUP_COUNT)
            .then(group => {
              const newParticipant = new this({ userId, courseId, group });

              return newParticipant.save()
                .then(() => newParticipant.group);
            });
        }
      });
  }

}
