const { User } = require('../db');
const usersData = require('./usersData.json');

const userSeeds = async () => {
    console.log('Seeding users...');
    let firstUser = null;
    for(const userData of usersData) {
        console.log(`Seeding user: ${JSON.stringify(userData) }`);
        const user = new User(userData);
        if(!firstUser) {
            firstUser = user;
        } else {
            user.friends.push(firstUser.id);
            firstUser.friends.push(user.id);
        }
        await user.save();
    }
    await firstUser.save();
    console.log('Finished seeding users!');
};

module.exports = userSeeds;
