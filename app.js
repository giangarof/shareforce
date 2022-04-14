const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const db = require('./mongo/connection');
const Post = require('./models/modelPost');

const app = express();
const PORT = process.env.port || 3000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/', (req,res) => {
    res.render('home');
});

app.get('/posts', async (req,res) => {
    const posts = await Post.find({});
    res.render('posts', { posts });
});

app.get('/posts/new', (req,res) => {
    res.render('new')
})

app.post('/posts', async (req,res) => {
    const post = new Post(req.body.posts)
    await post.save();
    res.redirect(`/posts/${post._id}`)
})

app.get('/posts/:id', async (req,res) => {
    const posts = await Post.findById(req.params.id);
    res.render('show', { posts });
})

app.get('/posts/:id/update', async (req, res) => {
    const posts = await Post.findById(req.params.id);
    res.render('edit', { posts });
})

app.put('/posts/:id', async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.posts});
    res.redirect(`/posts/${post._id}`)
})

app.delete('/posts/:id', async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndDelete(id);
    res.redirect('/posts');
})

app.listen(PORT, () => {
    console.log('connected');
});