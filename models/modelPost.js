const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    owner: String,
    title: String,
    image: String,
    description: String,
});

module.exports = mongoose.model('Post', Post);