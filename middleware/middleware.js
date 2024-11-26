import Post from '../models/modelPost.js'
import User from '../models/modelUser.js'
import Review from '../models/modelReview.js'
import ExpressError from '../utils/expressError.js';
import { postSchema, reviewSchema } from '../utils/schema.js';


const isProfile = async (req,res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user.equals(req.user._id)){
        req.flash('error', 'You are not logged as this user')
        return res.redirect(`/home`)
    }
    next();
}

const isLoggedIn = (req,res,next) => {
    console.log('user', req.isAuthenticated())
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must sign in first')
        return res.redirect('/login')
    }
    // console.log(req)
    next();
};

const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{ next() }
};

const isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    if(!post.author.equals(req.user._id)){
        req.flash('error', 'You are not the posts author')
        return res.redirect(`/posts/${id}`)
    }
    next();
};

const isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You are not the posts author')
        return res.redirect(`/posts/${id}`)
    }
    next();
};

const validateReview = (req, res, next) => {
    const {err} = reviewSchema.validate(req.body);
    if(err){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }

};

export {
    validatePost, validateReview,
    isAuthor, isProfile, isLoggedIn, isReviewAuthor


}