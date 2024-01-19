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

// Configure mongoose to connect to mongoDB instance in cloud (AtlasDB)
const DB = process.env.DATABASE_REMOTE.replace(
  '<PASSWORD>',
  process.env.ATLAS_DB_PASSWORD
);
// At one moment, the cloud platform was unavailable, so I was working with the DB on my localhost
// const DB = 'mongodb://localhost:27017/animePortal';

mongoose
  .connect(DB)
  .then(() => {
    console.log(`Connected to DB successfully!`);
  })
  .catch((err) => {
    console.log(`💥 UNABLE TO CONNECT TO DB:`);
    console.log(err);
  });

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
