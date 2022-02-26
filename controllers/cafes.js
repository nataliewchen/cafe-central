// utils
const catchAsync = require('../utilities/catchAsync');
const sortCafes = require('../utilities/sortCafes');
const formatQueries = require('../utilities/formatQueries');
const createFilter = require('../utilities/createFilter');
const capitalize = require('../utilities/capitalize');
const getCoordinates = require('../utilities/getCoordinates');
// models
const Cafe = require('../models/cafe');
const User = require('../models/user');
// npm packages
const haversine = require('haversine');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // creating a service client from mapbox
const geocodingClient = mbxGeocoding({accessToken: process.env.MAPBOX_TOKEN});
const geolib = require('geolib');

// SHOWING ALL CAFES
module.exports.index = catchAsync(async(req, res) => {
    const sort = req.query.srt || ''; // default to none
    const applied = formatQueries(req.query); // ensuring arrays and correct types for filters
    const filter = createFilter(applied); // mongodb filter based on filters and name
    const cafes = await sortCafes(sort, filter); // get appropriate cafes
    const heading = 'All Cafes';
    res.render('cafes/index', {cafes, heading, sort, applied});
});

// CREATING NEW CAFE (backend)
module.exports.new = catchAsync(async(req, res) => {
    const geoData = await geocodingClient.forwardGeocode({
        query: req.body.cafe.location,
        limit: 1
      }).send();
    const cafe = new Cafe(req.body.cafe); // assign info from req.body
    cafe.name = capitalize(req.body.cafe.name); // to avoid errors when sorting by name
    cafe.rating = null;
    cafe.date = new Date();
    cafe.author = req.user.id; // current user
    cafe.images = req.files.map(img => ({url: img.path, filename: img.filename})); // create array of els that store url/name of each uploaded img
    cafe.geometry = geoData.body.features[0].geometry;
    await cafe.save();
    req.flash('success', 'New cafe added!');
    res.redirect(`/cafes/${cafe.id}`);
});

// SHOWING FORM TO CREATE NEW 
module.exports.newForm = (req, res) => {
    res.render('cafes/new');
};

// SEARCHING BY NAME AND/OR LOCATION
module.exports.search = catchAsync(async(req, res) => {
    const {name, loc} = req.query;
    const sort = req.query.srt || ''; // defaults to none
    const applied = formatQueries(req.query); // ensuring arrays and correct types for filters
    const filter = createFilter(applied); // based on filters and name
    const cafes = await sortCafes(sort, filter);

    if (!loc) { // no geocoding
      const boundCoords = cafes.map(cafe => ({'latitude': cafe.geometry.coordinates[1], 'longitude': cafe.geometry.coordinates[0]}));
      const bounds = geolib.getBounds(boundCoords);
      const mapboxBounds = [[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]];
        res.render('cafes/searchResults', {cafes, applied, sort, name, loc, mapboxBounds});
    }
    else { // need to geocode
        getCoordinates(loc).then(start => {
            // calculate distance from origin to each cafe result
            for (let cafe of cafes) {
                const end = {
                    latitude: cafe.geometry.coordinates[1],
                    longitude: cafe.geometry.coordinates[0]
                };
                const distance = haversine(start, end, {unit: 'mile'});
                cafe.distance = Math.round(distance*10)/10; // save distance to each result
            }   
            const maxDist = req.query.df || 15; // within 15 miles or input from distance filter
            let filteredCafes = cafes.filter(cafe => cafe.distance < maxDist); // remove cafes that are too far
            if (sort === 'dist' || sort === '') {
                filteredCafes.sort((a,b) => a.distance > b.distance ? 1 : -1); // default: sort by distance
            }
            if (filteredCafes.length > 10) {
              filteredCafes = filteredCafes.slice(0, 10);
            }

            const boundCoords = filteredCafes.map(cafe => ({'latitude': cafe.geometry.coordinates[1], 'longitude': cafe.geometry.coordinates[0]}));
            const bounds = geolib.getBounds(boundCoords);
            const mapboxBounds = [[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]];

            res.render('cafes/searchResults', {cafes: filteredCafes, applied, sort, name, loc, mapboxBounds});
        }).catch(err => {
            console.log(err);
            req.flash('error', 'Sorry, your request could not be processed!');
            res.redirect('/cafes/searchResults');
        })
    }
});

// SHOWING DETAILS FOR INDIVIDUAL CAFE
module.exports.details = catchAsync(async(req, res) => {
    const {id} = req.params;
    const cafe = await Cafe.findById(id).populate({
        //nested populate bc we need cafe author AND review author
        path: 'reviews',
        populate: {
            path:'author'
    }}).populate('author');
    if (!cafe) {
        req.flash('error', 'Could not find cafe!');
        res.redirect('/cafes');
    }
    else {
        let inFavorites = false;
        if(req.user) { // someone logged in
            const user = await User.findById(req.user.id); // get id's of the user's favorites
            const favorites = user.favorites;
            inFavorites = favorites.includes(cafe.id); // if cafe is already in user's favorites
        }
        res.render('cafes/details', {cafe, inFavorites});
    }
});

// EDITING A CAFE (backend)
module.exports.edit = catchAsync(async(req, res) => {
    const {id} = req.params;
    const cafe = await Cafe.findByIdAndUpdate(id, {...req.body.cafe});
    cafe.name = capitalize(req.body.cafe.name); // to avoid errors with sorting
    // adding new images
    const images = req.files.map(img => ({ url: img.path, filename: img.filename })); // creates an array with an object for each image
    cafe.images.push(...images); // spreads the array into objects that can get added to the imgs array
    // deleting existing images
    if (req.body.deleteImages) {
        if (req.body.deleteImages.length === cafe.images.length) { // attempting to delete all existing images
            req.flash('error', 'At least one image is required!');
            return res.redirect(`/cafes/${id}`);
        }
        for (let filename of req.body.deleteImages) { // deleteImages is set up to store the filenames
            await cloudinary.uploader.destroy(filename); // CLOUDINARY: removes img from cloud
        }
        await cafe.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages }}}}); // MONGO: pull images from cafe where the filename is in the array of images we want to delete
    }
    await cafe.save();
    req.flash('success', 'Cafe edited!');
    res.redirect(`/cafes/${id}`);
});

// DELETING A CAFE (backend)
module.exports.delete = catchAsync(async(req, res) => {
    const {id} = req.params;
    const cafe = await Cafe.findByIdAndDelete(id);
    req.flash('success', 'Cafe deleted!');
    res.redirect('/cafes');
});

// SHOWING FORM TO EDIT
module.exports.editForm = catchAsync(async(req, res) => {
    const {id} = req.params;
    const cafe = await Cafe.findById(id);
     if (!cafe) {
        req.flash('error', 'Could not find cafe!');
        res.redirect('/cafes');
    }
    else {
        res.render('cafes/edit', {cafe});
    }
});