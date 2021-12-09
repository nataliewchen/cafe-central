const mongoose = require('mongoose');
const cities = require('./cities');
const { terms, places } = require('./seedHelpers');
const Cafe = require('../models/cafe');


// connecting to mongo db
const dbUrl = 'mongodb://localhost:27017/cafe-central';
mongoose.connect(dbUrl)
    .catch(error => handleError(error)); // initial connection errors
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error')); // after inital connection
db.once('open', () => {
    console.log('mongo db connected');
});


// picks random element from array
const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const today = () => {
    const date = new Date();
    const day = date.getDay();
    const year = date.getFullYear();
    const month = new Intl.DateTimeFormat('en-US', {month:'long'}).format(date);
    return `${month} ${day}, ${year}`;
};

const categories = ['Coffee', 'Boba', 'Bakery'];


const seedDB = async() => {
    await Cafe.deleteMany({}); // clear db
    for (let i=0; i<25; ++i) {
        const rand = Math.floor(Math.random()*1000);
        const cafe = new Cafe({
            name: `${sample(terms)} ${sample(places)}`,
            images: [{url: 'https://res.cloudinary.com/dixemyxo3/image/upload/v1636762023/CafeCentral/qrj728dodfgbuvjw5wik.jpg',
                filename: 'qrj728dodfgbuvjw5wik'
            }],
            location: `${cities[rand].city}, ${cities[rand].state}`,
            geometry: { 
                type : "Point", 
                coordinates : [ cities[rand].longitude, cities[rand].latitude ] 
            },
            price: Math.floor(Math.random()*3) + 1, 
            rating: null,
            date: new Date(),
            author: '618c30005fb9cf089079386d',
            categories: categories[Math.floor(Math.random()*3)]
        });
        await cafe.save();
    };
};


seedDB().then(() => {
    mongoose.connection.close();
})