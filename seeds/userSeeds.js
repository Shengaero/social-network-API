const { User } = require('../db');
const usersData = require('./usersData.json');

const userSeeds = async () => {
    for(const userData of usersData) {
        console.log(`Seeding user: ${JSON.stringify(userData)}`);
        const user = new User(userData);
        await user.save();
    }
    console.log('Finished seeding users!');
};

module.exports = userSeeds;
