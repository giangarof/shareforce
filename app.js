const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const db = require('./mongo/connection');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const { postSchema } = require('./utils/schema')
const Post = require('./models/modelPost');
const { required } = require('joi');

const app = express();
const PORT = process.env.port || 3000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const validatePost = (req, res, next) => {
    
    const { error } = postSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

app.get('/', (req,res) => {
    res.render('home');
});

app.get('/posts', catchAsync (async (req,res) => {
    const posts = await Post.find({});
    res.render('posts', { posts });
}));

app.get('/posts/new', (req,res) => {
    res.render('new')
})

app.post('/posts', validatePost, catchAsync (async (req,res) => {
        const {error} = postSchema.validate(req.body);
        if(result.error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        }
        const post = new Post(req.body.posts)
        await post.save();
        res.redirect(`/posts/${post._id}`)
}));

app.get('/posts/:id', catchAsync (async (req,res) => {
    const posts = await Post.findById(req.params.id);
    res.render('show', { posts });
}));

app.get('/posts/:id/update', catchAsync (async (req, res) => {
    const posts = await Post.findById(req.params.id);
    res.render('edit', { posts });
}));

app.put('/posts/:id', catchAsync (async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.posts});
    res.redirect(`/posts/${post._id}`)
}));

app.delete('/posts/:id', catchAsync (async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndDelete(id);
    res.redirect('/posts');
}));

app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if(!err.msg) { err.msg = 'Something went wrong'}
    
    res.status(statusCode).render('error', { err })
});

app.listen(PORT, () => {
    console.log('connected');
});