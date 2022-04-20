const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const multer  = require('multer');
const {storage} = require('../cloudinary/config')
const upload = multer({ storage })

const postCtrl = require('../controllers/postsCtrl')
const catchAsync = require('../utils/catchAsync');
const { postSchema } = require('../utils/schema');
const {
    isLoggedIn,
    isAuthor,
    validatePost
    } = require('../middleware/middleware')

router.get('/', catchAsync(postCtrl.index));
router.post('/', isLoggedIn, upload.array('image'), validatePost, catchAsync (postCtrl.create));
router.get('/profile', postCtrl.profile);
router.get('/new', isLoggedIn, postCtrl.new);

router.get('/:id', catchAsync (postCtrl.findOne));
router.get('/:id/update', isLoggedIn, isAuthor, catchAsync (postCtrl.updateForm));
router.put('/:id', isLoggedIn, isAuthor, validatePost, catchAsync (postCtrl.submitUpdate));
router.delete('/:id', isLoggedIn, isAuthor, catchAsync (postCtrl.delete));



module.exports = router;