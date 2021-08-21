const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id,
        });

        return res.redirect('back');

    }catch(err) {
        console.log('Error', err);
        return;
    }
    
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        //to check if post user(who uploaded the post) and the the logged in user are same(who wants to delete the post)
        //.id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();

            //delete comments releted to that post
            await Comment.deleteMany({post: req.params.id});  
            return res.redirect('back'); 
        } else {
            return res.redirect('back');
        } 
    }catch(err){
        console.log('Error', err);
        return;
    }
    
}