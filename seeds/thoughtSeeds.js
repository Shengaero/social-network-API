const { User, Thought } = require('../db');
const thoughtsData = require('./thoughtsData.json');

const thoughtSeeds = async () => {
    for(const thoughtData of thoughtsData) {
        console.log(`Seeding thought: ${JSON.stringify(thoughtData)}`);
        const thought = new Thought(thoughtData);
        await thought.save();

        console.log(`Adding thought (ID: ${thought.id}) to corresponding user: ${thought.username}`);
        const user = await User.findOne({ username: thought.username });
        user.thoughts.push(thought.id);
        await user.save();
    }

    console.log('Finished seeding thoughts!');
};

module.exports = thoughtSeeds;