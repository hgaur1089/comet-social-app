const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

const fs = require('fs');
const path = require('path');

module.exports.create = async function(req, res){
    try{
        console.log(req.body.ismedia);
        let post = await Post.create({
            content: req.body.content,
            user: req.body.user,
            media: req.body.media,
            ismedia: req.body.ismedia,
        });

        if(req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post,
                },
                message: "Post Created!",
            });
        }

        req.flash('success', 'Post Published!');
        return res.redirect('back');

    }catch(err) {
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
    
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        //to check if post user(who uploaded the post) and the the logged in user are same(who wants to delete the post)
        //.id means converting the object id into string
        if(post.user == req.user.id){

            //delete the associated likes for the post and all its comments like too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();

            //delete comments releted to that post
            await Comment.deleteMany({post: req.params.id}); 

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id,
                    },
                    message: "Post Deleted Successfully!",
                })
            }
            
            req.flash('success', 'Post Deleted!!');
            return res.redirect('back'); 
        } else {
            req.flash('error', 'You Cannot Delete this Post!');
            return res.redirect('back');
        } 
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}