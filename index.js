// storing env vars locally when in development mode
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


// npm packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const mongoDBStore = require('connect-mongo')(session);
 
// mongoose models
const Cafe = require('./models/cafe');
const Review = require('./models/review');
const User = require('./models/user');

// utils
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const {validateCafe, validateReview} = require('./middleware')

// routes
const cafeRoutes = require('./routes/cafes');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// connecting to mongo db
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/cafe-central';
const dbUrl = 'mongodb://localhost:27017/cafe-central';
mongoose.connect(dbUrl, { autoIndex: false })
    .catch(error => handleError(error)); // initial connection errors
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error')); // errors after inital connection
db.once('open', () => { // successful connection
    console.log('mongo db connected');
});

const app = express();

// setting up ejs as the template engine for express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //default folder for templates
app.engine('ejs', ejsMate);


// other express configs
app.use(express.urlencoded({ extended: true })); // parsing data from forms
app.use(methodOverride('_method')); // for non get/post reqs
app.use(express.static(path.join(__dirname, 'public'))); // serving static assets
app.use(mongoSanitize()); // prevents mongo injection


const secret = process.env.SECRET || 'devbackupsecret'

// setting mongo as the session store
const store = new mongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24*60*60 // only saves session every 24 hours instead of at every refresh (if the data hasn't changed)
});

// check for errors in the store
store.on('error', function(e)  {
    console.log('session store error: ', e)
});

const sessionOptions = {
    store, // using mongo to store the session info
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7, // one week
        maxAge:1000*60*60*24*7,
        httpOnly: true, // extra security, can't access cookies via JS
        // secure: true // cookie only works thru https (breaks in dev mode since localhost is not secure)
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://ka-f.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://ka-f.fontawesome.com/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://ka-f.fontawesome.com/",
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
    "https://ka-f.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dixemyxo3/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session()); //middleware for persistent login sessions (has to go after session())
passport.use(new localStrategy(User.authenticate())); //telling passport to use this method from the user model plugin
passport.serializeUser(User.serializeUser()); // how to store a user in the session (adds user id)
passport.deserializeUser(User.deserializeUser()); // how to remove user from session (removes user id)


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; // req.user gets the user id from the session (which was added via passport)
    res.locals.url = req.originalUrl;
    next(); // need to move on to the routes!!
});


// enabling routes
app.use('/cafes', cafeRoutes);
app.use('/cafes/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
});







// handles any requests that don't hit a route
// specifies error type before passing on to next handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// generic error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err; // default to generic server-side
    if (!err.message) {
        err.message = 'Oh no! Something went wrong!';
    }
    if (process.env.NODE_ENV !== 'production') {
        res.status(statusCode).render('error', {err});
    }
    else {
        res.status(404).render('404');
    }
})




const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`serving on port ${port}`);
})