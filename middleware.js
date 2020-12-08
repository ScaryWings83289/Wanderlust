const { tourSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Tour = require("./models/tours");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateTour = (req, res, next) => {
  const { error } = tourSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  if (tour.author.equals(req.user._id) || req.user.isAdmin) {
    next();
  } else {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/tours/${id}`);
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (review.author.equals(req.user._id) || req.user.isAdmin) {
    next();
  } else {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/tours/${id}`);
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
