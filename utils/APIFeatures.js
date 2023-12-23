module.exports = class {
  constructor(mongooseQuery, queryFromRequest) {
    this.mongooseQuery = mongooseQuery;
    this.queryFromRequest = queryFromRequest;
  }

  sort() {
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
