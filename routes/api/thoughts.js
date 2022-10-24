const router = require('express').Router();
const { User, Thought } = require('../../db');
const { unimplemented, notFound, badRequest } = require('../errors');

const thoughtNotFound = (thoughtId) =>
    notFound(`thought with ID ${thoughtId} not found`);

router.get('/', async (_, res) => {
    const thoughts = await Thought.find({});
    res.status(200).json(thoughts.map(thought =>
        thought.toObject({ virtuals: true })));
});

router.get('/:thoughtId', async (req, res) => {
    const { thoughtId } = req.params;
    const thought = await Thought.findById(thoughtId);
    if(!thought)
        thoughtNotFound(thoughtId);
    res.status(200).json(thought.toObject({ virtuals: true }));
});

router.post('/', async (req, res) => {
    const body = req.body;                                  // get request body
    const { thoughtText, userId } = body;                   // deconstuct thoughtText and userId from request body
    let username = body.username;                           // get optional username from request body

    if(!thoughtText)                                        // if no thoughtText field was in body
        badRequest('missing "thoughtText" field');              // 400 - Bad Request
    if(!userId)                                             // if no userId field was in body
        badRequest('missing "userId" field');                   // 400 - Bad Request

    const user = await User.findById(userId);               // find User by userId specified
    if(!user)                                               // if no user found with userId
        notFound(`user with ID ${userId} not found`);           // 404 - Not Found

    if(!username) {                                         // if no username field was in body
        username = user.username;                               // set the value of username to the one contained in the user
    } else if(username !== user.username) {                 // otherwise, if username does not match the one contained in the user
        badRequest(                                             // 400 - Bad Request
            `"${username}" does not match the ` +                   // NOTE: May decide to change this functionality
            `username for user with ID ${userId}`                   //later but for now I'm sticking with this.
        );
    }

    const thought = new Thought({ thoughtText, username }); // create new Thought
    await thought.save();                                   // await saving new thought

    user.thoughts.push(thought.id);                         // push thought ID to user's thoughts array
    await user.save();                                      // await saving user

    res.status(201).json(thought.toObject({                 // 201 - Created, along with the new thought as a JSON
        virtuals: true
    }));
});

router.put('/:thoughtId', async (req, res) => {
    const { thoughtId } = req.params;
    const { thoughtText } = req.body;
    if(!thoughtText)
        badRequest('missing "thoughtText" field');
    const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $set: { thoughtText: thoughtText } },
        { runValidators: true, new: true }
    );
    if(!thought)
        thoughtNotFound(thoughtId);
    res.status(200).json(thought.toObject({ virtuals: true }));
});

router.delete('/:thoughtId', async (req, res) => {
    const { thoughtId } = req.params;
    const thought = await Thought.findByIdAndDelete(thoughtId);
    if(!thought) {
        res.sendStatus(200);
        return;
    }
    await User.updateOne(
        { username: thought.username },
        { $pull: { thoughts: thoughtId } }
    );
    res.sendStatus(204);
});

router.post('/:thoughtId/reactions', async (req, res) => {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;
    if(!reactionBody)
        badRequest('missing "reactionBody" field');
    if(!username)
        badRequest('missing "username" field');

    const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: { reactionBody, username } } },
        { runValidators: true, new: true }
    );

    if(!thought)
        thoughtNotFound(thoughtId);

    res.status(201).json(thought.toObject({ virtuals: true }));
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    const { thoughtId, reactionId } = req.params;

    const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $pull: { reactions: { reactionId } } },
        { new: true }
    );

    if(!thought)
        thoughtNotFound(thoughtId);

    res.status(200).json(thought.toObject({ virtuals: true }));
});

module.exports = router;
