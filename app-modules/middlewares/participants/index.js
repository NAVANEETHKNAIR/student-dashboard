const Participant = require('app-modules/models/participant');
const errors = require('app-modules/errors');

function getGroup({ getUserId, getCourseId }) {
  return (req, res, next) => {
    const courseId = getCourseId(req);
    const userId = getUserId(req);

    if(!courseId) {
      return next(new errors.InvalidRequestError('Course id is required'));
    }

    Participant.getGroup({ userId: getUserId(req), courseId })
      .then(group => {
        req.group = group;

        return next();
      })
      .catch(err => next(err));
  }
}

module.exports = { getGroup }
