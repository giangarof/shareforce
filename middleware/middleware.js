module.exports.isLoggedIn = (req,res,next) => {
    console.log('user', req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must sign in first')
        return res.redirect('/login')
    }
    next();
};