const Tour = require("../models/tours");
const Review = require("../models/review");

// CREATE - add new review to a particular tour
module.exports.createReview = async (req, res) => {
  // lookup tour using ID
  const tour = await Tour.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  tour.reviews.push(review);
  await review.save();
  await tour.save();
  req.flash("success", "Created new review!");
  res.redirect(`/tours/${tour._id}`);
};

// EDIT - show form to edit a review
module.exports.renderReviewEditForm = async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Cannot find that review!");
    return res.redirect("/tours");
  }
  res.render("tours/editReview", { id, review });
};

// UPDATE - update the review of a particular tour
module.exports.updateReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  const review = new Review(req.body.review);
  review.author = req.user._id;
  tour.reviews.push(review);
  await review.save();
  await tour.save();
  req.flash("success", "Successfully updated review!");
  res.redirect(`/tours/${id}`);
};

// DELETE - delete a review of a particular tour
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Tour.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/tours/${id}`);
};
