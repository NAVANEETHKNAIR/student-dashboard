const router = require('express').Router();

const tmcMiddlewares = require('app-modules/middlewares/tmc');
const participantMiddlewares = require('app-modules/middlewares/participants');
const middlewares = require('./middlewares');

router.post('/:courseId/visualization',
  tmcMiddlewares.getProfile(),
  participantMiddlewares.getGroup({
    getCourseId: req => req.params.courseId,
    getUserId: req => req.tmcProfile.username
  }),
  middlewares.getVisualizationTypeForUser(req => req.group),
  middlewares.getVisualizationForUser({
    getUserId: req => req.tmcProfile.username,
    getCourseId: req => req.params.courseId,
    getAccessToken: req => req.tmcProfile.accessToken,
    getVisualizationType: req => req.visualizationType,
    getQuery: req => req.body
  }),
  (req, res, next) => {
    res.json(req.visualization);
  });

module.exports = router;
