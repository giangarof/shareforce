// const { string } = require('joi');
import mongoose from 'mongoose';
// const Schema = mongoose.Schema;
import Review from './modelReview.js'
import User from './modelUser.js'

const ImageSchema = new mongoose.Schema({
    url: String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_250');
})

const PostSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    images: [ImageSchema],
    description: String,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
});

// Post.post('findOneAndDelete', async function(doc){
//     if(doc){
//         await review.deleteMany({
//             _id: {
//                 $in: doc.reviews
//             }
//         })
//     }
// })

const Post = mongoose.model('Post', PostSchema);

export default Post