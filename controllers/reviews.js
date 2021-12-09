const catchAsync = require('../utilities/catchAsync');
const Cafe = require('../models/cafe');
const Review = require('../models/review');
const { validateReview, ensureLogin, ensureReviewAuthor, ensureFirstReview } = require('../middleware');

// ADDING REVIEW (backend)
module.exports.new = catchAsync(async(req, res) => {
    const review = new Review(req.body.review);
    review.author = req.user.id;
    review.date = new Date();
    const {id} = req.params; // cafe id from url
    const cafe = await Cafe.findById(id);
    cafe.reviews.push(review);
    await review.save();
    await cafe.save();
    res.redirect(`/cafes/${id}`);
});

// DELETING A REVIEW (backend);
module.exports.delete = catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    const review = await Review.findByIdAndDelete(reviewId);
    await Cafe.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    res.redirect(`/cafes/${id}`);
});