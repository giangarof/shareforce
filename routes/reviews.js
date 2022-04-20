const express = require('express');
const methodOverride = require('method-override');

const reviewCtrl = require('../controllers/reviewCtrl')
const catchAsync = require('../utils/catchAsync');

const Review = require('../models/modelReview');
const Post = require('../models/modelPost');
const {
    isLoggedIn,
    isAuthor,
    isReviewAuthor,
    validatePost,
    validateReview,
    } = require('../middleware/middleware')

const router = express.Router({mergeParams:true});

router.post('/', isLoggedIn, validateReview, catchAsync(reviewCtrl.create));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewCtrl.delete))

module.exports = router