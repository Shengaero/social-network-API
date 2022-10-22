require('dotenv').config();
require('./db/connection').once('open', start); // once database has been opened, run our start

const express = require('express');

const PORT = process.env.EXPRESS_PORT || 3301;
const app = express();

function start() {
    console.log('Connection to database established!'); // log that we've established a database connection
    app.listen(PORT, () => {                            // have express start listening on our desired connection port
        console.log(`Open on port: ${PORT}`);               // log that we've opened on the port
    });
}
