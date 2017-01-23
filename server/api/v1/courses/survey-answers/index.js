const router = require('express').Router({ mergeParams: true });

const tmcMiddlewares = require('app-modules/middlewares/tmc');
const errors = require('app-modules/errors');

const middlewares = require('./middlewares');

router.post('/',
  tmcMiddlewares.getProfile(),
  middlewares.createSurveyAnswer({
    getSource: req => req.params.courseId,
    getUserId: req => req.tmcProfile.id,
    getAttributes: req => req.body,
  }),
  (req, res, next) => {
    res.json(req.newSurveyAnswer);
  });

router.get('/user',
  tmcMiddlewares.getProfile(),
  middlewares.getSurveyAnswer({
    getSource: req => req.params.courseId,
    getUserId: req => req.tmcProfile.id,
  }),
  (req, res, next) => {
    res.json(req.surveyAnswer);
  }
);

module.exports = router;
