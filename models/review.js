const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    headline: String,
    body: String,
    rating: Number,
    date: Date,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

reviewSchema.virtual('longDate').get(function() {
    const [day, year] = [this.date.getDate(), this.date.getFullYear()];
    const month = new Intl.DateTimeFormat('en-US', {month:'long'}).format(this.date);
    return `${month} ${day}, ${year}`;
});

reviewSchema.virtual('stars').get(function() {
    let starsHTML = '';
    const full = this.rating;
    const empty = 5-full;

    const fullStar = '<i class="bi bi-star-fill"></i>';
    const emptyStar = '<i class="bi bi-star"></i>';

    for (let i=0; i<full; ++i) {
        starsHTML += fullStar;
    }
    for (let i=0; i<empty; ++i) {
        starsHTML += emptyStar;
    }
    return starsHTML;
});

module.exports = mongoose.model('Review', reviewSchema);