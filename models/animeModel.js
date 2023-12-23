const mongoose = require('mongoose');
const slugify = require('slugify');

// Create an Anime-Schema
const animeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Every anime should have an original title!'],
      unique: [true, 'This title is already present in the database!'],
      trim: true,
    },
    japaneseTitle: {
      type: String,
      required: [true, 'Every anime should have an original title!'],
      unique: [true, 'This title is already present in the database!'],
      trim: true,
    },
    slug: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, 'Rating cannot be lower than 1!'],
      max: [5, 'Rating cannot be higher that 5!'],
    },
    reviews: {
      type: Number,
      default: 0,
    },
    authors: {
      type: [String],
      required: [
        true,
        'Anime author(s) need to be privided via the array of string!',
      ],
    },
    releaseYear: {
      type: Number,
      required: [true, 'Anime should have a release year!'],
    },
    genres: {
      type: [String],
      required: [true, 'Anime should have author(s)!'],
    },
    ageAdvice: {
      type: Number, // min age
      required: [true, 'Age limit should be provided for every anime!'],
    },
    duration: {
      type: Number, // min
      required: [true, 'Anime should have a duration of the episode provided!'],
    },
    imageCover: {
      type: String, // path to the image file on the server
      required: [true, 'An anime must have a front cover!'],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Anime should have a summary!'],
    },
    status: {
      type: String,
      required: [true, 'Anime must have a status!'],
    },
    // A placeholder for now as Reviews model does not exist yet
    reviews: {
      type: [
        {
          username: {
            type: String,
            required: [true, 'Review should come with the username!'],
          },
          rating: {
            type: Number,
            required: [true, 'Review should come with the rating!'],
          },
          date: {
            type: Date,
          },
          comment: {
            type: String,
            required: [true, 'Review must have a comment!'],
          },
        },
      ],
    },
  },
  // if / when converting include virtual fields
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Use document pre-middleware to add a slug
animeSchema.pre('save', function (next) {
  // clear the sluf from the URL reserved characters:
  const charactersToRemove = /[:\/?#[\]@!$&'()*+,;=]/g;
  const filteredName = this.title.replace(charactersToRemove, '');
  this.slug = slugify(filteredName, { lower: true });
  next();
});

const Anime = mongoose.model('Anime', animeSchema);
module.exports = Anime;
