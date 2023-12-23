const catchAsyncErr = require('../utils/catchAssyncErr.js');
const AppErrror = require('../utils/AppError.js');
const APIFeatures = require('../utils/APIFeatures.js');

exports.getAllDocs = (Model) => {
  return catchAsyncErr(async (req, res, next) => {
    const query = new APIFeatures(Model.find(), req.query).sort().paginate();
    const data = await query.mongooseQuery;
    console.log(data);
    res.status(201).json({
      status: 'success',
      results: data.length,
      data,
    });
  });
};
