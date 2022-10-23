const router = require('express').Router();
const apiRoutes = require('./api');
const errorsHandler = require('./errors').handler;

router.use('/api', apiRoutes);
router.use('/api', errorsHandler);

module.exports = router;
