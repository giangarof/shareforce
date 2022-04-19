const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    like: Number,
    dislike: Number,
});

module.exports = mongoose.model('Review', Review);
