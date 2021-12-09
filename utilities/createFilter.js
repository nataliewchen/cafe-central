// NOTE: mongoose $in needs an array, but single checkboxes only return a string
module.exports = (applied) => {
    let filter = {};
    if (applied.price) { // price filters
        filter.price = {$in: applied.price};
    }
    if (applied.categories) {
        if (applied.mult === 'on') { // matches all selected categories
            filter.categories = {$all: applied.categories};
        } 
        else { // matches any selected categories
            filter.categories = {$in: applied.categories};
        }
    }
    if (applied.name) {
        filter.$text = {$search: applied.name};
    }
    return filter;
}