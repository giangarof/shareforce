import dotenv from 'dotenv'

if(process.env.NODE_ENV !== 'production'){
    dotenv.config()
    // require('dotenv').config();
}
import express from 'express'
import session from 'express-session';
import flash from 'connect-flash'
import passport from 'passport';
import passportLocal from 'passport-local';
import mongoSanitize from 'express-mongo-sanitize';
import MongoStore from 'connect-mongo';
import path from 'path';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate'

// const express = require('express');
// const path = require('path');
// const methodOverride = require('method-override');
// const ejs = require('ejs');
// const session = require('express-session');
// const flash = require('connect-flash');
// const passport = require('passport');
// const passportLocal = require('passport-local');
// const mongoSanitize = require('express-mongo-sanitize');
// const MongoStore = require('connect-mongo');

import ExpressError from './utils/expressError.js';

import user from './routes/user.js'
import post from './routes/posts.js';
import review from './routes/reviews.js';
import User from './models/modelUser.js';

import db from './mongo/connection.js'
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/shareforce';
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

app.use('/posts', post);
app.use('/posts/:id/review', review);
app.use('/', user);

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