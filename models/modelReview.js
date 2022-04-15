const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = new Schema({
    body: String,
    like: Number,
    dislike: Number,
});

module.exports = mongoose.model('Review', Review);
