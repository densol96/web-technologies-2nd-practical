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
    createdAt: {
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

reviewSchema.pre('find', function (next) {
  this.populate({
    path: 'user',
    select: 'username avatar',
  });
  next();
});

reviewSchema.statics.calculateRatingsAndTotal = async function (animeId) {
  const stats = await this.aggregate([
    {
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

reviewSchema.post('save', function (document) {
  this.constructor.calculateRatingsAndTotal(document.anime);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;