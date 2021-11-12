const Post = require('../models/post');
const User = require('../models/users');

module.exports.home = async function(req, res){

    // Post.find({}, function(err, posts){
    //     return res.render('home.ejs', {
    //         title: "Comet | Home",
    //         posts: posts
    //     }); 
    // })

    try{
        //populate the user of each post 
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: [{
                    path: 'user'
            },{
                path: 'likes'
            }], 
        }).populate('likes');

        let users = await User.find({})
            
        return res.render('home.ejs', {
            title: "Comet | Home",
            posts: posts,
            all_users: users
        });
    }catch(err){
        console.log('Error', err);
        return;
    }
    
}   