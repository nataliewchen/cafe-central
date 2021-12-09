const catchAsync = require('../utilities/catchAsync');
const sortCafes = require('../utilities/sortCafes');
const formatQueries = require('../utilities/formatQueries');
const createFilter = require('../utilities/createFilter');
const User = require('../models/user');
const Cafe = require('../models/cafe');
const passport = require('passport');

// SHOWING FORM TO REGISTER
module.exports.registerForm = (req, res) => {
    res.render('users/register');
};

// ADDING NEW USER (backend)
module.exports.register = catchAsync(async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const tempUser = new User({username, email});
        const user = await User.register(tempUser, password); // static method from passport-local-mongoose; does the password hashing and registration
        req.login(user, (err) => { //automatically log them in after registration
            if(err) { //have to include the callback as part of the function setup
                return next(err);
            } else {
                req.flash('success','Welcome to Cafe Central!')
                res.redirect('/cafes');
            }
        });
    } catch(err) { // displays the error message on the same page instead of redirecting to error template (better UI)
        if(err.code === 11000) { // duplicate email
            err.message = 'A user with the given email is already registered';
        }
        req.flash('error', err.message);
        res.redirect('/register');
    }
});

// SHOWING FORM TO LOGIN
module.exports.loginForm = (req, res) => {
    res.render('users/login', {loc: null, name: null});
};

// LOGGING IN USER
module.exports.login = (req, res) => {
    // passport middleware does the heavy lifting
    req.flash('success', `Welcome back, ${req.user.username}!`);
    const redirectUrl = req.session.returnTo || '/'; // default redirect back to index
    delete req.session.returnTo; // clearing out the session
    res.redirect(redirectUrl);
};

// LOGGING OUT USER
module.exports.logout = (req, res) => {
    req.logout(); // passport functionality
    req.flash('success', 'Logged out!');
    res.redirect('/');
};

// SHOWING CAFES ADDED BY THE USER
module.exports.myCafes = catchAsync(async(req, res) => {
    const {userId} = req.params
    const sort = req.query.srt || '';
    const applied = formatQueries(req.query); // ensuring arrays and correct types for filters
    const filter = createFilter(applied); // based on filters and name
    filter.author = userId; // adding to filer: only including cafes where user is author
    const cafes = await sortCafes(sort, filter);
    const heading = 'My Cafes';
    res.render('cafes/index', {cafes, heading, sort, applied});
});

// ADDING CAFE TO USER'S FAVES
module.exports.addFavorite = catchAsync(async(req, res) => {
    const {userId, id} = req.params;
    const user = await User.findById(userId);
    const cafe = await Cafe.findById(id);
    user.favorites.push(cafe);
    await user.save();
    res.redirect(`/cafes/${id}`);
});

// REMOVING CAFE FROM USER'S FAVES
module.exports.removeFavorite = catchAsync(async(req, res) => {
    const {userId, id} = req.params;
    const cafe = await Cafe.findById(id);
    await User.findByIdAndUpdate(userId, {$pull: {favorites: id}});
    res.redirect(`/cafes/${id}`);
});

// SHOWING USER'S FAVES
module.exports.favorites = catchAsync(async(req, res) => {
    const {userId} = req.params;
    const user = await User.findById(userId);
    const favorites = user.favorites;
    const sort = req.query.srt || '';
    const applied = formatQueries(req.query); // ensuring arrays and correct types for filters
    const filter = createFilter(applied); // based on filters and name
    filter._id = {$in: favorites}; // adding to filter object: only cafes with the id's that match user faves
    const cafes = await sortCafes(sort, filter);
    const heading = 'Favorites';
    res.render('cafes/index', {cafes, heading, sort, applied});
})