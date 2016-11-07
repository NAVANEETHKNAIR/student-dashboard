const router = require('express').Router();

router.use('/courses', require('./courses'));
router.use('/actions', require('./actions'));

module.exports = router;
