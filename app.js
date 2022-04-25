if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

const ExpressError = require('./utils/expressError');;

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/posts');
const reviewRoutes = require('./routes/reviews');
const User = require('./models/modelUser');

const db = require('./mongo/connection');
const app = express();
const PORT = process.env.PORT || 3000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/shareforce';
const secret = process.env.SECRET || 'C+-jsgg6';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function(e) {
    console.log('error found', e)
})

const sessionConfig = {
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use('/posts', postRoutes);
app.use('/posts/:id/review', reviewRoutes);
app.use('/', userRoutes);

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
    console.log(`${PORT} connected`);
});