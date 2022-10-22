const db = require('./connection');
const User = require('./models/User');
const Thought = require('./models/Thought');

module.exports = { db, User, Thought };
