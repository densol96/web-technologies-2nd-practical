const catchAssyncErr = require('../utils/catchAssyncErr.js');
const APIFeatures = require('../utils/APIFeatures.js');
const Anime = require('../models/animeModel.js');

exports.getAllAnimes = catchAssyncErr(async (req, res, next) => {
  const query = new APIFeatures(Anime.find(), req.query, 'Anime')
    .sort()
    .paginate();

  const data = await query.mongooseQuery;
  res.status(201).json({
    status: 'success',
    results: data.length,
    data,
  });
});
