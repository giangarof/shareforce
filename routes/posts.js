const express = require('express');
const methodOverride = require('method-override');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { postSchema } = require('../utils/schema');


const Post = require('../models/modelPost');

const router = express.Router();

const validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{ next() }
}

router.get('/', catchAsync (async (req,res) => {
    const posts = await Post.find({});
    res.render('posts', { posts });
}));

router.get('/new', (req,res) => {
    res.render('new')
})

router.post('/', validatePost, catchAsync (async (req,res) => {
    const post = new Post(req.body.post);
    await post.save();
    req.flash('success', 'Post created!');
    res.redirect(`/posts/${post._id}`);
}));

router.get('/:id', catchAsync (async (req,res) => {
    const posts = await Post.findById(req.params.id).populate('reviews');
    if(!posts){
        req.flash('error', 'Cannot find post');
        return res.redirect('/posts')
    }
    console.log(posts)
    res.render('show', { posts });
}));

router.get('/:id/update', catchAsync (async (req, res) => {
    const posts = await Post.findById(req.params.id);
    res.render('edit', { posts });
}));

router.put('/:id', validatePost, catchAsync (async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    req.flash('success', 'Your post has been updated!')
    res.redirect(`/posts/${post._id}`)
}));

router.delete('/:id', catchAsync (async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Your post has been deleted!')
    res.redirect('/posts');
}));

module.exports = router;