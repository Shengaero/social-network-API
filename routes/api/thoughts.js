const router = require('express').Router();
const { User, Thought } = require('../../db');
const { notFound, badRequest } = require('../errors');

const thoughtNotFound = (thoughtId) =>
    notFound(`thought with ID ${thoughtId} not found`);

router.get('/', async (_, res) => {
    const thoughts = await Thought.find({});    // find all thoughts
    res.status(200).json(thoughts);             // 200 - OK with thoughts as JSON
});

router.get('/:thoughtId', async (req, res) => {
    const { thoughtId } = req.params;                       // get thoughtId from URL parameters
    const thought = await Thought.findById(thoughtId);      // find thought by thoughtId
    if(!thought)                                            // if no thought found
        thoughtNotFound(thoughtId);                             // 404 - Not Found
    res.status(200).json(thought);                          // 200 - OK with thought as JSON
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

    res.status(201).json(thought);                          // 201 - Created, along with the new thought as a JSON
});

router.put('/:thoughtId', async (req, res) => {
    const { thoughtId } = req.params;                   // get thoughtId URL parameter
    const { thoughtText } = req.body;                   // get thoughtText field from request body
    if(!thoughtText)                                    // if no thoughtText field was present
        badRequest('missing "thoughtText" field');          // 400 - Bad Request
    const thought = await Thought.findByIdAndUpdate(    // find and update thought...
        thoughtId,                                          // by thoughtId
        { $set: { thoughtText: thoughtText } },             // set thoughtText to thoughtText field in request body
        { runValidators: true, new: true }                  // and run validators, returning the new version
    );
    if(!thought)                                        // if no thought was found
        thoughtNotFound(thoughtId);                         // 404 - Not Found
    res.status(200).json(thought);                      // 200 - OK with thought as JSON
});

router.delete('/:thoughtId', async (req, res) => {
    const { thoughtId } = req.params;                           // get thoughtId URL parameter
    const thought = await Thought.findByIdAndDelete(thoughtId); // find and delete thought by thoughtId
    if(!thought) {                                              // if no thought was found
        res.sendStatus(200);                                        // 200 - OK
        return;                                                     // return
    }
    await User.updateOne(                                       // update user where...
        { username: thought.username },                             // username matches the username of the deleted thought
        { $pull: { thoughts: thought.id } }                         // pull thoughtId from thoughts array
    );
    res.sendStatus(204);                                        // 204 - No Content
});

router.post('/:thoughtId/reactions', async (req, res) => {
    const { thoughtId } = req.params;                           // get thoughtId URL parameter
    const { reactionBody, username } = req.body;                // get reactionBody and username from request body
    if(!reactionBody)                                           // if reactionBody field not present
        badRequest('missing "reactionBody" field');                 // 400 - Bad Request
    if(!username)                                               // if username field not present
        badRequest('missing "username" field');                     // 400 - Bad Request

    const thought = await Thought.findByIdAndUpdate(            // find and update thought...
        thoughtId,                                                  // by thoughtId
        { $push: { reactions: { reactionBody, username } } },       // push new reaction to reactions array
        { runValidators: true, new: true }                          // run validators and return new version
    );

    if(!thought)                                                // if no thought was found
        thoughtNotFound(thoughtId);                                 // 404 - Not Found

    res.status(201).json(thought);                              // 201 - Created with thought as JSON
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    const { thoughtId, reactionId } = req.params;       // get thoughtId and reactionId URL parameters

    const thought = await Thought.findByIdAndUpdate(    // find and update thought...
        thoughtId,                                          // by thoughtId
        { $pull: { reactions: { reactionId } } },           // pull reaction from reaction array
        { new: true }                                       // return
    );

    if(!thought)                                        // if no thought was found
        thoughtNotFound(thoughtId);                         // 404 - Not Found

    res.status(200).json(thought);                      // 200 - OK with thought as JSON
});

module.exports = router;
