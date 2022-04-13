const express = require('express');
const path = require('path');

const db = require('./mongo/connection');
const Post = require('./models/modelPost');

const app = express();
const PORT = process.env.port || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req,res) => {
    res.render('home');
});

app.get('/post', async(req,res) => {
    const post = new Post ({title: 'first another'})
    await post.save();
    res.send(post)
})

app.listen(PORT, () => {
    console.log('connected');
});