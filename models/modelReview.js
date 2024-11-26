import mongoose from 'mongoose';
// const Schema = mongoose.Schema;

const ReviewSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    like: Number,
    dislike: Number,
});

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
