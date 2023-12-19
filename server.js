// Handle global exceptions
process.on('uncaughtException', (err) => {
  console.log('💥Unhandled global exception:');
  console.log(err);
  process.exit(1);
});

// Set up environment variables for this nodejs process
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const app = require('./app.js');
const mongoose = require('mongoose');

// Configure server (port 3000 coming from the config file)
const port = +process.env.PORT;
const server = app.listen(port, () => {
  console.log(`"Anime-Portal App" on 127.0.0.1:${port}`);
});

// Handle global rejections
process.on('unhandledRejection', (err) => {
  console.log(`💥 Unhandled global rejection: `);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
