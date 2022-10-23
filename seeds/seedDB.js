require('dotenv').config();
const db = require('../db/connection');
const userSeeds = require('./userSeeds');
const thoughtSeeds = require('./thoughtSeeds');
const { User, Thought } = require('../db');

async function flushCollections() {
    console.log('Flushing collections...');
    await User.deleteMany({});
    await Thought.deleteMany({});
    console.log('Collections flushed!');
}

async function closeDB() {
    console.log('Closing database...');
    await db.close();
    console.log('Database closed! enjoy!');
}

db.once('open', async () => {
    await flushCollections();
    await userSeeds();
    await thoughtSeeds();
    await closeDB();
});
