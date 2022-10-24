const router = require('express').Router();
const { User, Thought } = require('../../db');
const { notFound, badRequest } = require('../errors');

const findUserById = (userId) =>
    User.findById(userId)
        .populate('thoughts')
        .populate('friends');

router.get('/', async (_, res) => {
    const users = await User.find({});      // find all users
    res.status(200).json(users);            // 200 - OK with users as JSON
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;                      // get userId URL parameter
    const user = await findUserById(userId);            // find user with matching userId
    if(!user)                                           // if user was not found
        notFound(`user with ID ${userId} not found`);       // 404 - Not Found
    res.status(200).json(user);                         // 200 - OK with user as JSON
});

router.post('/', async (req, res) => {
    const { username, email } = req.body;       // get username and email from request body
    if(!username)                               // if username field not present
        badRequest('missing "username" field');     // 400 - Bad Request
    if(!email)                                  // if email field not present
        badRequest('missing "email" field');        // 400 - Bad Request
    const user = new User({ username, email }); // create new user object using username and email
    await user.save();                          // await saving user
    res.status(201).json(user);                 // 201 - Created with user as JSON
});

router.put('/:userId', async (req, res) => {
    const { username, email } = req.body;                                   // get username and email from request body
    const { userId } = req.params;                                          // get userId URL parameter
    if(!username && !email)                                                 // if both username and email fields are not present
        badRequest('missing "username" and "email", specify at least one');     // 400 - Bad Request

    const data = {};                                                        // create a data object for the validated fields to update the user with
    if(username)                                                            // if username field is present
        data.username = username;                                               // add it to the data object as username
    if(email)                                                               // if email field is present
        data.email = email;                                                     // add it to the data object as email

    const user = await User.findByIdAndUpdate(                              // find a user and update...
        userId,                                                                 // by the userId
        { $set: data },                                                         // set the values of the user to the ones in the data object
        { runValidators: true }                                                 // and run validators. DO NOT SAVE: we need the data of the previous version
    );

    if(!user)                                                               // if no user was found
        notFound(`user with ID ${userId} not found`);                           // 404 - Not Found

    if(username) {                                                          // if username field is present
        await Thought.updateMany(                                               // update thoughts where...
            { username: user.username },                                            // username matches old username
            { $set: { username } },                                                 // set the username of thought equal to the new one
            { runValidators: true }                                                 // and run validators
        );
        await Thought.updateMany(                                               // update thoughts where...
            { 'reactions.username': user.username },                                // username matches old username in any reactions
            { $set: { 'reactions.$.username': username } },                         // set the username of the matched reactions to the new one
            { runValidators: true }                                                 // and run validators
        );
    }

    res.status(200).json(await findUserById(userId));                       // 200 - OK with updated user as JSON
});

router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;                              // get userId URL parameter
    const user = await User.findByIdAndDelete(userId);          // find user and delete by userId
    if(!user) {                                                 // if no user was found
        res.sendStatus(200);                                        // 200 - OK
        return;                                                     // return
    }

    await Thought.deleteMany({ username: user.username });      // delete thoughts where username of thought matches username of deleted user
    await Thought.updateMany(                                   // update thoughts where...
        { 'reactions.username': user.username },                    // username of reaction matches username of deleted user
        { $pull: { reactions: { username: user.username } } }       // pull reactions with username matching username of deleted user
    );
    await User.updateMany(                                      // update users where...
        { friends: user.id },                                       // friends array contains deleted user's ID
        { $pull: { friends: user.id } }                             // pull ID matching deleted user's ID
    );

    res.sendStatus(204);                                        // 294 - No Content
});

router.post('/:userId/friends/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;                                // get userId and friendId URL parameters
    const user = await User.findById(userId);                               // find user by userId
    const friend = await User.findById(friendId);                           // find friend by friendId
    if(!user)                                                               // if user was not found
        notFound(`could not find user with ID: ${userId}`);                     // 404 - Not Found
    if(!friend)                                                             // if friend was not found
        notFound(`could not find user to friend with ID: "${friendId}"`);       // 404 - Not Found

    if(!user.friends.includes(friend.id)) {                                 // if user's friends does not include friend's ID
        user.friends.push(friend.id);                                           // push the friend's ID to the user's friends
        await user.save();                                                      // save user
    }
    res.status(200).json(user);                                             // 200 - OK with user as JSON
});

router.delete('/:userId/friends/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;                // get userId and friendId URL parameters
    const user = await User.findByIdAndUpdate(              // find and update user by...
        userId,                                                 // userId
        { $pull: { friends: friendId } },                       // pull ID matching friendId from friends array
        { new: true }                                           // make sure this returns new version
    );

    if(!user)                                               // if user was not found
        notFound(`could not find user with ID: ${userId}`);     // 404 - Not Found

    res.status(200).json(user);                             // 200 - OK with user as JSON
});

module.exports = router;
