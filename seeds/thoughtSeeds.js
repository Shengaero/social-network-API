const { User, Thought } = require('../db');
const thoughtsData = require('./thoughtsData.json');

const thoughtSeeds = async () => {
    console.log('Seeding thoughts...');
    for(const thoughtData of thoughtsData) {
        console.log(`Seeding thought: ${JSON.stringify(thoughtData)}`);
        const thought = new Thought(thoughtData);
        await thought.save();
    }
    console.log('Finished seeding thoughts!');
    console.log('Linking thoughts to users...');
    for(const thought of await Thought.find({})) {
        console.log(`Linking thought (ID: ${thought._id}) to corresponding user: ${thought.username}`);
        const user = await User.findOne({ username: thought.username });
        user.thoughts.push(thought._id);
        await user.save();
    }
    console.log('Finished linking thoughts to users!');
};

module.exports = thoughtSeeds;
