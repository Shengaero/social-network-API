const router = require('express').Router();
const { Thought } = require('../../db');
const { unimplemented } = require('../errors');

router.get('/', async (_, res) => {
    const thoughts = await Thought.find({});
    res.status(200).json(thoughts);
});

router.get('/:thoughtId', unimplemented);

router.post('/', unimplemented);

router.put('/:thoughtId', unimplemented);

router.delete('/:thoughtId', unimplemented);

router.post('/:thoughtId/reactions', unimplemented);

router.delete('/:thoughtId/reactions/:reactionId', unimplemented);

module.exports = router;
