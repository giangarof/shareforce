const express = require('express');
const methodOverride = require('method-override');

const postCtrl = require('../controllers/postsCtrl')

const catchAsync = require('../utils/catchAsync');
const { postSchema } = require('../utils/schema');
const {
    isLoggedIn,
    isAuthor,
    validatePost
    } = require('../middleware/middleware')

const Post = require('../models/modelPost');
const User = require('../models/modelUser')

const router = express.Router();

router.get('/', catchAsync(postCtrl.index));
router.get('/new', isLoggedIn, postCtrl.new);
router.post('/', isLoggedIn, validatePost, catchAsync (postCtrl.create));
router.get('/:id', catchAsync (postCtrl.findOne));
router.get('/:id/update', isLoggedIn, isAuthor, catchAsync (postCtrl.updateForm));

router.put('/:id', isLoggedIn, isAuthor, validatePost, catchAsync (postCtrl.submitUpdate));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (postCtrl.delete));

module.exports = router;