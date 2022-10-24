const { Schema, Types, model } = require('mongoose');
const emailRegex = require('../../util/emailRegex');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: emailRegex
    },
    thoughts: [{
        type: Types.ObjectId,
        ref: 'Thought',
        default: () => []
    }],
    friends: [{
        type: Types.ObjectId,
        ref: 'User',
        default: () => []
    }]
}, {
    virtuals: {
        friendCount: {
            get() {
                return this.friends.length;
            }
        }
    }
});

const User = model('User', userSchema);

module.exports = User;
