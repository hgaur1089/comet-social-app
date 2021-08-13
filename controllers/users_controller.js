const User = require('../models/users');

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

//get the sign-up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return;}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user iwhile signing up'); return;}
            
                return res.redirect('/users/sign-in');
            })
        } else {
            return res.redirect('back');
        }

    })
}

//sign in and create a session for user
module.exports.createSession = function(req, res){
    //later
}