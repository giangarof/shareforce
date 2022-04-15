const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { postSchema, reviewSchema } = require('./utils/schema');
const Post = require('./models/modelPost');
const Review = require('./models/modelReview');

const db = require('./mongo/connection');
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
    } else{ next() }
}

const validateReview = (req, res, next) => {
    const {err} = reviewSchema.validate(req.body);
    
    if(err){
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
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        }
        const post = new Post(req.body.post)
        await post.save();
        res.redirect(`/posts/${post._id}`)
}));

app.get('/posts/:id', catchAsync (async (req,res) => {
    const posts = await Post.findById(req.params.id).populate('reviews');
    console.log(posts)
    res.render('show', { posts });
}));

app.get('/posts/:id/update', catchAsync (async (req, res) => {
    const posts = await Post.findById(req.params.id);
    res.render('edit', { posts });
}));

app.put('/posts/:id', validatePost, catchAsync (async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    res.redirect(`/posts/${post._id}`)
}));

app.delete('/posts/:id', catchAsync (async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/posts');
}));

//comments

app.post('/posts/:id/review', validateReview, catchAsync(async(req, res) => {
    const post = await Post.findById(req.params.id);
    const review = new Review(req.body.review);
    post.reviews.push(review);
    await review.save();
    await post.save();
    res.redirect(`/posts/${post._id}`)
}));

app.delete('/posts/:id/review/:reviewId', catchAsync(async(req,res) => {
    const {id, reviewId } = req.params;
    await Post.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/posts/${id}`)
}))

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