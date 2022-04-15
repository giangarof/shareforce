const express = require('express');
const methodOverride = require('method-override');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../utils/schema');

const Review = require('../models/modelReview');
const Post = require('../models/modelPost');

const router = express.Router({mergeParams:true});

const validateReview = (req, res, next) => {
    const {err} = reviewSchema.validate(req.body);
    
    if(err){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }

}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const post = await Post.findById(req.params.id);
    const review = new Review(req.body.review);
    post.reviews.push(review);
    await review.save();
    await post.save();
    res.redirect(`/posts/${post._id}`)
}));

router.delete('/:reviewId', catchAsync(async(req,res) => {
    const {id, reviewId } = req.params;
    await Post.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/posts/${id}`)
}))

module.exports = router