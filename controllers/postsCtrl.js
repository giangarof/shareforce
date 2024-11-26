import Post from '../models/modelPost.js';
import User from '../models/modelUser.js'
import {cloudinary} from '../cloudinary/config.js';

const profile = (req, res) => {
    User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            req.flash("error", "Something went wrong.");
            return res.redirect("/");
        }
        console.log(foundUser._id)
        Post.find().where('author').equals(foundUser).exec(function(err, posts){
            if(err) {
                req.flash("error", "Something went wrong.");
                return res.redirect("/");
            } 
            res.render("profile", {user: foundUser, posts: posts});
        })
    })
};

const index = async (req,res) => {
    const posts = await Post.find({});
    res.render('posts', { posts });
};

const newRender = (req,res) => {
    res.render('new')
}

const create = async (req,res) => {
    const post = new Post(req.body.post);
    post.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Post created!');
    res.redirect(`/posts/${post._id}`);
}

const findOne = async (req,res) => {
    const posts = await Post.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(posts)
    if(!posts){
        req.flash('error', 'Cannot find post');
        return res.redirect('/posts')
    }
    res.render('show', { posts });
}

const updateForm = async (req, res) => {
    const {id} = req.params;
    const posts = await Post.findById(id);
    if(!posts){
        req.flash('error', 'Post doesnt exist')
        return res.redirect(`/posts/${id}`)
    }
    res.render('edit', { posts });
}

const submitUpdate = async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    post.images.push(...imgs);
    await post.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await post.updateOne({$pull: {images: {filename: { $in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Your post has been updated!');
    res.redirect(`/posts/${post._id}`);
}

const deletePost = async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndDelete(id);
    for (let image of post.images) {
        await cloudinary.uploader.destroy(image.filename);
      } 
    req.flash('success', 'Your post has been deleted!')
    res.redirect('/posts');
}

const userLike = async (req, res) => {
    Post.findById(req.params.id, (err, foundCont) => {
        if(err){
            console.log(err);
            return res.redirect('/posts/')
        }

        const liked = foundCont.likes.some((like) => {
            return like.equals(req.user._id);
        });

        const disliked = foundCont.dislikes.some((noLike) => {
            return noLike.equals(req.user._id);
        });

        if(liked) {
            foundCont.likes.pull(req.user._id);
        } else {
            foundCont.dislikes.pull(req.user._id);
            foundCont.likes.push(req.user);
        }

        foundCont.save((err) => {
            if(err){
                console.log(err);
                return res.redirect('/posts/');
            }
            return res.redirect('/posts/' + foundCont._id);
        })
    })
}

const userDislike = async (req, res) => {
    Post.findById(req.params.id, (err, foundCont) => {
        if(err){
            console.log(err);
            return res.redirect('/posts/')
        }

        const liked = foundCont.likes.some((like) => {
            return like.equals(req.user._id);
        });

        const disliked = foundCont.dislikes.some((noLike) => {
            return noLike.equals(req.user._id);
        });

        if(disliked) {
            foundCont.dislikes.pull(req.user._id);
        } else {
            foundCont.likes.pull(req.user._id);
            foundCont.dislikes.push(req.user);
        }

        foundCont.save((err) => {
            if(err){
                console.log(err);
                return res.redirect('/posts/');
            }
            return res.redirect('/posts/' + foundCont._id);
        })
    })
}

export {
    profile,
    index,
    newRender,
    create,
    findOne,
    updateForm,
    submitUpdate,
    deletePost,
    userLike,
    userDislike
}