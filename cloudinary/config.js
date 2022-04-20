const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.APINAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'shareforce',
        allowedFormats: ['png', 'jpeg', 'jpg']
    }
});

module.exports = {cloudinary, storage}