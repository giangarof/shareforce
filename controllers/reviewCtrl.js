const Review = require('../models/modelReview');
const Post = require('../models/modelPost');

module.exports.create = async(req, res) => {
    const post = await Post.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    post.reviews.push(review);
    await review.save();
    await post.save();
    req.flash('success', 'Comment added!')
    res.redirect(`/posts/${post._id}`)
}

module.exports.delete = async(req,res) => {
    const {id, reviewId } = req.params;
    await Post.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Comment deleted!')
    res.redirect(`/posts/${id}`)
}