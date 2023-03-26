var express = require('express');
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server, {
    cors: {
      origin: '*'
    }
  });
const socketapi = {
    io: io
};

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        console.log(userName)
        socket.join(roomId);
        // socket.to(roomId).emit("user-connected", userId);
        setTimeout(()=>{
            socket.to(roomId).emit("user-connected", userId);
        }, 1000)
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
        // Disconnect User
        socket.on('disconnect', () => {
            //We want to broadcast on exiting of a person
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    });
});

module.exports = socketapi;