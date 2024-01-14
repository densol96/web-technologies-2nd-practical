const handlerFactory = require('./handlerFactory.js');
const catchAsyncErr = require('../utils/catchAssyncErr.js');
const Review = require('../models/reviewModel.js');

exports.postReview = catchAsyncErr(async (req, res, next) => {});
