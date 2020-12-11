const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.get(
  "/:reviewId/edit",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.renderReviewEditForm)
);

router
  .route("/:reviewId")
  .put(isLoggedIn, isReviewAuthor, catchAsync(reviews.updateReview))
  .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
