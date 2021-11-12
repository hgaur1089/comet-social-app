const { v4: uuidv4 } = require("uuid");

module.exports.room = function(req, res){
    return res.redirect(`/room/${uuidv4()}`);
}

module.exports.roomid = function(req, res){
    return res.render('room.ejs', { 
        title: 'Chat Room',
        roomId: req.param.room ,
        layout: 'room_layout.ejs',
    });
}
