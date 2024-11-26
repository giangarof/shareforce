import express from 'express';
import methodOverride from 'method-override';
import multer  from 'multer';
import {storage} from '../cloudinary/config.js'
const upload = multer({ storage })

const router = express.Router();

import {
    index,
    create,
    profile,
    newRender,
    findOne,
    updateForm,
    submitUpdate,
    deletePost,
    userDislike,
    userLike
} from '../controllers/postsCtrl.js'
import catchAsync from '../utils/catchAsync.js'
import { postSchema } from '../utils/schema.js'
import {
    isLoggedIn,
    isAuthor,
    validatePost,
    isProfile
    } from '../middleware/middleware.js'

router.get('/', catchAsync(index));
router.post('/', isLoggedIn, upload.array('image'), validatePost, catchAsync (create));
router.get('/profile/:id', isLoggedIn, isProfile, profile);
router.get('/new', isLoggedIn, newRender);

router.get('/:id', catchAsync(findOne));
router.get('/:id/update', isLoggedIn, isAuthor, catchAsync (updateForm));
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validatePost, catchAsync (submitUpdate));
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deletePost));
router.post('/:id/like', isLoggedIn, catchAsync(userLike))
router.post('/:id/dislike', isLoggedIn, catchAsync(userDislike))


export default router;