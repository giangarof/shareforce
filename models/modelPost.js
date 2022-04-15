const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./modelReview')

const Post = new Schema({
    owner: String,
    title: String,
    image: String,
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
    ]
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