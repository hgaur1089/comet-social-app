
const { ExpressPeerServer } = require('peer');

module.exports.roomSockets = function(socketServer, app){
    let io = require('socket.io')(socketServer, {
        cors: {
            origin:"http://localhost:8000", 
            methods: ["GET", "POST"]
        }
    });

    const peerServer = ExpressPeerServer(socketServer, {
        proxied: true,
        debug: true,
        path: '/peerjs',
        ssl: {}
    });
    app.use('/peerjs', peerServer);

    io.sockets.on('connection', (socket) => {
        console.log('new connection received', socket.id);

        socket.on('join-room', (roomId, userId) => {
            console.log('joining request received', roomId);
            socket.join(roomId);
            socket.to(roomId).broadcast.emit('user-connected', userId);
            socket.on("message", (message) => {
                io.to(roomId).emit("createMessage", message, userName);
            });
        });
    });

}