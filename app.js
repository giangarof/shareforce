const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError');;

const postRoutes = require('./routes/posts');
const reviewRoutes = require('./routes/reviews')

const db = require('./mongo/connection');
const app = express();
const PORT = process.env.port || 3000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postRoutes);
app.use('/posts/:id/review', reviewRoutes);


app.get('/', (req,res) => {
    res.render('home');
});

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