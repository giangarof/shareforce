const Post = require('../models/modelPost');

module.exports.profile = (req, res) => {
    res.render('profile')
}

module.exports.index = async (req,res) => {
    const posts = await Post.find({});
    res.render('posts', { posts });
};

module.exports.new = (req,res) => {
    res.render('new')
}

module.exports.create = async (req,res) => {
    const post = new Post(req.body.post);
    post.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Post created!');
    res.redirect(`/posts/${post._id}`);
}

module.exports.findOne = async (req,res) => {
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

module.exports.updateForm = async (req, res) => {
    const {id} = req.params;
    const posts = await Post.findById(id);
    if(!posts){
        req.flash('error', 'Post doesnt exist')
        return res.redirect(`/posts/${id}`)
    }
    res.render('edit', { posts });
}

module.exports.submitUpdate = async (req,res) => {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post});
    req.flash('success', 'Your post has been updated!')
    res.redirect(`/posts/${post._id}`)
}

module.exports.delete = async (req,res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Your post has been deleted!')
    res.redirect('/posts');
}