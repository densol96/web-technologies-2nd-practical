module.exports = class {
  constructor(mongooseQuery, queryFromRequest, collectionName) {
    this.mongooseQuery = mongooseQuery;
    this.queryFromRequest = queryFromRequest;
    this.collectionName = collectionName;
  }

  #sortAnimes() {
    if (this.queryFromRequest.sort) {
      // should get a proper sort=value from the client side so that this works with mongoose
      if (this.queryFromRequest.sort === 'latest') {
        this.mongooseQuery = this.mongooseQuery.sort({ addedAt: -1 });
      } else if (this.queryFromRequest.sort === 'oldest') {
        this.mongooseQuery = this.mongooseQuery.sort({ addedAt: 1 });
      } else if (this.queryFromRequest.sort === 'rating') {
        this.mongooseQuery = this.mongooseQuery.sort({ rating: -1 });
      } else if (this.queryFromRequest.sort === 'reviews') {
        this.mongooseQuery = this.mongooseQuery.sort({ reviewsTotal: -1 });
      }
    }
  }

  #sortReviews() {
    if (this.queryFromRequest.sort) {
      if (this.queryFromRequest.sort === 'latest') {
        this.mongooseQuery = this.mongooseQuery.sort({ addedAt: -1 });
      } else if (this.queryFromRequest.sort === 'oldest') {
        this.mongooseQuery = this.mongooseQuery.sort({ addedAt: 1 });
      } else if (this.queryFromRequest.sort === 'best') {
        this.mongooseQuery = this.mongooseQuery.sort({ rating: -1 });
      } else if (this.queryFromRequest.sort === 'worst') {
        this.mongooseQuery = this.mongooseQuery.sort({ rating: 1 });
      } else if (this.queryFromRequest.sort === 'checked') {
        this.mongooseQuery = this.mongooseQuery.sort({ checked: -1 });
      } else if (this.queryFromRequest.sort === 'not-checked') {
        this.mongooseQuery = this.mongooseQuery.sort({ checked: 1 });
      }
    }
  }

  #sortUsers() {
    if (this.queryFromRequest.sort) {
      if (this.queryFromRequest.sort === 'newest') {
        this.mongooseQuery = this.mongooseQuery.sort({ registrationDate: -1 });
      } else if (this.queryFromRequest.sort === 'oldest') {
        this.mongooseQuery = this.mongooseQuery.sort({ registrationDate: 1 });
      } else if (this.queryFromRequest.sort === 'admin') {
        this.mongooseQuery = this.mongooseQuery.sort({ role: 1 });
      } else if (this.queryFromRequest.sort === 'user') {
        this.mongooseQuery = this.mongooseQuery.sort({ role: -1 });
      } else if (this.queryFromRequest.sort === 'email-confirm') {
        this.mongooseQuery = this.mongooseQuery.sort({ emailConfirmed: -1 });
      } else if (this.queryFromRequest.sort === 'email-not-confirm') {
        this.mongooseQuery = this.mongooseQuery.sort({ emailConfirmed: 1 });
      }
    }
  }

  sort() {
    if (this.collectionName === 'Review') {
      this.#sortReviews();
    } else if (this.collectionName === 'Anime') {
      this.#sortAnimes();
    } else if (this.collectionName === 'User') {
      this.#sortUsers();
    }
    return this;
  }

  paginate() {
    const page = this.queryFromRequest.page ? +this.queryFromRequest.page : 1;
    const limit = this.queryFromRequest.limit
      ? +this.queryFromRequest.limit
      : +process.env.DEFAULT_LIMIT_PAGES;
    const skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
};
