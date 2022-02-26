const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ // connecting via my credentials
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({ //creating an instance of cloudinary storage in this file
    cloudinary,
    params: {
        folder: 'CafeCentral', //the folder in cloudinary where files will be saved
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
});

module.exports = {
    cloudinary,
    storage
};