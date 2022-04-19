const Post = require('../models/modelPost')
const Review = require('../models/modelReview')
const ExpressError = require('../utils/ExpressError');
const { postSchema, reviewSchema } = require('../utils/schema');

module.exports.isLoggedIn = (req,res,next) => {
    console.log('user', req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must sign in first')
        return res.redirect('/login')
    }
    next();
};

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{ next() }
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    if(!post.author.equals(req.user._id)){
        req.flash('error', 'You are not the posts author')
        return res.redirect(`/posts/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You are not the posts author')
        return res.redirect(`/posts/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {err} = reviewSchema.validate(req.body);
    if(err){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }

}