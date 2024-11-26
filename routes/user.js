import express from 'express';
import catchAsync from '../utils/catchAsync.js'
import {
    renderRegister,
    createUser,
    loginForm,
    submitLogin,
    logout
} from '../controllers/userCtrl.js'
import User from '../models/modelUser.js'
import passport from 'passport'

const router = express.Router();

router.get('/register', renderRegister)

router.post('/register', catchAsync (createUser));

router.get('/login', loginForm)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), submitLogin)

router.get('/logout', logout)



export default router;