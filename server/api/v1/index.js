const router = require('express').Router();

router.use('/visualizations', require('./visualizations'));
router.use('/actions', require('./actions'));

module.exports = router;
