const express = require('express');
const methodOverride = require('method-override');

const catchAsync = require('../utils/catchAsync');
const { postSchema } = require('../utils/schema');
const {
    isLoggedIn,
    isAuthor,
    validatePost
    } = require('../middleware/middleware')

const Post = require('../models/modelPost');

const router = express.Router();

router.get('/', catchAsync (async (req,res) => {
    const posts = await Post.find({});
    res.render('posts', { posts });
}));

router.get('/new', isLoggedIn, (req,res) => {
    res.render('new')
})

router.post('/', isLoggedIn, validatePost, catchAsync (async (req,res) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Post created!');
    res.redirect(`/posts/${post._id}`);
}));

router.get('/:id', catchAsync (async (req,res) => {
    const posts = await Post.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(posts)
    if(!posts){
        req.flash('error', 'Cannot find post');
        return res.redirect('/posts')
    }
    res.render('show', { posts });
}));

router.get('/:id/update', isLoggedIn, isAuthor, catchAsync (async (req, res) => {
    const {id} = req.params;
    const posts = await Post.findById(id);
    if(!posts){
        req.flash('error', 'Post doesnt exist')
        return res.redirect(`/posts/${id}`)
    }
    res.render('edit', { posts });
}));

router.put('/:id', isLoggedIn, isAuthor, validatePost, catchAsync (async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    req.flash('success', 'Your post has been updated!')
    res.redirect(`/posts/${post._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Your post has been deleted!')
    res.redirect('/posts');
}));

module.exports = router;