const router = require('express').Router();
const { User, Thought } = require('../../db');
const { notFound, badRequest } = require('../errors');

const findUserById = (userId) =>
    User.findById(userId)
        .populate('thoughts')
        .populate('friends');

router.get('/', async (_, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const user = await findUserById(userId);
    if(!user)
        notFound(`user with ID ${userId} not found`);
    res.status(200).json(user);
});

router.post('/', async (req, res) => {
    const { username, email } = req.body;
    if(!username)
        badRequest('missing "username" field');
    if(!email)
        badRequest('missing "email" field');
    const user = new User({ username, email });
    await user.save();
    res.status(201).json(user);
});

router.put('/:userId', async (req, res) => {
    const { username, email } = req.body;
    const { userId } = req.params;
    if(!username && !email)
        badRequest('missing "username" and "email", specify at least one');

    const data = {};
    if(username)
        data.username = username;
    if(email)
        data.email = email;

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: data },
        { runValidators: true }
    );

    if(!user)
        notFound(`user with ID ${userId} not found`);

    if(username) {
        await Thought.updateMany(
            { username: user.username },
            { $set: { username } },
            { runValidators: true }
        );
        await Thought.updateMany(
            { 'reactions.username': user.username },
            { $set: { 'reactions.$.username': username } },
            { runValidators: true }
        );
    }

    res.status(200).json(await findUserById(userId));
});

router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if(!user) {
        res.sendStatus(200);
        return;
    }

    await Thought.deleteMany({ username: user.username });
    await Thought.updateMany(
        { 'reactions.username': user.username },
        { $pull: { reactions: { username: user.username } } }
    );
    await User.updateMany(
        { friends: user.id },
        { $pull: { friends: user.id } }
    );

    res.sendStatus(204);
});

router.post('/:userId/friends/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if(!user)
        notFound(`could not find user with ID: ${userId}`);
    if(!friend)
        notFound(`could not find user to friend with ID: "${friendId}"`);
    if(!user.friends.includes(friend.id)) {
        user.friends.push(friend.id);
        await user.save();
    }
    res.status(200).json(user);
});

router.delete('/:userId/friends/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;
    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
    );

    if(!user)
        notFound(`could not find user with ID: ${userId}`);

    res.status(200).json(user);
});

module.exports = router;
