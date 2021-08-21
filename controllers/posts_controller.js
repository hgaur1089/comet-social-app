const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id,
    }, function(err, post){
        if(err){console.log('error in creating a post'); return;}

        return res.redirect('back');
    });
    
}

module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        //to check if post user(who uploaded the post) and the the logged in user are same(who wants to delete the post)
        //.id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();

            //delete comments releted to that post
            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect('back');
            });   
        } else {
            return res.redirect('back');
        }
    });
}