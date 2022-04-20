const User = require('../models/modelUser');

module.exports.renderRegister = (req, res) => {
    res.render('user/register')
};

module.exports.createUser = async(req,res) => {
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
}

module.exports.loginForm = (req, res) => {
    res.render('user/login')
};

module.exports.submitLogin = (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}`);
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success', 'See you later!')
    res.redirect('/posts');
}