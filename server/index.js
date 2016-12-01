const router = require('express').Router();
const cors = require('cors');

const errors = require('app-modules/errors');

const errorMiddlewares = require('app-modules/middlewares/errors');

router.use('/api', cors());
router.use('/api', require('./api'));
router.use('/plugin-loader', require('./plugin-loader'));

router.use((req, res, next) => {
  next(new errors.NotFoundError(`Path "${req.path}" was not found`));
});

router.use(errorMiddlewares.apiErrorHandler());

module.exports = router;
