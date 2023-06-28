

module.exports = function (req, res, next) {
    if (req.user.admin) {
        return next()
    }
    else {
        req.flash("error_msg", "This page is for admin only")
        res.redirect('/')
    }
}