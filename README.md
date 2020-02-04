# Red Tetris

![Loading screen](/images/loading-screen.png)

**Red Tetris** is a School 42 project. The purpose of this project is to create multiplayer Tetris.

[`red_tetris.en.pdf`](/red_tetris.en.pdf) is the task file.

## Requirements

It is a Full-Stack JavaScript project. So installed [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/get-npm) are required:

* Node.js >= 8.0.0 (`node --version`)
* npm >= 5.0.0 (`npm --version`)

> Note: npm is installed with Node.js.

## How to install?

Clone repository:

```
git clone <repository url>
```

Then go into the created directory and install `node_modules`:

```
npm install
```

## How to start?

To start the server run the following command:

```
npm start
```

The server will start on [http://127.0.0.1:3000](http://127.0.0.1:3000).

> Note: Configuration (host and port) can be changed in [`.env`](/.env) file.

## How to join the room?

To join the room use the URL with the following structure:

`http://127.0.0.1:3000/#<room-name>[<player-name>]`

* `<room-name>` is a placeholder of the name of the room
* `<player-name>` is a placeholder of the name of the player

For example, to join room **“42”** under the name **“vbrazhni”** use [http://127.0.0.1:3000/#42[vbrazhni]](http://127.0.0.1:3000/#42[vbrazhni]).

> Note: Also, the URL can be encoded — [http://127.0.0.1:3000/#42%5Bvbrazhni%5D](http://127.0.0.1:3000/#42%5Bvbrazhni%5D)

![Pending single game](/images/pending-single-game.png)

![Running single game](/images/running-single-game.png)

## How to test?

To run unit tests use:

```
npm test
```

Also, Red Tetris project has the following requirements of the code coverage:

* Statements — 70+%
* Branches — 50+%
* Functions — 70+%
* Lines — 70+%

To get the detailed report about the code coverage of each file run:

```
npm run test:coverage
```

To get the summary report use:

```
npm run test:coverage:summary
```

## How to make available on another computer?

You can use [ngrok](https://ngrok.com/) to make Red Tetris available worldwide.

After setup, run the following command:

```
./ngrok http 3000
```

ngrok will provide the URL which can be shared with anyone:

![ngrok](/images/ngrok.png)

With that URL other people will be able to play Red Tetris via the Internet.

![Running multiplayer game](/images/running-multiplayer-game.png)

![Completed multiplayer game](/images/completed-multiplayer-game.png)
