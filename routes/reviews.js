const express = require('express');
const methodOverride = require('method-override');

const catchAsync = require('../utils/catchAsync');

const Review = require('../models/modelReview');
const Post = require('../models/modelPost');
const {
    isLoggedIn,
    isAuthor,
    isReviewAuthor,
    validatePost,
    validateReview,
    } = require('../middleware/middleware')

const router = express.Router({mergeParams:true});

router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const post = await Post.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success', 'Comment added!')
    res.redirect(`/posts/${post._id}`)
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, isAuthor, catchAsync(async(req,res) => {
    const {id, reviewId } = req.params;
    await Post.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Comment deleted!')
    res.redirect(`/posts/${id}`)
}))

module.exports = router