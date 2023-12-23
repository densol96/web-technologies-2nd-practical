const Anime = require('../models/animeModel.js');

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

exports.getAnime = async (req, res) => {
  const anime = await Anime.findOne({ slug: req.params.slug });
  if (!anime) {
    res.status(404).json({
      status: 'fail',
      message: 'No such page!',
    });
  }
  const rating = starSequence(anime.rating);
  console.log(rating);
  res.status(201).render('anime', {
    anime,
    starSequence,
  });
};

exports.getOverview = async (req, res) => {
  // Want the overview page to render the latest 5 animes that were posted
  const DOCS_PER_PAGE = 5;
  const SEARCH_BY = { addedAt: -1 };
  const animes = await Anime.find().sort(SEARCH_BY).limit(DOCS_PER_PAGE);
  const total = await Anime.countDocuments();
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);

  res.status(200).render('overview', {
    animes,
    renderPages: total > DOCS_PER_PAGE,
    pagesTotal,
  });
};
