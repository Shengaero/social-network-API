require('dotenv').config();
const db = require('../db/connection');
const userSeeds = require('./userSeeds');
const thoughtSeeds = require('./thoughtSeeds');

async function seedDB() {
    console.log('seeding database...');
    await userSeeds();
    await thoughtSeeds();
    console.log('closing database...');
    await db.close();
    console.log('database closed! enjoy!');
}

db.once('open', () => {
    seedDB();
});
