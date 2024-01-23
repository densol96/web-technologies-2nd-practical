const catchAssyncErr = require('../utils/catchAssyncErr.js');
const APIFeatures = require('../utils/APIFeatures.js');
const AppError = require('../utils/AppError.js');
const Anime = require('../models/animeModel.js');
const Review = require('../models/reviewModel.js');

const multer = require('multer');
const sharp = require('sharp');

exports.getAllAnimes = catchAssyncErr(async (req, res, next) => {
  let filter = {};
  if (req.query.slugFilter) {
    filter.slug = req.query.slugFilter;
  }

  const query = new APIFeatures(Anime.find(filter), req.query, 'Anime')
    .sort()
    .paginate();

  const DOCS_PER_PAGE = 5;
  const total = await Anime.countDocuments(filter);

  // This will only run if the search query was invalid
  if (total === 0) {
    throw new AppError(
      'Unable to find an anime with such title',
      404,
      'Invalid input'
    );
  }
  const pagesTotal = Math.ceil(total / DOCS_PER_PAGE);

  const data = await query.mongooseQuery;
  res.status(201).json({
    status: 'success',
    data,
    pagesTotal,
  });
});

exports.getGenres = catchAssyncErr(async (req, res, next) => {
  const { id } = req.params;
  const anime = await Anime.findById(id);
  res.status(200).json({
    status: 'success',
    message: 'Genres for this anime retrieved',
    data: anime.genres,
  });
});

// MULTER CONFIGURATION
// Store in buffer first, do not write to disk immediately cause I wanna process and edit the uploaded avatar
const buffer = multer.memoryStorage();
const filter = (req, file, cb) => {
  // want the uploaded file to be an image (i do a check on the client side too, but just in case)
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'The file you are trying to upload is not an image',
        400,
        'Wrong file format'
      ),
      false
    );
  }
};

const upload = multer({
  storage: buffer,
  fileFilter: filter,
});

exports.uploadImageCover = upload.single('imageCover');

// then add image processing to route's middleware stack
exports.processImage = catchAssyncErr(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${req.params.id}.jpeg`;
  req.filename = filename; // will need this for DB reference
  await sharp(req.file.buffer)
    .resize(250, 350)
    .toFormat('jpeg')
    .jpeg()
    .toFile(`public/img/anime/${filename}`);
  next();
});

const filteredBody = (object, ...fields) => {
  const filtered = {};
  fields.forEach((key) => {
    filtered[key] = object[key];
  });
  return filtered;
};

const slugify = (string) => {
  return string
    .split(' ')
    .map((word) => {
      const lowered = word.toLowerCase();
      return lowered.replace(/[^A-Za-z]/g, '');
    })
    .join('-');
};

const filterAnimeBody = (req) => {
  const updates = filteredBody(
    req.body,
    'title',
    'japaneseTitle',
    'authors',
    'releaseYear',
    'genres',
    'ageAdvice',
    'duration',
    'summary',
    'status'
  );

  if (req.filename) updates.imageCover = req.filename;
  // On the client side the array was joined into a string with - delimiter => need to re-asseble it back to the array on the server
  if (updates.genres.includes('-')) {
    updates.genres = updates.genres.split('-');
  }
  // Authors are passed as a string with \n separation, needs to be proccessed properly
  if (updates.authors.includes('\n')) {
    updates.authors = updates.authors.split('\n');
  }
  return updates;
};

exports.adminUpdateAnime = catchAssyncErr(async (req, res, next) => {
  const updates = filterAnimeBody(req);
  // Need to update the .slug property (on create/save this is handled in pre-save middleware, however findOneAndUpdate is a query middleware, and it can be easier done here in the controller)
  updates.slug = slugify(updates.title);
  await Anime.findByIdAndUpdate(req.params.id, updates, {
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    name: 'Profile updated',
    message: 'Changes have been applied to your profile',
  });
});

const processImagePostSavingDoc = async (req, id) => {
  const filename = `${id}.jpeg`;
  await sharp(req.file.buffer)
    .resize(250, 350)
    .toFormat('jpeg')
    .jpeg()
    .toFile(`public/img/anime/${filename}`);

  return filename;
};

exports.adminCreateAnime = catchAssyncErr(async (req, res, next) => {
  const anime = filterAnimeBody(req);
  if (!req.file) {
    throw new AppError(
      'Image cover for the anime page was not provided',
      400,
      'Invalid input data'
    );
  }
  const newAnime = await Anime.create(anime);
  const filename = await processImagePostSavingDoc(req, newAnime._id);
  await Anime.findByIdAndUpdate(newAnime._id, {
    imageCover: filename,
  });
  res.status(200).json({
    status: 'success',
    name: 'Anime created',
    message: 'Anime has been added to the portal',
  });
});

exports.adminDeleteAnime = catchAssyncErr(async (req, res, next) => {
  const { id } = req.params;
  await Review.deleteMany({ anime: id });
  await Anime.findByIdAndDelete(id);
  res.status(200).json({
    status: 'success',
    message:
      'Anime has been deleted its corresponding reviews has been deleted',
    name: 'Anime deleted',
  });
});
