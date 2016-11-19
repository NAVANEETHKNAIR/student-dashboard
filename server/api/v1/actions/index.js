const router = require('express').Router();

const tmcMiddlewares = require('app-modules/middlewares/tmc');
const middlewares = require('./middlewares');

router.post('/',
  tmcMiddlewares.getProfile(),
  middlewares.createAction({
    getUserId: req => req.tmcProfile.id,
    getAttributes: req => req.body
  }),
  (req, res, next) => {
    res.json(req.newAction);
  });

module.exports = router;
