const handlerFactory = require('./handlerFactory.js');
const catchAsyncErr = require('../utils/catchAssyncErr.js');
const Review = require('../models/reviewModel.js');
const Anime = require('../models/animeModel.js');

exports.postReview = catchAsyncErr(async (req, res, next) => {
  const { comment, rating, slug } = req.body;
  const user = req.user;
  const anime = await Anime.findOne({ slug });
  const newComment = await Review.create({
    comment,
    rating,
    user: user._id,
    anime: anime._id,
  });
  res.status(200).json({
    status: 'success',
    message: 'Your review has been posted',
  });
});

exports.getReviews = handlerFactory.getAllDocs(Review);

exports.deleteReview = catchAsyncErr(async (req, res, next) => {
  const { reviewId } = req.params;
  await Review.findByIdAndDelete({ _id: reviewId });
  res.status(200).json({
    status: 'success',
    message: 'The review has been deleted',
  });
});
