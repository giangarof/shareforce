const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

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

const sessionConfig = {
    secret: '1234',
    resave: false,
    saveUninitilized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

//flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})


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