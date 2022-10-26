const { User } = require('../db');
const usersData = require('./usersData.json');

const userSeeds = async () => {
    console.log('Seeding users...');
    let firstUser = null;
    for(const userData of usersData) {
        console.log(`Seeding user: ${JSON.stringify(userData) }`);
        const user = new User(userData);
        await user.save();
        if(firstUser === null) {
            firstUser = user;
        } else {
            user.friends.push(firstUser._id);
            firstUser.friends.push(user._id);
        }
        await user.save();
    }
    await firstUser.save();
    console.log('Finished seeding users!');
};

module.exports = userSeeds;
