const capitalize = require('./capitalize');

const ensureArray = (obj) => {
    if(!Array.isArray(obj)) { // not an array (single element)
        return [obj]; // convert to array
    }
    else {
        return obj; 
    }
}

module.exports = (query) => {
    let applied = {};
    if (query.pf) { // price filters
        const priceArr = ensureArray(query.pf).map(str => parseInt(str)); // price is stored in mongodb as an int but send from form as a str
        applied.price = priceArr;
    }
    if (query.cf) {
        const catArr = ensureArray(query.cf).map(str => capitalize(str)); // categories are capitalized in mongodb but not from the form
        applied.categories = catArr;
    }
    if (query.mult) {
        applied.mult = query.mult;
    }
    if (query.df) {
        applied.distance = query.df;
    }
    if (query.name) {
        applied.name = query.name; // search by cafe name
    }
    return applied;
}