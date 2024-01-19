const mongoose = require('mongoose');
const Anime = require('./animeModel.js');

const reviewSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      minlength: [10, 'Comment must be at least 10 characters long'],
      required: [true, 'Review must have a comment'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Rating cannot be more than 5'],
      required: [true, 'Review must have a rating'],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    // Will be using parent referencing to Anime and User models
    anime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Anime',
      required: [true, 'Review must belong to an anime'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// One user can only have 1 review for the same anime
reviewSchema.index({ anime: 1, user: 1 }, { unique: true });
// Most of the time need reviews in the of order 'latest' + high read/write ratio => adding index will boost performance
reviewSchema.index({ createdAt: -1 });

reviewSchema.pre(/^find/, function (next) {
  // need these fields for me-reviews and CMS
  this.populate([
    {
      path: 'user',
      select: 'username avatar',
    },
    {
      path: 'anime',
      select: 'title slug',
    },
  ]);
  next();
});

// To be called after saving the review to update reviewsTotal and rating properties on the appropriate anime
reviewSchema.statics.calculateRatingsAndTotal = async function (animeId) {
  const stats = await this.aggregate([
    {
      //animeId comes from the updated anime doc
      $match: { anime: animeId },
    },
    {
      $group: {
        _id: '$anime',
        numOfRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    // stats format is [{num, rating}]
    const { numOfRatings, averageRating } = stats[0];
    await Anime.findByIdAndUpdate(animeId, {
      reviewsTotal: numOfRatings,
      rating: averageRating,
    });
  } else {
    await Anime.findByIdAndUpdate(animeId, {
      reviewsTotal: 0,
      rating: undefined,
    });
  }
};

// USING A POST HOOK(NOT PRE!) cause after the review is added/deleted, perform calculating the ratings and total, then update the anime document
// ADD a new review to a collection
reviewSchema.post('save', function () {
  // inside document middleware this -> document; this.constructor -> Model upon which we are calling the static method
  this.constructor.calculateRatingsAndTotal(this.anime);
});

// findOneAndUpdate --- findOneAndDelete
reviewSchema.post(/^findOneAnd/, function (doc) {
  // this is a query middleware, therefore it will also get populated ---> need to use doc.anime._id to get access to anime id
  doc.constructor.calculateRatingsAndTotal(doc.anime._id);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
