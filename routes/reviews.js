const express = require('express');
const router = express.Router({mergeParams: true}); // lets us access the req.params from index.js (aka :id)
const { validateReview, ensureLogin, ensureReviewAuthor, ensureFirstReview } = require('../middleware');
const reviews = require('../controllers/reviews');

// BASE URL: /CAFES/:ID/REVIEWS
router.post('/', ensureLogin, ensureFirstReview, validateReview, reviews.new);


router.delete('/:reviewId', ensureLogin, ensureReviewAuthor, reviews.delete);


module.exports = router;