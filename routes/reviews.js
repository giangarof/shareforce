import express from 'express'
import methodOverride from 'method-override'

import {create, deleteReview} from '../controllers/reviewCtrl.js'
import catchAsync from '../utils/catchAsync.js';

import Review from '../models/modelReview.js';
import Post from '../models/modelPost.js';
import {
    isLoggedIn,
    isAuthor,
    isReviewAuthor,
    validatePost,
    validateReview,
    } from '../middleware/middleware.js'

const router = express.Router({mergeParams:true});

router.post('/', isLoggedIn, validateReview, catchAsync(create));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview))

export default router