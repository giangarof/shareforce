const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const userCtrl = require('../controllers/userCtrl');
const User = require('../models/modelUser');
const passport = require('passport');

router.get('/register', userCtrl.renderRegister)

router.post('/register', catchAsync (userCtrl.createUser));

router.get('/login', userCtrl.loginForm)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userCtrl.submitLogin)

router.get('/logout', userCtrl.logout)



module.exports = router;