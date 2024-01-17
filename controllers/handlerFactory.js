const catchAsyncErr = require('../utils/catchAssyncErr.js');
const AppErrror = require('../utils/AppError.js');
const APIFeatures = require('../utils/APIFeatures.js');

exports.getAllDocs = (Model) => {
  return catchAsyncErr(async (req, res, next) => {
    let filter = {};
    // We will want the reviews of some specific anime/user
    // will pass that filter on

    if (Model.modelName === 'Review') {
      if (req.query.userFilter) {
        filter.user = userFilter;
      } else if (req.query.animeFilter) {
        filter.anime = req.query.animeFilter;
      }
    }
    const query = new APIFeatures(Model.find(filter), req.query)
      .sort()
      .paginate();
    const data = await query.mongooseQuery;
    res.status(201).json({
      status: 'success',
      results: data.length,
      data,
    });
  });
};
