// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

import {CloudinaryStorage} from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary'

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

export {cloudinary, storage}