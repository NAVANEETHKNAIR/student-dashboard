const router = require('express').Router();

const tmcMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.post('/:courseId',
  tmcMiddlewares.getProfile(),
  middlewares.getVisualizationTypeForUser({
    getUserId: req => req.tmcProfile.username,
    getCourseId: req => req.params.courseId
  }),
  middlewares.getVisualizationForUser({
    getUserId: req => req.tmcProfile.username,
    getCourseId: req => req.params.courseId,
    getVisualizationType: req => req.visualizationType,
    getQuery: req => req.body
  }),
  (req, res, next) => {
    res.json(req.visualization);
  });

module.exports = router;
