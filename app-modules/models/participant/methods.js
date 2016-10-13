const { hashCode } = require('hashcode');

function getHashCode(userId) {
  const middleChar = userId[Math.floor(userId.length / 2)];
  const lastChar = userId[userId.length - 1];

  return hashCode().value(`${lastChar}${userId}${middleChar}`);
}

function getGroupByHashCode(code) {
  return (Math.abs(code) % 3).toString();
}

module.exports = schema => {
  schema.statics.getGroup = function({ userId, courseId }) {
    return this.findOne({ userId, courseId })
      .then(user => {
        if(user) {
          return user.group;
        } else {
          const newParticipant = new this({ userId, courseId, group: getGroupByHashCode(getHashCode(userId)) })

          return newParticipant.save()
            .then(() => newParticipant.group);
        }
      });
  }
}
