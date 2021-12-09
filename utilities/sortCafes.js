const Cafe = require('../models/cafe');


module.exports = async(sortQuery, filter = null) => {
    if (sortQuery === 'review') {
        let cafes = await Cafe.find(filter).populate('reviews', 'rating'); // all cafes
        cafes.sort((a,b) => (a.avgRating < b.avgRating) ? 1 : (a.avgRating === b.avgRating) ? ((a.reviews.length < b.reviews.length) ? 1 : -1) : -1); // returning 1 puts b before a
        return cafes;
    }
    else if (sortQuery === 'nameAsc') {
        const cafes = await Cafe.find(filter).sort({name: 1}).populate('reviews', 'rating'); //name: ascending
        return cafes;
    }
    else if (sortQuery === 'nameDes') {
        const cafes = await Cafe.find(filter).sort({name: -1}).populate('reviews', 'rating'); //name: descending
        return cafes;
    }
    else if (sortQuery === '' || sortQuery === 'dist') {
        const cafes = await Cafe.find(filter).populate('reviews', 'rating'); // unsorted
        return cafes;
    }
};