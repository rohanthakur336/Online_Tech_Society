const User = require('./models/login');

module.exports.isLoggedIn = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/society/login');
    }
    next();
};

module.exports.isAdmin = async function(req, res, next) {
  const currentUser = await User.findById(req.user._id);
  if (currentUser.role!= "admin") {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('back');
}
next();
};

module.exports.isHeadorAdmin = async function(req, res, next) {
  const currentUser = await User.findById(req.user._id);
  if (currentUser.role!= "head"&&currentUser.role!= "admin") {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('back');
}
next();
};


