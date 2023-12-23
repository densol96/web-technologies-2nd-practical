const handlerFactory = require('./handlerFactory.js');
const Anime = require('../models/animeModel.js');

exports.getAllAnimes = handlerFactory.getAllDocs(Anime);
