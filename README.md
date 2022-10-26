[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# social-network-API
A backend API for a social network written in node.js

## Table of Contents
* [Installation](#installation)
    * [NPM](#npm)
    * [Environment](#environment)
    * [Seed Data](#seed-data)
* [Usage](#usage)
    * [Starting the Server](#starting-the-server)
    * [MongoDB](#mongodb)
    * [Routes](#routes)
        * [`/api/users`](#apiusers)
        * [`/api/thoughts`](#apithoughts)
* [Questions](#questions)

## Installation
This program will require you have `node.js` and `mongodb` installed.

Once you have both `node.js` and `mongodb` installed, you can clone this repository by using the following via command line:
```bash
git clone git@github.com:Shengaero/social-network-API.git
```

### NPM
Now that it's cloned, you can install the dependencies via the `npm` command:
```bash
npm i
```

### Environment
Finally, you will need to create a `.env` file in the root of the installation with the following environment variables:
```properties
MONGO_URL="127.0.0.1"
MONGO_PORT=27017
MONGO_DB="socialNetworkDB"
EXPRESS_PORT=3001
```

> ### Seed Data
> Before using the application, you may wish to create some seed data for testing purposes.
>
> In order to do this run the following command:
> ```bash
> npm run seed
> ```

## Usage
Everything installed? Great, now we can finally start the application!

### Starting the Server
To run this application, simply navigate to the installation directory and run the following via command line:
```bash
npm start
# or
node server.js
```

There will be a brief console output ending with the following message telling you that the server is now running:
```
App listening on port 3001!
```

> ### MongoDB
> You will also need to have started the MongoDB server using `mongod`. For convenience, you can also run the following command in the installation directory to start mongod (note that functionality may vary based on specific installation):
> ```bash
> npm run mongod
> ```

### Routes
Once you've opened the server, you can freely make requests using your preferred client to the various URL routes available below:

#### `/api/users`
- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `POST /api/users/{userId}/friends/{friendId}`
- `DELETE /api/users/{userId}/friends/{friendId}`

#### `/api/thoughts`
- `GET /api/thoughts`
- `GET /api/thoughts/{id}`
- `POST /api/thoughts`
- `PUT /api/thoughts/{id}`
- `DELETE /api/thoughts/{id}`
- `PUT /api/thoughts/{thoughtId}/reactions`
- `DELETE /api/thoughts/{thoughtId}/reactions/{reactionId}`

[Here's a video showing how it works](https://youtu.be/ec-th0r8kjI)

## Questions
For questions or other inquiries, feel free to reach out to me via either [GitHub](https://github.com/Shengaero) or send an email to kaidangustave@yahoo.com
