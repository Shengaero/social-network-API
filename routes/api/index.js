const router = require('express').Router();
const users = require('./users');
const thoughts = require('./thoughts');

router.use('/users', users);
router.use('/thoughts', thoughts);
router.get('/ping', (_, res) => {
    res.status(200).json({
        pong: Date.now().toString()
    });
});

module.exports = router;
