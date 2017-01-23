const mongoose = require('mongoose');

const errors = require('app-modules/errors');

const schema = new mongoose.Schema({
  _id: { type: String },
  source: { type: String, required: true },
  userId: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  group: { type: Number },
}, { timestamps: true });

function setId(next) {
  if (this.isNew) {
    this._id = `${this.source || ''}_${this.userId || ''}`;
  }

  next();
}

function setUsersGroup(next) {
  if (this.isNew) {
    const notFoundError = new errors.NotFoundError(`Couldn't find participant with userId ${this.userId} and courseId ${this.courseId}`);

    errors.withExistsOrError(notFoundError)
      (mongoose.models.Participant.findOne({ userId: this.userId, courseId: this.source }))
        .then(participant => {
          this.group = participant.group;

          return next();
        })
        .catch(next);
  } else {
    next();
  }
}

schema.pre('save', setId);
schema.pre('save', setUsersGroup);

module.exports = mongoose.model('SurveyAnswer', schema);
