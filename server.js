require('dotenv').config(); // always load .env config before literally anything else!
require('./db/connection').once('open', start); // once database has been opened, run our start

const express = require('express');
const routes = require('./routes');

const PORT = process.env.EXPRESS_PORT || 3001;
const app = express();

function middleware() {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
}

function routing() {
    app.use(routes);
}

function start() {
    console.log('Connection to database established!'); // log that we've established a database connection

    middleware();                                       // setup middleware
    routing();                                          // setup routing

    app.listen(PORT, () => {                            // have express start listening on our desired connection port
        console.log(`Open on port: ${PORT}`);               // log that we've opened on the port
    });
}
