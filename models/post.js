const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const MEDIA_PATH = path.join('/uploads/posts/media');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    media: {
        type: String,
    },
    ismedia: {
        type: String,
        default: "false",
    },
    //include the array od ids of all comments in this post schema itself
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
}, {
    timestamps: true
});

let storage = multer.diskStorage({
    //cb => callbac function
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '..', MEDIA_PATH));
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now());
    }
});

//static
postSchema.statics.uploadedMedia = multer({ storage: storage}).single('media');
postSchema.statics.mediaPath = MEDIA_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;