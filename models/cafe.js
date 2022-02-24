const mongoose = require('mongoose');
const parseAddress = require('parse-address');
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user');


const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_150,ar_1.0,c_crop'); // from cloudinary images api
});

imageSchema.virtual('square').get(function() {
    return this.url.replace('/upload', '/upload/ar_1.0,c_crop'); // from cloudinary images api
});


const opts = { toJSON: {virtuals: true }}; // allows us to use our virtuals when we convert a document to JSON (aka when passing cafes into clusterMap.js)

const cafeSchema = new Schema({
    name: String,
    images: [imageSchema],
    location: String, 
    website: String,
    phone: String,
    price: Number,
    date: Date,
    categories: [String],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts);

cafeSchema.set('toObject', { getters: true }); // enabling access of virtuals in console.log

// showing number as a $ string
cafeSchema.virtual('priceString').get(function() {
    return '$'.repeat(this.price);
});

// date format: mm/dd/yy
cafeSchema.virtual('shortDate').get(function() {
    const [month, day, year] = [this.date.getMonth()+1, this.date.getDate(), this.date.getYear()-100];
    return `${month}/${day}/${year}`;
});

// date format: month day, year
cafeSchema.virtual('longDate').get(function() {
    const [day, year] = [this.date.getDate(), this.date.getFullYear()];
    const month = new Intl.DateTimeFormat('en-US', {month:'long'}).format(this.date);
    return `${month} ${day}, ${year}`;
});

// loc format: city, state
// for index pages (full address not needed)
cafeSchema.virtual('cityState').get(function() {
    const parsed = parseAddress.parseLocation(this.location);
    return `${parsed.city}, ${parsed.state}`;
});

// loc format: city, state
// for index pages (full address not needed)
cafeSchema.virtual('shortAddress').get(function() {
  const parsed = parseAddress.parseLocation(this.location);
  return `${parsed.number ? parsed.number : ''} ${parsed.prefix ? parsed.prefix : ''} ${parsed.street ? parsed.street : ''} ${parsed.type ? parsed.type : ''}`;
});

// average rating based on all added reviews
cafeSchema.virtual('avgRating').get(function() {
    if (this.reviews.length > 0) {
        const allRatings = [];
        for (let review of this.reviews) {
            allRatings.push(parseInt(review.rating)); // add all reviews ratings into array
        }
        const avg = allRatings.reduce((a, b) => a + b) / allRatings.length; // find average of review ratings
        const avgRating = Math.round(avg*10)/10;
        
        return avgRating;
    }
    else { // no reviews
        return null;
    }
});

// icons to display in template
cafeSchema.virtual('stars').get(function() {
    if (this.reviews.length > 0) {
        const full = Math.trunc(this.avgRating);
        const half = (this.avgRating % 1); // will display as one half regardless of remainder
        const empty = Math.trunc(5 - full - half);

        const fullStar = '<i class="bi bi-star-fill"></i>';
        const halfStar = '<i class="bi bi-star-half"></i>';
        const emptyStar = '<i class="bi bi-star"></i>';

        let starsHTML = `<span class="stars" title="${this.avgRating} out of 5 stars">`;

        for (let i=0; i<full; ++i) {
            starsHTML += fullStar;
        }
        if (half > 0) {
            starsHTML += halfStar;
        }
        for (let i=0; i<empty; ++i) {
            starsHTML += emptyStar;
        }
        starsHTML += `</span>`;
        return starsHTML;
    }
    else {
        return '<span class="text-muted">No reviews yet</span>';
    }
});

// num of reviews to display in template
cafeSchema.virtual('reviewLen').get(function() {
    if (this.reviews.length > 0) {
        return `<span class="reviewLen ms-1">(${this.reviews.length})</span>`;
    }
    else {
        return '';
    }
})


// adding middleware to delete associated reviews and update user favorites when cafe is deleted
// we delete cafes with findByIdAndDelete, which triggers the findOneAndDelete middleware
cafeSchema.post('findOneAndDelete', async function(doc){
    if (doc) { //if a doc was deleted (will get passed in)
        await Review.deleteMany({
            _id: {$in: doc.reviews} // deleting from review collection where id matches the id's found in the doc
        })
        const users = await User.find({favorites: doc.id}); // get users who had that cafe saved to favorites
        for (let user of users) {
            await user.updateOne({$pull: {favorites: doc.id}}); // remove cafe id from user's favorites
        }
    }
});



module.exports = mongoose.model('Cafe', cafeSchema, 'cafes');