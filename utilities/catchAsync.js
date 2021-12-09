module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}


// func = the original function that gets passed in
// returns a new function that adds .catch behavior to the original