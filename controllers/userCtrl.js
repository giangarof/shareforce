import User from '../models/modelUser.js';

const renderRegister = (req, res) => {
    res.render('user/register')
};

const createUser = async(req,res) => {
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

const loginForm = (req, res) => {
    res.render('user/login')
};

const submitLogin = (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}`);
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo;
    console.log(res)
    res.redirect(redirectUrl);
}

const logout = (req,res) => {
    req.logout();
    req.flash('success', 'See you later!')
    res.redirect('/posts');
}

export {
    renderRegister,
    createUser,
    loginForm,
    submitLogin,
    logout
}