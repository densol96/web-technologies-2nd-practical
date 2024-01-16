const dotenv = require('dotenv');
const fs = require('fs');
const Anime = require('../../models/animeModel.js');
const Review = require('../../models/reviewModel.js');
const User = require('../../models/userModel.js');
const mongoose = require('mongoose');

dotenv.config({ path: `${__dirname}/../../config.env` });
const DB = process.env.DATABASE_REMOTE.replace(
  '<PASSWORD>',
  process.env.ATLAS_DB_PASSWORD
);

mongoose
  .connect(DB)
  .then((connection) => {
    console.log(`Remote DB connection successful!`);
  })
  .catch((err) => {
    console.log(`💥ERROR connecting to DB: `, err.message);
  });

const animes = fs.readFileSync(`${__dirname}/animes.json`);
const animesDataObject = JSON.parse(animes);

const reviews = fs.readFileSync(`${__dirname}/reviews.json`);
const reviewsObject = JSON.parse(reviews);

const users = fs.readFileSync(`${__dirname}/users.json`);
const usersObject = JSON.parse(users);
// const single = fs.readFileSync(`${__dirname}/moreAnimes.json`);
// const singleObject = JSON.parse(single);
// console.log(singleObject);

const importData = async () => {
  try {
    // await Anime.create(animesDataObject);
    await Review.create(reviewsObject);
    // await User.create(usersObject);
    console.log('Added;');
  } catch (err) {
    console.log('💥 UNABLE to save Anime Data!');
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Anime.deleteMany();
  } catch (err) {
    console.log('💥 UNABLE to delete Anime Data!');
    console.log(err);
  }
};

const addSingleAnime = async () => {
  try {
    await Anime.create(singleObject);
  } catch (err) {
    console.log(`💥UNABLE TO ADD A DOC!`);
    console.log(err);
  }
};

const terminalApp = async () => {
  const argv = process.argv;
  // node ./dev-data/data/addRemoveToDB.js --import
  if (argv.at(-1) === '--import') {
    await importData();
  }
  // node ./dev-data/data/addRemoveToDB.js --delete
  else if (argv.at(-1) === '--delete') {
    await deleteData();
  }
  // node ./dev-data/data/addRemoveToDB.js --single
  else if (argv.at(-1) === '--single') {
    await addSingleAnime();
  } else {
    console.log('Unable to parse terminal command!');
  }
  process.exit();
};

terminalApp();
// mongosh "mongodb+srv://cluster0.8gudcwj.mongodb.net/" --apiVersion 1 --username deniss11sol
const upd = async () => {
  await Anime.updateMany({}, [
    { $set: { reviewsTotal: { $size: '$reviews' } } },
  ]);
};
// upd();
