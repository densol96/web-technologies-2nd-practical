const catchAsyncErr = require('../utils/catchAssyncErr.js');
const AppError = require('../utils/AppError.js');
const APIFeatures = require('../utils/APIFeatures.js');
const Review = require('../models/reviewModel.js');
const Anime = require('../models/animeModel.js');
const User = require('../models/userModel.js');

exports.postReview = catchAsyncErr(async (req, res, next) => {
  const { comment, rating, slug } = req.body;
  const user = req.user;
  const anime = await Anime.findOne({ slug });
  const newComment = await Review.create({
    comment,
    rating,
    user: user._id,
    anime: anime._id,
    // Admins should have verified comments by default
    checked: req.user.role === 'admin',
  });

  res.status(200).json({
    status: 'success',
    message: 'Your review has been posted',
  });
});

exports.getReviews = catchAsyncErr(async (req, res, next) => {
  // We will want the reviews of some specific anime/user
  // will pass that filter in
  let filter = {};
  let user;
  if (req.query.userFilter) {
    user = await User.findOne({
      username: req.query.userFilter,
    });
    if (!user) {
      throw new AppError(
        'No user with such username exists',
        400,
        'Invalid input'
      );
    }
    filter.user = user._id;
    // calc totalOages of reviews per user using user.reviewsLeft
  } else if (req.query.animeFilter) {
    filter.anime = req.query.animeFilter;
  }

  const query = new APIFeatures(Review.find(filter), req.query, 'Review')
    .sort()
    .paginate();

  const data = await query.mongooseQuery;

  let pagesTotal;
  const DOCS_PER_PAGE = 5;
  if (user) {
    pagesTotal = Math.ceil(user.reviewsLeft / DOCS_PER_PAGE);
  } else {
    const total = await Review.countDocuments();
    pagesTotal = Math.ceil(total / DOCS_PER_PAGE);
  }

  res.status(201).json({
    status: 'success',
    results: data.length,
    data,
    pagesTotal,
  });
});

exports.deleteReview = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params;
  await Review.findByIdAndDelete({ _id: id });
  res.status(200).json({
    status: 'success',
    message: 'The review has been deleted',
  });
});

exports.updateReview = catchAsyncErr(async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment, checked } = req.body;

  const review = await Review.findOneAndUpdate(
    {
      _id: id,
    },
    {
      rating,
      comment,
      checked,
    },
    { runValidators: true }
  );
  res.status(200).json({
    status: 'success',
    message: 'Review has been updated',
  });
});
