const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./modelReview');
const user = require('./modelUser');

const ImageSchema = new Schema({
    url: String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_250');
})

const Post = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    images: [ImageSchema],
    description: String,
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
});

Post.post('findOneAndDelete', async function(doc){
    if(doc){
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Post', Post);