const User = require('../models/users');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

//let keep it same as before
module.exports.profile = async function(req, res){

    // User.findById(req.params.id, function(err, user){
    //     return res.render('user_profile.ejs', {
    //         title: 'User Profile',
    //         profile_user: user,
    //         user_posts: post, 
    //     }); 
    // });
    try{
        //populate the user of each post 
        let posts = await Post.find({user: req.params.id})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }, 
        }).populate('likes');

        let user = await User.findById(req.params.id);

        return res.render('user_profile.ejs', {
            title: 'User Profile',
            profile_user: user,
            user_posts: posts, 
        });
    }catch(err){
        console.log('Error', err);
        return;
    }
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //                                           //req.body == {name: req.bosy.name, email: req.body.email}
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         return res.redirect('back');
    //     })
    // } else {
    //     return res.status(401).send('Unauthorized');
    // }
    //
    if(req.user.id == req.params.id){

        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('****Multer Error', err)};

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar)); 
                    }

                    //thi is saving the path of uploaded filr in the avatar filed in user
                    user.avatar = User.avatarPath + '/' + req.file.filename;

                }

                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    } else {
        return res.status(401).send('Unauthorized');
    }
}

//render Sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Comet | Sign Up"
    })
}
  
//render Sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Comet | Sign In"
    })
}

//get the sign-up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
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
    req.flash('success', 'Logged in Successfuly!');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have been Logged out Successfully!');
    return res.redirect('/');
}