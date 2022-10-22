const { Schema, Types, model } = require('mongoose');

const reactionSchema = new Schema({
    reactionId: {
        type: Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        get: v => Date.parse(v)
    }
});

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionSchema],
    createdAt: {
        type: Date,
        default: () => Date.now(),
        get: v => Date.parse(v)
    }
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
