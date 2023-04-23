// only authenticated user should enter index page
function checkAuthenticated(req, res, next) {
    console.log('req.body', req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/users/login");
    }
}

// unauthenticated user should not enter index page 
function checkNotAuthenticated(req, res, next) {
    // console.log(req.body)
    if (req.isAuthenticated()) {
        return res.redirect("/users/dashboard");
    }
    next();
}

module.exports.checkAuthenticated = checkAuthenticated
module.exports.checkNotAuthenticated = checkNotAuthenticated