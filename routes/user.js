const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/modelUser');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', catchAsync (async(req,res) => {
    try {
        const {email, name, password, username} = req.body;
        const newUser = new User({email, username, name});
        const registered = await User.register(newUser, password);
        req.login(registered, err => {
            if(err) return next(err)
            req.flash('success', 'Welcome to shareForce');
            res.redirect('/')
        })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    }
}));

router.get('/login', (req, res) => {
    res.render('user/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}`);
    const redirectUrl = req.session.returnTo || '/profile'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success', 'See you later!')
    res.redirect('/posts');
})



module.exports = router;