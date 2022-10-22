const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL || '127.0.0.1';
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoDB = process.env.MONGO_DB || 'socialNetworkDB';

mongoose.connect(`mongodb://${mongoUrl}:${mongoPort}/${mongoDB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Export connection
module.exports = mongoose.connection;
