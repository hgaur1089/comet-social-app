module.exports.profile = function(req, res){
    res.render('user_profile.ejs', {
        title: 'User Profile Page',
    })
}

//render Sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "Comet | Sign Up"
    })
}

//render Sign in page
module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: "Comet | Sign In"
    })
}