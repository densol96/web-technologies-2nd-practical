const Anime = require('../models/animeModel.js');
const Review = require('../models/reviewModel.js');
const User = require('../models/userModel.js');
const catchAssyncErr = require('../utils/catchAssyncErr.js');
const AppError = require('../utils/AppError.js');

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

exports.getAnime = catchAssyncErr(async (req, res, next) => {
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

  res.status(201).render('siteFront/anime', {
    anime,
    starSequence,
    reviews,
    pagesTotal,
  });
});

exports.getOverview = catchAssyncErr(async (req, res, next) => {
  // Want the overview page to render the latest 5 animes that were posted
  const DOCS_PER_PAGE = 5;
  const SEARCH_BY = { addedAt: -1 };
  const animes = await Anime.find().sort(SEARCH_BY).limit(DOCS_PER_PAGE);
  const total = await Anime.countDocuments();
  // want to pass in data-set to the client to update the state on the front-side
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);

  res.status(200).render('siteFront/overview', {
    animes,
    renderPages: total > DOCS_PER_PAGE,
    pagesTotal,
  });
});

exports.publicUserProfile = catchAssyncErr(async (req, res, next) => {
  const { id } = req.params;
  const clientUser = await User.findById(id);
  if (!clientUser) {
    return next(
      new AppError('Unable to find a user with such ID', 400, 'Invalid input')
    );
  }
  res.status(200).render('siteFront/user', {
    clientUser,
  });
});

exports.login = (req, res) => {
  if (req.user) return res.redirect('/overview');
  res.status(200).render('siteFront/login');
};

exports.signUp = (req, res) => {
  if (req.user) return res.redirect('/overview');
  res.status(200).render('siteFront/signup');
};

exports.emailConfirmed = (req, res) => {
  res.status(200).render('siteFront/emailConfirmed', {
    username: req.username,
  });
};

exports.forgotPassword = (req, res) => {
  if (req.user) return res.redirect('/overview');
  res.status(200).render('siteFront/forgotPassword');
};

exports.resetPassword = (req, res) => {
  if (req.user) return res.redirect('/overview');
  res.status(200).render('siteFront/resetPassword', {
    username: req.username,
  });
};

exports.meSettings = (req, res) => {
  res.status(200).render('siteFront/settings');
};

exports.meSecurity = (req, res) => {
  res.status(200).render('siteFront/security');
};

exports.meReviews = catchAssyncErr(async (req, res, next) => {
  const DOCS_PER_PAGE = 3; // 5
  const SEARCH_BY = { addedAt: -1 };
  const reviews = await Review.find({ user: req.user._id })
    .sort(SEARCH_BY)
    .limit(DOCS_PER_PAGE);
  const total = await Review.countDocuments({ user: req.user._id });
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);

  res.status(200).render('siteFront/me-reviews', {
    reviews,
    starSequence,
    pagesTotal,
    user: req.user,
  });
});

exports.editReviews = catchAssyncErr(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  res.status(200).render('siteFront/editReviews', {
    starSequence,
    review,
  });
});

// ----------------- ADMIN - VIEW CONTROLLER -----------------
// REVIEWS
exports.adminReviews = catchAssyncErr(async (req, res, next) => {
  const DOCS_PER_PAGE = 5;
  const SEARCH_BY = { addedAt: -1 };
  const reviews = await Review.find().sort(SEARCH_BY).limit(DOCS_PER_PAGE);
  const total = await Review.countDocuments();
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);

  res.status(200).render('admin/reviews', {
    pagesTotal,
    reviews,
    starSequence,
  });
});

exports.adminEditReviews = catchAssyncErr(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  res.status(200).render('admin/editReviews', {
    starSequence,
    review,
  });
});

// USERS
exports.adminUsers = catchAssyncErr(async (req, res, next) => {
  const DOCS_PER_PAGE = 5;
  const SEARCH_BY = { registrationDate: -1 };
  const users = await User.find().sort(SEARCH_BY).limit(DOCS_PER_PAGE);

  const total = await User.countDocuments();
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);

  res.status(200).render('admin/users', {
    pagesTotal,
    users,
  });
});

const formatDateToUTC2 = (ban) => {
  let [date, time] = ban.toISOString().slice(0, 16).split('T');
  let [hr, min] = time.split(':');
  hr = +hr;
  hr += 2; // go +2hrs to make it UTC+2
  return `${date}T${hr}:${min}`;
};

exports.adminEditUsers = catchAssyncErr(async (req, res, next) => {
  const { id } = req.params;
  const clientUser = await User.findById(id);
  if (!clientUser) {
    return next(
      new AppError(
        'Unable to find user with such ID',
        400,
        'Invalid input data'
      )
    );
  }

  if (clientUser.ban) {
    clientUser.banString = formatDateToUTC2(clientUser.ban);
  } else {
    clientUser.banString = ``;
  }

  res.status(200).render('admin/editUser', {
    clientUser,
  });
});

exports.adminCreateUser = (req, res, next) => {
  res.status(200).render('admin/createUser');
};

// Animes
exports.adminAnimes = catchAssyncErr(async (req, res, next) => {
  const DOCS_PER_PAGE = 5;
  const SEARCH_BY = { addedAt: -1 };

  const animes = await Anime.find().sort(SEARCH_BY).limit(DOCS_PER_PAGE);
  const total = await Anime.countDocuments();
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);

  res.status(200).render('admin/animes', {
    pagesTotal,
    animes,
  });
});

exports.adminEditAnimes = catchAssyncErr(async (req, res, next) => {
  const { id } = req.params;
  const anime = await Anime.findOne({ _id: id });

  if (!anime) {
    throw new AppError('Unable to find anime with such id', 400, 'Invalid id');
  }

  res.status(200).render('admin/editAnime', {
    anime,
  });
});

exports.adminCreateAnimes = (req, res, next) => {
  res.status(200).render('admin/createAnime');
};
