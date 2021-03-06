const nodemailer = require('../config/nodemailer');

//this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodemailer.renderedTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
       from: 'comet.in',
       to: comment.user.email,
       subject: "New Comment Published",
       html: htmlString,
    },  (err, info) => {
        if(err){
            console.log('error in sending mail', err);
            return;
        }

         console.log('mail deliveres', info);
        return;
    });
}