const { cafeSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utilities/ExpressError');
const Cafe = require('./models/cafe');
const Review = require('./models/review');


module.exports.validateCafe = (req, res, next) => {
    const {error} = cafeSchema.validate(req.body); // check data against joi schema
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else { // no errors
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body); // check data against joi schema
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else { // no errors
        next();
    }
};


module.exports.ensureLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.originalUrl.includes('/reviews')) { // clicking link on details page to log in to leave a review
            req.session.returnTo = req.originalUrl.replace('/reviews', '#reviews'); // redirect to reviews section of the cafe
            res.redirect('/login');
        }
        else {
            req.session.returnTo = req.originalUrl; // save url from where original request was made
            req.flash('error', 'You must be logged in!');
            res.redirect('/login');
        }
    }
    else { // user is authenticated
        next();
    }
};


module.exports.ensureAuthor = async(req, res, next) => {
    const {id} = req.params; // since this middleware only runs on requests like /cafe/:id/edit
    const cafe = await Cafe.findById(id);
    if (!cafe.author.equals(req.user.id)) {
        req.flash('error', 'Sorry, you do not have permission to do that!');
        res.redirect(`/cafes/${id}`)
    }
    else if (req.user.id === '61b158f8f0e48943aab0fa5f') { // admin
        next();
    }
    else {
        next();
    }
};

// protects reviews from being deleted by non-authors
module.exports.ensureReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'Sorry, you do not have permission to do that!');
        res.redirect( `/cafes/${id}`);
    }
    else {
        next();
    }
}


// prevents users from submitting multiple reviews on the same cafe
module.exports.ensureFirstReview = async(req, res, next) => {
    const {id} = req.params;
    const cafe = await Cafe.findById(id).populate('reviews', 'author');
    for (let review of cafe.reviews) {
        if (review.author.equals(req.user.id)) {
            req.flash('error', 'You have already submitted a review for this cafe!');
            return res.redirect(`/cafes/${id}`);
        }
    }
    next();

}
