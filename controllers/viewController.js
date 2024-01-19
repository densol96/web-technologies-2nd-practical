const Anime = require('../models/animeModel.js');
const Review = require('../models/reviewModel.js');
const catchAssyncErr = require('../utils/catchAssyncErr.js');

const starSequence = (rating) => {
  const fullStars = Math.floor(rating);
  let hasHalfStar = rating % 1 !== 0;

  const starsForRender = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsForRender.push('star');
    } else if (hasHalfStar) {
      starsForRender.push('star-half-outline');
      hasHalfStar = false;
    } else {
      starsForRender.push('star-outline');
    }
  }
  return starsForRender;
};

exports.getAnime = catchAssyncErr(async (req, res) => {
  const anime = await Anime.findOne({ slug: req.params.slug });
  if (!anime) {
    const err = new AppError('Page not found', 404);
    err.name = 'Page not found';
    err.errors = 'No anime on the portal has this URL';
    return next(err);
  }
  const DOCS_PER_PAGE = 3;
  const SEARCH_BY = { addedAt: -1 };

  let reviews;
  try {
    reviews = await Review.find({ anime: anime._id })
      .sort(SEARCH_BY)
      .limit(DOCS_PER_PAGE);
  } catch (err) {
    console.log(err);
  }

  const pagesTotal = Math.ceil(anime.reviewsTotal / DOCS_PER_PAGE);
  const rating = starSequence(anime.rating);

  res.status(201).render('anime', {
    anime,
    starSequence,
    reviews,
    pagesTotal,
  });
});

exports.getOverview = catchAssyncErr(async (req, res) => {
  // Want the overview page to render the latest 5 animes that were posted
  const DOCS_PER_PAGE = 5;
  const SEARCH_BY = { addedAt: -1 };
  const animes = await Anime.find().sort(SEARCH_BY).limit(DOCS_PER_PAGE);
  const total = await Anime.countDocuments();
  // want to pass in data-set to the client to update the state on the front-side
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);

  res.status(200).render('overview', {
    animes,
    renderPages: total > DOCS_PER_PAGE,
    pagesTotal,
  });
});

exports.login = (req, res) => {
  res.status(200).render('login');
};

exports.signUp = (req, res) => {
  res.status(200).render('signup');
};

exports.emailConfirmed = (req, res) => {
  res.status(200).render('emailConfirmed', {
    username: req.username,
  });
};

exports.forgotPassword = (req, res) => {
  res.status(200).render('forgotPassword');
};

exports.resetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    username: req.username,
  });
};

exports.meSettings = (req, res) => {
  res.status(200).render('settings');
};

exports.meSecurity = (req, res) => {
  res.status(200).render('security');
};

exports.meReviews = catchAssyncErr(async (req, res) => {
  const DOCS_PER_PAGE = 3; // 5
  const SEARCH_BY = { addedAt: -1 };
  const reviews = await Review.find({ user: req.user._id })
    .sort(SEARCH_BY)
    .limit(DOCS_PER_PAGE);
  const total = await Review.countDocuments({ user: req.user._id });
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);

  res.status(200).render('me-reviews', {
    reviews,
    starSequence,
    pagesTotal,
    user: req.user,
  });
});

exports.editReviews = catchAssyncErr(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  res.status(200).render('editReviews', {
    starSequence,
    review,
  });
});
