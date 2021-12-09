const express = require('express');
const router = express.Router(); 
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');
const {ensureLogin} = require('../middleware');
const Cafe = require('../models/cafe')
const users = require('../controllers/users')



// BASE URL: /

router.route('/register')
    .get(users.registerForm)
    .post(users.register);

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login);

router.get('/logout', users.logout);


router.get('/user/:userId/my-cafes', ensureLogin, users.myCafes);

router.post('/user/:userId/cafes/:id', ensureLogin, users.addFavorite);

router.delete('/user/:userId/cafes/:id', ensureLogin, users.removeFavorite);

router.get('/user/:userId/favorites', ensureLogin, users.favorites);


module.exports = router;