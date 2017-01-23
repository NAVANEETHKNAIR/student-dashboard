const SurveyAnswer = require('app-modules/models/survey-answer');
const _ = require('lodash');

const errors = require('app-modules/errors');

function createSurveyAnswer({ getSource, getUserId, getAttributes }) {
  return (req, res, next) => {
    const source = getSource(req);
    const userId = getUserId(req);
    const attributes = getAttributes(req);
    const permittedAttributes = Object.assign({ source, userId }, _.pick(attributes, ['data']));

    const newSurveyAnswer = new SurveyAnswer(permittedAttributes);

    newSurveyAnswer
      .save()
      .then(() => {
        req.newSurveyAnswer = newSurveyAnswer;

        return next();
      })
      .catch(next);
  };
}

function getSurveyAnswer({ getSource, getUserId }) {
  return (req, res, next) => {
    const source = getSource(req);
    const userId = getUserId(req);

    const notFoundError = new errors.NotFoundError(`Couldn't find a survey answer with a source ${source} and a userId ${userId}`);

    return errors.withExistsOrError(notFoundError)(SurveyAnswer.findOne({ source, userId }))
      .then(answer => {
        req.surveyAnswer = answer;

        return next();
      })
      .catch(next);
  }
}

module.exports = {
  createSurveyAnswer,
  getSurveyAnswer,
};
